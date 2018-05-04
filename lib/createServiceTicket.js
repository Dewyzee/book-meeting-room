/**
 * @file 初始化获取userId
 * @author Dewyzee<xutao05@baidu.com>
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

const createServiceTicket = function (tgt, baiduId) {
    let params = {
        appKey: config.INFO.appKey,
        deviceId: config.INFO.deviceId,
        deviceIdVer1: config.INFO.deviceIdVer1,
        mopAppKey: config.INFO.mopAppKey,
        serviceType: 0,
        targetAppkey: config.INFO.appKey,
        tgt: tgt
    };
    let data = querystring.stringify(params);
    let tempHeader = config.HEADERS.post
    if (baiduId) {
        tempHeader = Object.assign(tempHeader, {
            Cookie: baiduId
        });
    }
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.getAuthToken.path,
        port: 443,
        method: config.URL.url.getAuthToken.method,
        headers: tempHeader
    };
    return sendRequest({
        main: options,
        data: data
    });
};

module.exports = async function (tgt, baiduId) {
    let result = await createServiceTicket(tgt, baiduId);
    return result;
}