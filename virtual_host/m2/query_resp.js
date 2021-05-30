/**
 *  쿼리스트링을 처리하여 HTML 로 응답하는 함수
 * 
 */


const get = require('../../get/get.js');
const headers = require('../../info/headers.js');


module.exports = (uri) => {
    try {
        const html = queryToHTML(uri);
        return Buffer.from(
            [
                `HTTP/1.1 200 OK`,
                `Date: ${new Date()}`,
                `Pragma: no-cache`,
                `Cache-Control: no-cache, no-store, must-revalidate`,
                `Content-Type: text/html;charset=UTF-8`,
                `Content-Language: ko-KR`,
                `Vary: Accept-Encoding`,
                `Content-Length: ${get.byteSize(html)}`,
                `Connection: close`,
                '',
                `${html}`,
                ''
            ].join('\r\n')
        );
    } catch (err) {
        console.error(err)
    }
};


const queryToHTML = (query) => {
    try {
        let pairs = null;
        const newBody = ['<html>', '<body>'];

        if (headers['method'] === 'get') {
            pairs = query.substring(query.indexOf('?') + 1).split('&')
        } else if (headers['method'] === 'post') {
            pairs = query.split('&')
        };

        for (let pair of pairs) {
            pair = pair.split('=')
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1]);
            newBody.push('<p>', key, ': ', value, '</p>')
        };
        newBody.push('</body>', '</html>');
        return Buffer.from(newBody.join(''));
    } catch (err) {
        console.error(err)
    }
};
