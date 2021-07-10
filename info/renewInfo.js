/**
 *  
 *  리퀘스트의 헤더값들 중 파일에 관한 정보들 저장
 *  
 * - Etag
 * - Content-Type
 * - Last-Modified
 * - Expires
 * - Cache Control
 */


const createHash = require('hash-generator');
const mime = require('mime-types');
const fs = require('fs');;


module.exports = (path, fileInfo) => {
    try {
        if(path !== 'favicon.ico') {
            const maxAge = 60000;   // 60초
            const now = new Date();
            const stats = fs.statSync(path);
            const lastModified = stats.ctime;  // when file's metadata was changed
            fileInfo.eTag[path] = createHash(32);
            fileInfo.expires[path] = new Date(now.getTime() + maxAge);
            fileInfo.cacheControl[path] = `public, max-age=${maxAge / 1000}`;
            fileInfo.contentType[path] = mime.lookup(path);
            fileInfo.lastModified[path] = lastModified;
            return fileInfo;
        }
    } catch (error) {
        console.error(error);
    }
}

