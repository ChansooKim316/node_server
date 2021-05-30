/**
 *  자주 쓰이는 응답 메세지들
 * 
 *  - 404 Not Found
 *  - 304 Not Modified
 *  - 500 Internal Server Error
 */


const get = require('../get/get.js');

try {
} catch (err) {
    console.error(err)
}
module.exports = {
    notFoundResp: [
        `HTTP/1.1 404 Not Found`,
        `Date: ${new Date()}`,
        `Content-Length: ${get.byteSize('<h1>404 Not Found</h1>')}`,
        `Connection: close`,
        '',
        '<h1>404 Not Found</h1>',
        ''
    ].join('\r\n'),
    notModified: (path, fileInfo) => {
        try {
            return [
                `HTTP/1.1 304 Not Modified`,
                `Date: ${new Date()}`,
                `Content-Type: ${fileInfo.contentType[path]}`,
                `Content-Length: 0`,
                `Expires: ${fileInfo.expires[path]}`,
                `Last-Modified: ${fileInfo.lastModified[path]}`,
                `Etag: ${fileInfo.eTag[path]}`,
                '',
                ''
            ].join('\r\n')
        } catch (err) {
            console.error(err)
        }
    },
    serverErrMsg: () => {
        try {
            const message = '<h1>Internal Server Error</h1>'
            return [
                `HTTP/1.1 500`,
                `Date: ${new Date()}`,
                `Content-Length: ${get.byteSize(message)}`,
                `Connection: close`,
                '',
                `${message}`,
                ''
            ].join('\r\n')
        } catch (err) {
            console.error(err)
        }
    }
};