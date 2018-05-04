/**
 * @file转让会议室
 * @author Dewyzee<xutao05@baidu.com>
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

const transferRoom = function (userName, uuId, newOrderManEmail, roomLists, cookieObj) {
    let queue = [];
    let baseParam = {
        at: uuId,
        loginId: userName,
        newOrderManEmail: newOrderManEmail
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
        path: config.URL.url.transferRoom.path,
        port: 443,
        method: config.URL.url.transferRoom.method,
        headers: tempHeader
    };
    let transfer = function (item, option) {
        return function () {
            let finalParams = Object.assign({}, baseParam, {
                scheduleId: item.id
            });
            let data = querystring.stringify(finalParams);
            return sendRequest({
                main: option,
                data: data
            });
        }
    };

    roomLists.forEach(room => {
        queue.push(transfer(room, options));       
    });

    let sequenceTasks = function (tasks) {
        function recordValue(results, value) {
            results.push(value);
            return results;
        }
        function delay(val) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(val);
                }, 1000);
            });
        }
        var pushValue = recordValue.bind(null, []);
        return tasks.reduce(function (promise, task) {
            return promise.then(task).then(pushValue).then(delay);
        }, Promise.resolve());
    }
    
    return sequenceTasks(queue);
};

module.exports = async function (userName, uuId, newOrderManEmail, roomLists, cookieObj) {
    let result = await transferRoom(userName, uuId, newOrderManEmail, roomLists, cookieObj);
    return result;
}