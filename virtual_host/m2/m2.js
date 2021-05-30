/**
 * 호스트가 'm2' 일 경우 GET 과 POST 방식의 처리
 * 
 * > GET 메소드일 경우
 * 
 *   1. 리다이렉션 요청일 경우 uri 를 받아서 리다이렉션 하기
 *   2. 파일요청일 경우 캐시여부 판단 후 파일읽어서 응답
 *   3. 파일 요청이 아닐경우 쿼리스트링 처리
 * 
 * > POST 일 경우 
 *  
 *  1. 파일요청일 경우 캐시여부 판단 후 파일읽어서 응답
 *  2. 파일요청이 아닐경우 바디의 데이터를 처리
 * 
 */


const headers = require('../../info/headers.js');
const get = require('../../get/get.js');
const cacheControl = require('../../cache_control/cache_control.js');
const redir = require('./redir.js');
const queryResponse = require('./query_resp.js');
const bodyResponse = require('./body_resp.js');


module.exports = {
    // GET 메소드
    get: (fileInfo) => {
        try {
            const uri = headers['uri'];
            const host = headers['host'];
            const path = uri.slice(1);
            // Redirection
            if (['/redir', '/redir2', '/main'].includes(uri)) {
                return redir(uri, host)
            };

            // File requests (no '?' on uri)
            if (!uri.includes('?')) {
                // Cache control
                return cacheControl(path, fileInfo)
            }
            // Response for query strings
            else {
                return queryResponse(uri)
            };
        } catch (err) {
            console.error(err)
        }
    },

    // POST 메소드
    post: (req, fileInfo) => {
        try {
            const uri = headers['uri']
            const path = uri.slice(1)
            const body = get.body(req)
            // Local file request (post 방식인데 body가 없을경우)
            if (!body) {
                // 캐시컨트롤
                return cacheControl(path, fileInfo)
            };
            // Other response (no file)
            return bodyResponse(body)
        } catch (err) {
            console.error(err)
        }
    }
};


