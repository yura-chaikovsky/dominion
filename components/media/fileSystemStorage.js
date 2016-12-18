const Config                    = use('config');
const Errors                    = use('core/errors');

const fs                        = require('fs');
const path                      = require('path');


class FileSystemStorage {

    static _fileName(fileName) {
        let fileNameSplit = fileName.split('.');
        let fileExtension = fileNameSplit.splice(-1, 1);

        return new Date().getTime().toString()+'.'+fileExtension;
    }

    static fileSave (fileInfo) {
        let result = {
            response: {},
            success: false
        };

        if(Config.media.supportsTypes.indexOf(fileInfo.fileType)!==-1) {
            let dirPath = path.join(__dirname, Config.media.saveDir);

            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath);
            }
            let file = new Buffer(fileInfo.file, 'base64');
            result.response.fileName = this._fileName(fileInfo.fileName);
            result.response.filePath = path.join(Config.media.urlPath, result.response.fileName);

            fs.writeFileSync(path.join(dirPath, result.response.fileName), file);

            result.response.status = "ok";
            result.success = true;
        } else {
            result.success = false;
            result.response.status = `mime type "${fileInfo.fileType}" is not supported`;
        }

        return result;
    }
}


module.exports = FileSystemStorage;