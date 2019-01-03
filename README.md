## 会议室预定功能介绍

* 抢购会议室

* 转让会议室

## 目录介绍

```bash

|
|--common/
    |
    |--cache
    |--const.js // 常量存放
|
|--lib/ // 业务请求处理
|
|--.bablerc
|
|--.gitignore
|
|--package.json
|
|--schedule.js // 进程守护
|
|--start.js // 抢购入口

```

## 任务启动

```bash

npm i

```

```bash

node start.js (单次任务)

```

```bash

forever start schedule.js (开启进程守护)

```

## 关于tgt常量

tgt是在移动办公后登录返回的值。移动办公登录对敏感信息进行了加密，无法对加密信息进行破解，需经过手机代理，重新登录获取到tgt值做替换。tgt值在``start.js``最开位置设置。
该值可能过一段时间过期失效(周期大概1到2个月，过期后需要重新登录获取)

## 关于const常量

登录后会绑定设备号，所以每个设备都有一个单独的设备号。为避免被发现作弊，需对请求抓包替换常量中的特殊信息。其中包括
``appKey`` ``deviceId`` ``deviceIdVer1`` ``mopAppKey`` ``osKernal`` ``osVersion`` ``resolution`` ``vendorModel`` ``dataId`` ``verKey``

以上常量只需要在变更主用户的时候代理更换