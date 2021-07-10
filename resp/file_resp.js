/**
 *  파일 요청을 받아 응답, 변경된 정보 저장 (캐시할때)
 * 
 *  - 파일경로, 수정전의 파일정보 받기
 *  - 파일읽기
 *  - 읽은 직후 파일정보 수정
 *    - etag 갱신
 *    - last modified 갱신
 *    - expires 갱신
 *  - 응답 메세지 리턴
 * 
 */


const resp = require('./resp.js');
const fs = require('fs');


module.exports = (path, fileInfo) => {
    try {
            // 200 OK
            content = fs.readFileSync(path);
            // combining header + body(file)
            if (content) {
                const response = [];
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
            }
    } catch (err) {
        console.error(err)
        return resp.noFile;
    }
};
