/**
 * @file 登录认证
 */

const querystring = require('querystring');
const sendRequest = require('./sendRequest');
const config = require('../common/const');

const authenticate = function (opt) {
    let params = {
        appKey: config.INFO.appKey,
        deviceId: config.INFO.deviceId,
        deviceIdVer1: config.INFO.deviceIdVer1,
        appVersion: config.INFO.appVersion,
        cuId: config.INFO.deviceIdVer1,
        customizedOs: config.INFO.osKernal,
        dataId: config.INFO.dataId,
        deviceName: config.INFO.deviceName,
        mopAppKey: config.INFO.mopAppKey,
        operator: config.INFO.operator,
        operator: config.INFO.operatorName,
        osKernal: config.INFO.osKernal,
        osVersion: config.INFO.osVersion,
        resolution: config.INFO.resolution,
        vendorModel: config.INFO.vendorModel,
        sid: opt.sid,
        sMsg: ''
    };
    let data = querystring.stringify(params);
    let options = {
        hostname: config.URL.domain,
        path: config.URL.url.authenticate.path,
        port: 443,
        method: config.URL.url.authenticate.method,
        headers: config.HEADERS.post
    };
    return sendRequest({
        main: options,
        data: data
    });
};

module.exports = async function (userId) {
    let result = await authenticate(userId);
    return result;
}