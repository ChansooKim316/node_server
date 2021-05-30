/**
 *  파일이 아닌 바디 데이터에 대한 처리와 응답
 * 
 *  - 컨텐트 타입에 따라 분기하여 처리
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
                content = Buffer.from(queryToHTML(body));
            } else if (contentType.slice(0, 19) === "multipart/form-data") {
                content = Buffer.from(formDataToHTML(body))
            } else {
                switch (contentType) {
                    case ("application/x-www-form-urlencoded"):
                        content = Buffer.from(queryToHTML(body));
                        break;
                    case ("application/json"):
                        content = Buffer.from(jsonToHTML(body));
                        break;
                    case ("text/plain"):
                        content = Buffer.from(queryToHTML(body));
                        break;
                    default:
                        content = "couldn't get the body"
                        break;
                }
            }
        } else if (!contentType) {
            content = "Couldn't get 'Content-Type'";
        };

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
        if (headers['method'] === 'get') {
            pairs = query.split('?')[1].split('&')
        } else if (headers['method'] === 'post') {
            pairs = query.split('&')
        };
        let firstKey = pairs[0].split('=')[0];
        let firstValue = pairs[0].split('=')[1];
        let newBody = ['<html>', '<body>', '<p>', headers['host'].split('.')[0], ' ', firstKey, ': ', firstValue, '</p>'];

        for (let pair of pairs.slice(1)) {
            pair = pair.split('=')
            let key = decodeURIComponent(pair[0]);
            let value = decodeURIComponent(pair[1]);
            newBody.push('<p>', key, ': ', value, '</p>')
        };
        newBody.push('</body>', '</html>');
        return newBody.join('');
    } catch (err) {
        console.error(err)
    }
};


const jsonToHTML = (data) => {
    try {
        const json = JSON.parse(data);
        const keys = Object.keys(json);
        const firstKey = headers['host'].split('.')[0] + ' ' + keys[0];
        const firstValue = json[keys[0]];
        const newBody = ["<html><body><p>", firstKey, ": ", firstValue, "</p>",];
        for (let i = 1; i < keys.length; i++) {
            newBody.push('<p>', keys[i], ': ', json[keys[i]], "</p>")
        };
        newBody.push('</body>', '</html>');
        return newBody.join('');
    } catch (err) {
        console.error(err)
    }
};


const formDataToHTML = (body) => {
    try {

        body = body.toString()
        const formDataObj = {};
        const bndry = '--' + headers['content-type'].slice(30) + '\r\n';
        const pairs = body.split(bndry);
        for (let pair of pairs) {
            // filename 이 있는경우 (file 첨부시)
            if (pair.includes('filename=')) {
                // console.log('pair : ', pair)
                let keyLeft = pair.split('; ')[1].split('\r\n')[0].slice(6, -1)
                let keyRight = pair.split('; ')[2].split('\r\n')[0].slice(10, -1)
                let key = keyLeft + '=' + keyRight
                const content = pair.split('; ')[2].split('\r\n\r\n')[1];
                formDataObj[key] = content
            } else if (pair) {
                // file 첨부를 안한 경우
                let key = pair.split('; ')[1].split('\r\n')[0].slice(6, -1)
                let value = pair.split('; ')[1].split('\r\n')[2]
                key = decodeURIComponent(key)
                value = decodeURIComponent(value)
                formDataObj[key] = value
            };
        };

        const keys = Object.keys(formDataObj)
        let firstKey = headers['host'].split('.')[0] + ' ' + keys[0]
        let firstValue = formDataObj[keys[0]]
        let newBody = ["<html><body><p>", firstKey, ": ", firstValue, "</p>",]
        for (let i = 1; i < keys.length; i++) {
            newBody.push('<p>', keys[i], ': ', formDataObj[keys[i]], "</p>")
        };
        newBody.push('</body>', '</html>');

        return newBody.join('');
    } catch (err) {
        console.error(err)
    }
};
