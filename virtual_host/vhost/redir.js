/**
 *  리다이렉션 요청일 올경우 처리하는 함수
 * 
 */


const get = require('../../get/get.js');
const fs = require('fs');


module.exports = (uri, host) => {
    try {
        switch (uri) {
            // 301
            case '/redir':
                return [
                    `HTTP/1.1 301 Found`,
                    `Date: ${new Date()}`,
                    `Location: http://` + `${host}/redir2`,
                    `Content-Length: 0`,
                    `Keep-Alive: timeout=5, max=100`,
                    `Connection: Keep-Alive`,
                    '',
                    ''
                ].join('\r\n');
            // 302
            case '/redir2':
                return [
                    `HTTP/1.1 302 Found : Moved Temporarily`,
                    `Date: ${new Date()}`,
                    `Location: http://` + `${host}/main`,
                    `Content-Length: 0`,
                    `Connection: Keep-Alive`,
                    '',
                    ''
                ].join('\r\n');
            // 200
            case '/main':
                let content = null;
                try {
                    content = fs.readFileSync('./virtual_host/vhost/vhost_main.html', 'utf-8')
                } catch (err) {
                    console.log(err)
                    content = 'Failed to read HTML file...'
                } finally {
                    return [
                        `HTTP/1.1 200 OK`,
                        `Date: ${new Date()}`,
                        `Pragma: no-cache`,
                        `Cache-Control: no-cache, no-store, must-revalidate`,
                        `Content-Type: text/html;charset=UTF-8`,
                        `Content-Language: ko-KR`,
                        `Vary: Accept-Encoding`,
                        `Content-Length: ${get.byteSize(content)}`,
                        `Connection: close`,
                        '',
                        `${content}`,
                        ''
                    ].join('\r\n')
                };
            default:
                return '<h1>Something went wrong<h1>';
        };
    } catch (err) {
        console.error(err)
    }
};