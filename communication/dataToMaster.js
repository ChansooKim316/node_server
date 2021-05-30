/**
 *  데이터를 받아 index.js (마스터 역할) 에 전송하는 함수
 * 
 */


const pm2 = require('pm2');


module.exports = (data) => {
    pm2.sendDataToProcessId({
        type: 'message',
        data: {
            "file": data
        },
        id: 0,
        topic: 'file'
    }, function (err, res) {
        if (err) {
            console.error(err);
        }
    });
};