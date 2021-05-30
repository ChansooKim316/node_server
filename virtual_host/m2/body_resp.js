/**
 *  PSOT 메소드에서 바디로 보낸 데이터를 처리하는 함수
 * 
 *  - 컨텐트 타입에 따라 분기하여 문자열, 또는 파일을 처리
 * 
 */


const get = require('../../get/get.js');
const headers = require('../../info/headers.js');


module.exports = (body) => {
    try {
        let content = null;
        const contentType = headers['content-type'];
        // Content-Type 에 따라 분기
        if (contentType) {
            if (contentType.slice(0, 9) === "text/html") {
                content = queryToHTML(body);
            } else if (contentType.slice(0, 19) === "multipart/form-data") {
                content = formDataToHTML(body);
            } else {
                switch (contentType) {
                    case ("application/x-www-form-urlencoded"):
                        content = queryToHTML(body);
                        break;
                    case ("application/json"):
                        content = jsonToHTML(body);
                        break;
                    case ("text/plain"):
                        content = queryToHTML(body);
                        break;
                    default:
                        content = "couldn't get the body"
                        break;
                }
            };
        } else if (!contentType) {
            content = "Couldn't get 'Content-Type'";
        }
        
        const response = [];
        const header = Buffer.from(
            [
                `HTTP/1.1 200 OK`,
                `Date: ${new Date()}`,
                `Pragma: no-cache`,
                `Cache-Control: no-cache, no-store, must-revalidate`,
                `Content-Language: ko-KR`,
                `Vary: Accept-Encoding`,
                `Content-Length: ${get.byteSize(content)}`,
                `Connection: close`,
                '',
                ''
            ].join('\r\n')
        );
        response.push(header, content);
        return Buffer.concat(response);
    } catch (err) {
        console.error(err)
    }
};


const queryToHTML = (query) => {
    try {
        query = query.toString()
        let pairs = null;
        const newBody = ['<html>', '<body>'];
    
        if (headers['method'] === 'get') {
            pairs = query.substring(query.indexOf('?') + 1).split('&');
        } else if (headers['method'] === 'post') {
            pairs = query.split('&');
        };
    
        for (let pair of pairs) {
            pair = pair.split('=')
            let key = decodeURIComponent(pair[0]);
            let value = decodeURIComponent(pair[1]);
            newBody.push('<p>', key, ': ', value, '</p>')
        };
        newBody.push('</body>', '</html>');
        return Buffer.from(newBody.join(''));
    } catch (err) {
        console.error(err)
    }
}


const jsonToHTML = (data) => {
    try {
        const json = JSON.parse(data)
        const keys = Object.keys(json)
        const newBody = ["<html><body><p>"]
        for (let i = 0; i < keys.length; i++) {
            newBody.push('<p>', keys[i], ': ', json[keys[i]], "</p>")
        };
        newBody.push('</body></html>');
        return Buffer.from(newBody.join(''));
    } catch (err) {
        console.error(err)
    }
};


const formDataToHTML = (body) => {
    try {
        body = body.toString()
        const formDataObj = {};
        const bndry = '--' + headers['content-type'].slice(30) + '\r\n';
        const lastBndry = '--' + bndry + '--';
        const pairs = body.split(bndry);
        for (const pair of pairs) {
            // filename 이 있는경우 (file 첨부시)
            if (pair.includes('filename=')) {
                const keyLeft = pair.split('; ')[1].split('\r\n')[0].slice(6, -1);
                const keyRight = pair.split('; ')[2].split('\r\n')[0].slice(10, -1);
                const key = keyLeft + '=' + keyRight;
                const content = pair.split('; ')[2].split('\r\n\r\n')[1];
                formDataObj[key] = content;
            } else if (pair) { 
                // file 첨부를 안한 경우
                let key = pair.split('; ')[1].split('\r\n')[0].slice(6, -1);
                let value = pair.split('; ')[1].split('\r\n')[2];
                key = decodeURIComponent(key);
                value = decodeURIComponent(value);
                formDataObj[key] = value;
            }
        }
        const keys = Object.keys(formDataObj);
        let newBody = ["<html><body>"];
        for (let i = 0; i < keys.length; i++) {
            newBody.push('<p>', keys[i], ': ', formDataObj[keys[i]], "</p>")
        };
        newBody.push('</body></html>');
        return Buffer.from(newBody.join(''));
    } catch (err) {
        console.error(err)
    }
};
