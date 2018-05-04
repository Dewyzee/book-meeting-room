/**
 * @file 验证权限
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

const hasMeetingAuth = function (userName, uuId) {
    let params = {
        at: uuId,
        loginId: userName
    };
    let data = querystring.stringify(params);
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.hasMeetingAuth.path,
        port: 443,
        method: config.URL.url.hasMeetingAuth.method,
        headers: config.HEADERS.get
    };
    return sendRequest({
        main: options,
        data: data
    })
};

module.exports = async function (userName, uuId) {
    let result = await hasMeetingAuth(userName, uuId);
    return result;
}

