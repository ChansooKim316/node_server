/**
	클러스터 페이지
 
	- 작동순서
	1. z클러스터 시작
	2. 브로드케스트 리스닝

	- z클러스터가 리퀘스트를 받았을때 동작하는 순서
	1. 브라우저에서 요청 받기
	2. 헤더값들을 저장
	3. 받은 리퀘스트를 헤더첫줄 ~ 바디의 끝 까지를 잘라서 하나로 만들기 
	4. 호스트와 메소드를 분기
	5. route() 함수에서 리턴된 리스폰스를 클라이언트로 전송
 */


const net = require('net');
const pm2 = require('pm2');
const get = require('../get/get.js');
const m2 = require('../virtual_host/m2/m2.js');
const vhost = require('../virtual_host/vhost/vhost.js');
const headers = require('../info/headers.js');
const resp = require('../resp/resp.js');
const reqDistributor = require('../manage/request_distributor.js');


let fileInfo = {
	contentType: {},
	cacheControl: {},
	expires: {},
	lastModified: {},
	eTag: {},
};


const initializeServer = () => {
	// initiate server  
	const server = net.createServer(onConnected);
	server.on('error', err => {
		// console.error(err);
	});
	server.listen(80, () => {
		console.log('listening on 80...',);
	});
	listenBroadcast();
};

const onConnected = (socket) => {
	socket.on('data', req => {
		// console.log('request : \n', req.toString())
		let slicedRequest = reqDistributor(req)
		if (slicedRequest) {
			// console.log('req :\n', slicedRequest.toString())
			const response = route(slicedRequest, fileInfo)
			// console.log('resp :\n', response.toString())
			sendResponse(response, socket)
		};
	}, err => {
		console.error(err)
	});
};


const listenBroadcast = () => {
	let data = null;
	// recieve launch bus
	pm2.launchBus((err, bus) => {
		bus.on('info', packet => {
			fileInfo = packet.data;
			// console.log('renewed data : ', fileInfo);
		});
		// console.error(err)
	});
};


const sendResponse = (response, socket) => {
	try {
		socket.write(response);
	} catch (err) {
		console.error(err);
		socket.write(resp.serverErrMsg());
	};
};


const route = (request, fileInfo) => {
	try {
		get.headers(request)
		const host = headers['host'].split('.')[0];
		const method = headers['method'];
		switch (host) {
			case 'host1':
				if (method === 'get') {
					return vhost.get(fileInfo);
				}
				else if (method === 'post') {
					return vhost.post(request, fileInfo);
				}
				else return `<h1>Invalid method : ${method} .</h1>`;
			case 'host2':
				if (method === 'get') {
					return m2.get(fileInfo);
				}
				else if (method === 'post') {
					return m2.post(request, fileInfo);
				}
				else return `<h1>Invalid method : ${method} .</h1>`;
			default:
				return `<h1>Invalid hostname : ${host} . Please type 'host1' or 'host2' for host name</h1>`;
		};
    } catch (err) {
        console.error(err)
	}
};


initializeServer();
