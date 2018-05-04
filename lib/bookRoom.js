/**
 * @file 预定会议室
 * @author Dewyzee<xutao05@baidu.com>
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');
let counter = 0;

const bookRoom = function (roomsList, uuId, userName, bookDate, cookieObj) {
    let queue = [];
    let tempID = uuId;
    let baseParam = {
        at: uuId,
        loginId: userName,
        startMini: '00',
        endMini: '00',
        startDate: bookDate,
        description: 'iOS端的预定'
    };
    let tempHeader = config.HEADERS.get;
    if (cookieObj) {
        let keys = Object.keys(cookieObj);
        let concatStr = '';
        keys.forEach(key => {
            if (key !== 'timestamp') {
                concatStr += cookieObj[key] + ';';
            }
        });
        tempHeader = Object.assign({}, config.HEADERS.get, {
            'Content-Type': 'text/plain;charset=UTF-8',
            'Cookie': concatStr,
            'Accept-Encoding': 'gzip'
        });
    }
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.bookRoom.path,
        port: 443,
        method: config.URL.url.bookRoom.method,
        headers: tempHeader
    };
    let book = function (item, option) {
        return function () {
            let startTime = item.startTimeStr.split(' ');
            let startTimeHour = startTime[1].split(':')[0];
            let endTime = item.endTimeStr.split(' ');
            let endTimeHour = endTime[1].split(':')[0];
            let finalParams = Object.assign({}, baseParam, {
                roomKey: item.roomId,
                startHour: startTimeHour,
                endHour: endTimeHour
            });
            let data = querystring.stringify(finalParams);
            return sendRequest({
                main: option,
                data: data
            });
        }
    };

    roomsList.forEach(room => {
        queue.push(book(room, options));       
    });

    let sequenceTasks = function (tasks) {
        function recordValue(results, value) {
            console.log('-->>> 预定中...');
            results.push(value);
            return results;
        }
        function delay(val) {
            if (val && val.body && val.body.code === 200) {
                counter++;
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(val);
                    }, 1000);
                });
            }
        }
        var pushValue = recordValue.bind(null, []);
        return tasks.reduce(function (promise, task) {
            return promise.then(task).then(pushValue).then(delay);
        }, Promise.resolve());
    }
    
    return sequenceTasks(queue);
};

module.exports = async function (roomsList, uuId, userName, bookDate, cookieObj) {
    let result = await bookRoom(roomsList, uuId, userName, bookDate, cookieObj);
    return result;
}