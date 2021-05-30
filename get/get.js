/**
*   데이터로부터 필요한 부분(헤더,바디,바이트 크기)을 추출하는 함수들
*
*  - headers() : 리퀘스트로 부터 헤더들을 저장하는 함수
*  - byteSize() : 문자열의 바이트크기를 리턴하는 함수
*  - body() : 리퀘스트의 바디부분만 리턴하는 함수
*/


const headers = require('../info/headers.js');


module.exports = {
    headers: (req) => {
        try {
            const reqString = req.toString().toLowerCase();
            if (reqString.includes('user-agent: ')) {
                const headerPart = reqString.split('\r\n\r\n')[0];
                const allHeaders = headerPart.split('\r\n');
                const firstLine = allHeaders[0];
                headers['method'] = firstLine.split(' ')[0];
                headers['uri'] = firstLine.split(' ')[1];
                headers['httpVersion'] = firstLine.split(' ')[2];
                for (let i = 1; i < allHeaders.length; i++) {
                    headers[allHeaders[i].split(': ')[0]] = allHeaders[i].split(': ')[1];
                };
            };
        } catch (err) {
            console.error(err)
        }
    },
    byteSize : (data) => {
        try {
            if(!data) {
                return 0;
            };
            const pattern = /[\u0000-\u007f]|([\u0080-\u07ff]|(.))/g;
            return data.toString().replace(pattern, "$&$1$2").length;
        } catch (err) {
            console.error(err)
        }
    },
    body: (req) => {
        try {
            const reqBuff = Buffer.from(req)
            const body = reqBuff.slice(reqBuff.indexOf('\r\n\r\n') + 4);
            return body
        } catch (err) {
            console.error(err)
        }
    }
};

