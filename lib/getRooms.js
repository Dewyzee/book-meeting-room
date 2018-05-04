/**
 * @file 获取会议室列表
 * @author Dewyzee<xutao05@baidu.com>
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');


const getRooms = function (userName, userId, cookieObj, bookDate) {
    let params = {
        at: userId,
        loginId: userName,
        dataType: 1,
        buildingKeys: config.INFO.buildingKeys,
        date: bookDate
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
        path: config.URL.url.getAllRooms.path,
        port: 443,
        method: config.URL.url.getAllRooms.method,
        headers: tempHeader
    };
    return sendRequest({
        main: options,
        data: data
    });
};

module.exports = async function (userName, userId, cookieObj, bookDate) {
    let result = await getRooms(userName, userId, cookieObj, bookDate);
    return result;
}