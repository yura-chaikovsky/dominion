const Config                    = use('config');
const Errors                    = use('core/errors');

const fs                        = require('fs');
const path                      = require('path');
const getFileInfo               = require('file-type');


class FileSystemStorage {

    static fileSave (uploadfile) {

        let result = {};

        let file = new Buffer(uploadfile.file, 'base64');
        let fileInfo = getFileInfo(file);

        if(Config.media.supportsTypes.indexOf(fileInfo.mime)==-1) {
            throw new Errors.BadRequest(`mime type "${fileInfo.mime}" is not supported`);
        }

        let dirPath = path.resolve(Config.media.saveDir);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        let currentTime = new Date().getTime().toString();
        result.fileName = `${currentTime}.${fileInfo.ext}`;
        result.filePath = path.join(Config.media.saveDir, result.fileName);
        fs.writeFileSync(path.join(dirPath, result.fileName), file);

        return result;
    }
}


module.exports = FileSystemStorage;