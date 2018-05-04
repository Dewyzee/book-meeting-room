/**
 * @file 查询已订阅会议室
 * @author
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

let timeStamp = (new Date()).getDate();

const checkUnfinished = function (userName, uuId, currentDate, checkDate, cookieObj) {
    let params = {
        at: uuId,
        loginId: userName,
        minTime: currentDate + ' 00:00:00',
        maxTime: checkDate + ' 00:00:00' 
    };
    let data = querystring.stringify(params);
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
            'Cookie': concatStr
        });
    }
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.checkBook.path,
        port: 443,
        method: config.URL.url.checkBook.method,
        headers: tempHeader
    };
    return sendRequest({
        main: options,
        data: data
    });
};

module.exports = async function (userName, uuId, currentDate, checkDate, cookieObj) {
    let result = await checkUnfinished(userName, uuId, currentDate, checkDate, cookieObj);
    return result;
}