/**
 *  - 헤더의 첫줄 부터 바디의 끝까지를 하나로 합쳐 리턴함.
 */

const get = require('../get/get.js');
const headers = require('../info/headers.js');


let totalReq = [];
let lastBndry = '';
let totalLength = 0;


module.exports = (req) => {
    try {
        // console.log('req 의 버퍼 크기 :', req.length)
        get.headers(req)
        const contentType = headers['content-type'];
        const contentLength = headers['content-length'];
        // 바디가 없고 get 메소드인 리퀘스트의 경우 그대로 리턴
        if (headers['method'] === "get" || !contentType) {
            return req;
        };
        const body = get.body(req);
        // 1. 헤더의 content length !== 리퀘스트의 바이트 크기 일때
        if (!contentLength || Number(contentLength) !== Number(body.length)) {
            console.log('잘림')
            // (1) Request 가 form-data 인 경우 : 헤더~마지막 바운더리가 까지를 하나로 합쳐서 리턴 
            if (!contentType || contentType.slice(0, 19) === "multipart/form-data") {
                lastBndry = Buffer.from('--' + contentType.slice(30) + '--');
                if (!req.includes(lastBndry)) {
                    totalReq.push(req);
                    return false
                } else {
                    totalReq.push(req);
                    return Buffer.concat(totalReq);
                };
                // (2) form-data 외 다른 타입일때
            } else if (contentType || Number(contentLength) !== Number(get.byteSize(body))) {
                totalReq.push(req);
                Buffer.concat(totalReq);
                totalLength += body.length;
                if (contentLength == totalLength) {
                    return Buffer.concat(totalReq);
                } else {
                    return false;
                };
            };
            return false;
            // 2. 제대로 왔을때
        } else if (Number(contentLength) === Number(get.byteSize(body))) {
            return req
        };
    } catch (err) {
        console.error(err);
    };
};

