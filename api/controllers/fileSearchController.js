const promise = require('bluebird'),
    fs = promise.promisifyAll(require('fs')),
    LineByLineReader = require('line-by-line'),
    signatureLocation = '../../community-master/modules/signatures';

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
                        signatureFiles[line.split(' = ')[1].substr(1).slice(0, -1)] = filePath;
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
        const description = req.params.description;
        if (signatureFiles[description]) {
            fs.readFile(signatureFiles[description], 'utf8', function(err, data) {  
                if (err) throw err;
                res.json(data);
            });
        } else {
            res.status(400).send({error: 'Could not find a file containing this description'});
        }
    }
};
