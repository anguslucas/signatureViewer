const promise = require('bluebird'),
    fs = promise.promisifyAll(require('fs')),
    LineByLineReader = require('line-by-line'),
    config = require('../../config.json'),
    signatureLocation = config.signatures.location;
let signatureFiles = {};

function cleanDescription (description) {
    //strip away \ for multi-line description
    if (description[description.length - 1] === '\\') {
        description = description.slice(0, -1);
    }
    //get rid of spaces beginning and end
    description = description.trim();
    //remove "" surroundng string
    if (description[0] === '"') {
        description = description.substr(1);
    }
    if (description[description.length - 1] === '"') {
        description = description.slice(0, -1);
    }
    //get rid of spaces beginning and end again
    description = description.trim();
    return description;
}

function processFiles () {
    //Process all signature files into object where key is signature and value is file path
    fs.readdirSync(signatureLocation).forEach((directory) => {
        if (!directory.includes('.')) {
            fs.readdirSync(`${signatureLocation}/${directory}`).forEach((file) => {
                if (!file.includes('__init__') && !file.includes('compat')) {
                    const filePath = `${signatureLocation}/${directory}/${file}`,
                        lr = new LineByLineReader(filePath);
                    let buildingDescription = false,
                        descriptionPieces = [],
                        description = '';

                    lr.on('error', function (err) {
                        console.log(`Failed to read the file: ${err}`)
                    });

                    lr.on('line', function (line) {
                        if (line.trim().startsWith('description =') || line.trim().startsWith('description +=')) {
                            buildingDescription = true;
                            description = line.split('=')[1];
                            description = cleanDescription(description);
                            if (description !== '(') {
                                descriptionPieces.push(description);
                            }
                        } else if (buildingDescription) {
                            description = line.trim();
                            //if the description is continuing on another line
                            if (description[0] === '"') {
                                description = cleanDescription(description);
                                descriptionPieces.push(description);
                            } else {
                                //create the full description
                                buildingDescription = false;
                                description = descriptionPieces.join(' ').toLocaleLowerCase();
                                if (signatureFiles[description]) {
                                    signatureFiles[description].push(filePath);
                                } else {
                                    signatureFiles[description] = [filePath];
                                }
                            }
                        }
                    });
                }
            })
        }
    });
}

processFiles();

module.exports = {
    /**
     * Search for the description and return the matching file contents if it exists
     * @req req.params.description the signature description we want to search for
     */
    getFile: function (req, res, next){
        const description = req.params.description.toLocaleLowerCase(),
            fileNames = signatureFiles[description];
        let responseArray = [],
            promises = [];

        if (fileNames) {
            fileNames.forEach((fileName) => {
                if (fileName) {
                    shortFileName = fileName.split('/');
                    shortFileName = shortFileName[shortFileName.length - 1];
    
                    promises.push(fs.readFileAsync(fileName, 'utf8')
                        .then((fileContents) => {  
                            responseArray.push({ fileName: shortFileName, description, fileContents });
                        })
                        .catch(() => {
                            res.status(500).send({error: `Failed to read file ${shortFileName}`});
                        }));
                }
            });
        } else {
            promises.push(Promise.resolve());
        }

        Promise.all(promises)
            .then(() => {
                if (responseArray.length > 0) {
                    res.send(responseArray);
                } else {
                    res.status(400).send({error: 'Could not find a file containing this description'});
                }
            })
            .catch(next);
    }
};
