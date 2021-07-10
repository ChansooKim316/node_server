/**
 *  파일경로를 받아 캐시 필요 유무 파악
 * 
 */


const headers = require('../info/headers.js');
const renewInfo = require('../info/renewInfo.js');
const dataToMaster = require('../communication/dataToMaster.js');
const fileResponse = require('../resp/file_resp.js');
const resp = require('../resp/resp.js');


module.exports = (path, fileInfo) => {
	try {
		if(path !== 'favicon.ico') {
			// if-non-match 없을때 (처음요청)
			const ifNoneMatch = headers['if-none-match'];
			const eTagForPath = fileInfo.eTag[path];
			if (!ifNoneMatch) {
				// 요청파일의 etag 없으면
				if (!eTagForPath) {
					// etag, max-age, expires 새로 생성
					const updatedFileInfo = renewInfo(path, fileInfo);
					dataToMaster(updatedFileInfo);
					console.log('200 OK');
					if(path !== 'favicon.ico') {
						return fileResponse(path, updatedFileInfo);
					}
				}
				// 요청파일의 etag 이미 존재
				else {
					console.log('200 OK');
					return fileResponse(path, fileInfo);
				}
			}
			// if-non-match 있을때 (두번째요청):
			else {
				// now < expires (만료 안됨)
				const now = new Date();
				if (Boolean(now.getTime() < Date.parse(fileInfo.expires[path]))) {
					// etag 일치 : 304
					if (eTagForPath == ifNoneMatch) {
						console.log('304 Not Modified');
						return resp.notModified(path, fileInfo);
					}
					// etag 불일치: 200 ok
					else {
						console.log('200 OK');
						return fileResponse(path, fileInfo);
					}
				}
				//expires < now (만료됨)
				else {
					// etag, max-age, expires 새로 생성
					const updatedFileInfo = renewInfo(path, fileInfo);
					dataToMaster(updatedFileInfo);
					// 200 ok
					console.log('200 OK');
					return fileResponse(path, updatedFileInfo);
				}
			}

		}
	} catch (err) {
		console.error(err)
	};
};

