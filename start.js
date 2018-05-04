/**
 * @file entry file
 */

require('babel-core/register')({
    presets: ['stage-3', 'es2015']
});
require('babel-polyfill');

const fs = require('fs');
const path = require('path');

const handlers = require('./lib/tools');
const appGet = require('./lib/appVerGet');
const getRooms = require('./lib/getRooms');
const locationSend = require('./lib/locationSend');
const hasMeetingAuth = require('./lib/hasMeetingAuth');
const createServiceTickets = require('./lib/createServiceTicket');
const bookRoom = require('./lib/bookRoom');
const checkUnfinied = require('./lib/checkUnfinied');
const transferRoom = require('./lib/transferRoom');

// 关联设备的用户id以及用户名
const tgt = '';
const userName = '';

// 待转让的用户
let isToTransfer = true;
const transferName = '';

// 会议室最小容量
const minOpacity = 5;

// 会议室预定时间段
const timeQuantum = ['14:00', '15:00', '16:00', '17:00'];

const distCacheDir = path.resolve('./common/');
const distCacheFile = distCacheDir + '/cache';
const loginAgain = true;
let retryTimes = 0;
let retryBook = true;
let cachedCookies;

const getDate = function (days) {
    let current = new Date();
    let year = current.getFullYear();
    let mon = current.getMonth() + 1;
    let day = current.getDate() + days;
    let realDate = handlers.checkYearMonAndDay(year, mon, day);
    if (realDate.mon < 10) {
        realDate.mon = '0' + realDate.mon;
    }
    if (realDate.day < 10) {
        realDate.day = '0' + realDate.day;
    }
    return realDate.year + '-' + realDate.mon + '-' + realDate.day;
};

let bookDate = getDate(7);
let checkDate = getDate(8);

const startLogin = function () {
    let allCookies = {};
    let getCookie = locationSend().then((data) => {
        if (data && data.header && data.header['set-cookie']) {
            let cookies = data.header['set-cookie'];
            if (!cookies.length) {
                return;
            }
            let vals = cookies[0].split(';');
            allCookies['baiduId'] = vals[0];
            allCookies['timestamp'] = (new Date()).getTime();
            return createServiceTickets(tgt, allCookies['baiduId']);
        }
        else {
            throw Error('1');
        }
    }).then((data) => {
        if (data && data.body && data.body.code === 200) {
            allCookies['userId'] = data.body.st.id;
            return appGet(allCookies['userId']);
        }
        else {
            throw Error('2');
        }
    }).then((data) => {
        if (data && data.body && data.body.message) {
            let cookies = data.header && data.header['set-cookie'];
            if (!cookies || !cookies.length) {
                return;
            }
            let vals = cookies[0].split(';');
            allCookies['connectSid'] = vals[0];
            return hasMeetingAuth(userName, allCookies['userId']);
        }
        else {
            throw Error('3');
        }
    }).then((data) => {
        if (data && data.body && data.body.code === 200) {
            let cookies = data.header && data.header['set-cookie'];
            if (!cookies || !cookies.length) {
                return;
            }
            let vals = cookies[0].split(';');
            allCookies['jsession'] = vals[0];
            let cacheFileStream = fs.createWriteStream(distCacheFile, {
                flags: 'w',
                encoding: 'utf8',
                mode: 0o666
            });
            let cookieStr = JSON.stringify(allCookies);
            cacheFileStream.write(cookieStr);
            cacheFileStream.end();
            console.log('-->>> 登录成功');
            processStart(allCookies);
        }
        else {
            throw Error('4');
        }
    }).catch(e => {
        console.log(e);
    });
};

const getCookies = function (again) {
    fs.exists(distCacheFile, (exist) => {
        if (exist) {
            cachedCookies = fs.readFileSync(distCacheFile, 'utf8');
            let dateNow = (new Date()).getTime();
            try {
                cachedCookies = JSON.parse(cachedCookies);
            }
            catch (e) {
                cachedCookies = cachedCookies;
            }
            if (dateNow - parseInt(cachedCookies.timestamp, 10) >= 43200000) {
                startLogin();
            }
            else {
                processStart(cachedCookies);
            }
        }
        else {
            startLogin();
        }
    });
};

const processStart = function (cookieObj) {
    console.log('-->>> 开始预定会议室');
    let uuapId = '';
    let getUid = createServiceTickets(tgt, cookieObj['baiduId']).then(data => {
        if (data && data.body && data.body.code === 200) {
            console.log('-->>> uuap认证');
            uuapId = data.body.st.id;
            return getRooms(userName, data.body.st.id, cookieObj, bookDate);
        }
    }).then(data => {
        if (data && data.body && data.body.code === 200) {
            console.log('-->>> 可预定会议室获取成功');
            return handlers.filterList(data.body.data.list, {
                minOpacity: minOpacity,
                timeQuantum: timeQuantum
            });
        }
        else {
            return [];
        }
    }).then(data => {
        if (data && data.length) {
            console.log('-->>> 开始预定');
            return bookRoom(data, uuapId, userName, bookDate, cookieObj);
        }
    }).then(data => {
        console.log('-->>> 获取已预定会议室');
        return checkUnfinied(userName, uuapId, bookDate, checkDate, cookieObj);
    }).then(data => {
        if (isToTransfer && data && data.body && data.body.data && data.body.data.list && data.body.data.list.length) {
            console.log('-->>> 开始转让会议室');
            isToTransfer = false;
            return transferRoom(userName, uuapId, transferName, data.body.data.list, cookieObj);
        }
    }).then (data => {
        if (!isToTransfer && retryBook) {
            console.log('-->>> 转让后重新预定');
            retryBook = false;
            getCookies();
        }
    }).catch(e => {
        if (e && e.errorCode && e.errorCode === 911 && retryTimes < 2) {
            retryTimes++;
            getCookies();
        }
    });
};
getCookies();
module.exports = getCookies;










