/**
 * @file start login
 */

const file = require('fs');
const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

let tempHeader = Object.assign(config.HEADERS.post, {
    cookie: querystring.stringify(global.cookie)
})
const loginUuap = function (userId) {
    let params = {
        appKey: config.INFO.appKey,
        deviceId: config.INFO.deviceId,
        deviceIdVer1: config.INFO.deviceIdVer1,
        resultType: config.INFO.resultType,
        supportVersion: config.INFO.supportVersion,
        random: userId
    };
    let data = querystring.stringify(params);
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.reqConnection.path,
        port: 443,
        method: config.URL.url.reqConnection.method,
        headers: config.HEADERS.post
    };
    return sendRequest({
        main: options,
        data: data
    });
};

module.exports = async function (userId) {
    let result = await loginUuap(userId);
    return result;
}
