const promise = require('bluebird'),
    fs = promise.promisifyAll(require('fs')),
    LineByLineReader = require('line-by-line'),
    config = require('../../config.json'),
    signatureLocation = config.signatures.location;
let signatureFiles = {};

//Process all signature files into object where key is signature and value is file path
fs.readdirSync(signatureLocation).forEach((directory) => {
    if (!directory.includes('.')) {
        fs.readdirSync(`${signatureLocation}/${directory}`).forEach((file) => {
            if (!file.includes('__init__') && !file.includes('compat')) {
                const filePath = `${signatureLocation}/${directory}/${file}`,
                    lr = new LineByLineReader(filePath);

                lr.on('error', function (err) {
                    console.log(`Failed to read the file: ${err}`)
                });

                lr.on('line', function (line) {
                    if (line.includes('description =')) {
                        const description = line.split(' = ')[1].substr(1).slice(0, -1);
                        if (signatureFiles[description]) {
                            signatureFiles[description].push(filePath)
                        } else {
                            signatureFiles[description] = [filePath]
                        }
                    }
                });
            }
        })
    }
});

module.exports = {
    /**
     * Search for the description and return the matching file contents if it exists
     * @req req.params.description the signature description we want to search for
     */
    getFile: function (req, res, next){
        const description = req.params.description,
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
