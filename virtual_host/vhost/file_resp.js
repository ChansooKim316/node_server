/**
 *  파일을 읽어서 응답 하는 함수
 * 
 */


const resp = require('../../resp/resp.js');
const fs = require('fs');


module.exports = (path, fileInfo) => {
    try {
        // 200 OK
        content = fs.readFileSync(path);
        // combining  header + body(file)
        if (content) {
            const response = []
            const header = Buffer.from(
                [
                    `HTTP/1.1 200 OK`,
                    `Date: ${new Date()}`,
                    `Content-Type: ${fileInfo.contentType[path]}; charset=utf-8`,
                    `Content-Language: ko-KR`,
                    `Content-Length: ${content.length}`,
                    `Cache-Control: ${fileInfo.cacheControl[path]}`,
                    `Expires: ${fileInfo.expires[path]}`,
                    `Last-Modified: ${fileInfo.lastModified[path]}`,
                    `Etag: ${fileInfo.eTag[path]}`,
                    '',
                    ''
                ].join('\r\n')
            );
            response.push(header, content);
            return Buffer.concat(response);
        };
        return resp.notFoundResp;
    } catch (err) {
        console.error('No File')
        // console.error(err)
    }
};
