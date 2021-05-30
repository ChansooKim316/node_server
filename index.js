/**
 *  Master 역할을 하는 서버
 * 
 *  - 클러스터들을 시작시킴
 *  - 클러스터들로부터 업데이트된 파일정보를 받아 브로드캐스팅 함.
 * 
 */


const net = require('net');
const pm2 = require('pm2');


const initiateServer = () => {
    const server = net.createServer(startClusters());
    server.on('error', err => {
        console.log('err' + err);
    });
};


const startClusters = (socket) => {
    pm2.connect((err) => {
        if (err) {
            console.error(err);
            process.exit(0);
        }
        pm2.start(
            {
                "script": "./worker/server.js",
                "name": "worker",
                "exec_mode": "cluster",
                // "instances": -1
                "instances": 1
            }, (err, apps) => {
                // console.log(apps);
                if (err) throw err;
            })
    });
    broadcastFileInfo();
};


const broadcastFileInfo = () => {
    process.on("message", packet => {
        const fileInfo = packet.data["file"]
        // console.log('renewed info :', fileInfo)
        process.send({
            type: 'info',
            data: fileInfo
        })
    }, err => {
        console.err(err)
    });
};


initiateServer();