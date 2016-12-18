const MediaTools                = require('./fileSystemStorage');


const MediaController = {

    path: 'media',

    permissions: {
        POST : 'Media.Create'
    },

    POST : [

        /*
        example request

         POST /media HTTP/1.1
         Host: localhost:3000
         Content-Type: application/json

         {
             "fileType":"image/gif",
             "fileName":"pixel.gif",
             "file":"R0lGODlhCgAKAIABALG1ucPHyywAAAAACgAKAAACEYSPEMtr3R50agY5MdSx5pQUADs="
         }

        */

        function () {
            let result = MediaTools.fileSave(this.request.body);

            if(result.success){
                return result.response;
            }else{
                this.response.status = this.response.statuses._400_BadRequest;
                return result.response;
            }
        }
    ]

};

module.exports = MediaController;