/**
 *  쿼리스트링을 처리하여 HTML 로 응답하는 함수
 * 
 */


const get = require('../../get/get.js');
const headers = require('../../info/headers.js');


module.exports = (uri) => {
    try {
        const html = queryToHTML(uri)
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
        if (headers['method'] === 'get') {
            pairs = query.split('?')[1].split('&')
        } else if (headers['method'] === 'post') {
            pairs = query.split('&')
        };
        let firstKey = pairs[0].split('=')[0];
        let firstValue = pairs[0].split('=')[1];
        let newBody = ['<html><body><p>', headers['host'].split('.')[0], ' ', firstKey, ': ', firstValue, '</p>'];
        for (let pair of pairs.slice(1)) {
            pair = pair.split('=')
            let key = decodeURIComponent(pair[0]);
            let value = decodeURIComponent(pair[1]);
            newBody.push('<p>', key, ': ', value, '</p>')
        };
        newBody.push('</body></html>');
        return newBody.join('');
    } catch (err) {
        console.error(err)
    }
}