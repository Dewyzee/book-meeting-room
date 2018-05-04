/**
 * @file 发送位置请求，获取baiduid
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

const locationSend = function () {
    let params = {
        uuid: '',
        y: '31.182227',
        to: 4,
        x: '121.601364',
        from: 0,
        mode: 1,
        signature: '3u1jLH+DRdpJuLkAPPgpURRADBo=',
        appkey: config.INFO.verKey
    };
    let data = querystring.stringify(params);
    let options = {
        hostname: config.URL.domainApi,
        path: config.URL.url.locationSend.path,
        port: 443,
        method: config.URL.url.locationSend.method,
        headers: config.HEADERS.get
    };
    return sendRequest({
        main: options,
        data: data
    });
};

module.exports = async function () {
    let result = await locationSend();
    return result;
}