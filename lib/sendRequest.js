/**
 * @file 发送请求
 * @author Dewyzee<xutao05@baidu.com>
 */

const https = require('https');

module.exports = function (options) {
    return new Promise((resolve, reject) => {
        let finalUrl = options.main.path;
        let timeout = 4000;
        let timeoutEventId;
        if (options.main && options.main.method === 'GET') {
            finalUrl = finalUrl + '?' + options.data;
        }
        let finalOption = Object.assign({}, options.main, {
            path: finalUrl
        });
        let requestObj = https.request(finalOption, (res) => {
            res.setEncoding('utf8');
            let body = '';
            let header = res.headers;
            res.on('data', (d) => {
                clearTimeout(timeoutEventId);
                body += d;
            });
            res.on('end', () => {
                try {
                    body = JSON.parse(body);
                    resolve({
                        header,
                        body
                    });
                }
                catch (e) {
                    resolve({});
                }
            });
        });
        if (options.main && options.main.method === 'POST') {
            requestObj.write(options.data);
        }
        requestObj.on('error', (e) => {
            reject(e);
        });
        //超时
        requestObj.on('timeout', (msg) => {
            requestObj.res && requestObj.res.abort();
            requestObj.abort();
            reject(msg);
        });

        timeoutEventId = setTimeout(() => {
            requestObj.emit('timeout',{message:'have been timeout...', errorCode: 911});
        }, timeout);

        requestObj.end();
    });
}