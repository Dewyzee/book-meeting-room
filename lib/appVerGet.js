/**
 * @file 获取app版本
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

const appVerGet = function (uuId) {
    let params = {
        at: uuId,
        app_key: config.INFO.verKey
    };
    let data = querystring.stringify(params);
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.appVerGet.path,
        port: 443,
        method: config.URL.url.appVerGet.method,
        headers: config.HEADERS.get
    };
    return sendRequest({
        main: options,
        data: data
    })
};

module.exports = async function (uuId) {
    let result = await appVerGet(uuId);
    return result;
}