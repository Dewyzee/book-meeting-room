/**
 * @file 常量
 * @auhtor Dewyzee<xutao05@baidu.com>
 */


exports.URL = {
    protocal: 'https',
    domain: 'mop.baidu.com',
    domainApi: 'api.map.baidu.com',
    url: {
        authenticate: {
            method: '',
            path: ''
        }
    }
};

exports.INFO = {
    appKey: '',
    appVersion: '1.7.4',
    deviceId: '',
    deviceIdVer1: '',
    resultType: 'json',
    supportVersion: 'AUTH_V30',
    mopAppKey: '',
    operator: '46002',
    operatorName: '中国移动',
    osKernal: 'iOS',
    osVersion: '9.3.5',
    resolution: '640x1136',
    sMsg: '',
    vendorModel: 'iPhone8,4',
    dataId: '',
    deviceName: 'Kerry iPhone',
    verKey: '',
    buildingKeys: 119
};

exports.HEADERS = {
    post: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive'
    },
    get: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'User-Agent': 'yi dong ban gong 1.7.4 (iPhone; iOS 11.3; zh_CN)'
    }
};
