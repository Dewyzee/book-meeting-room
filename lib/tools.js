/**
 * @file 数据处理方法
 */

 const hanldlers = {
    filterList: function (lists, options) {
        let timeQuantum = options.timeQuantum;
        if (!timeQuantum) {
            return lists;
        }
        let filterResult = lists.filter((item, index) => {
            let roomCapacity = item.roomCapacity;
            let startTimeAll = item.startTimeStr.split(' ');
            let startTimeHour = startTimeAll[1];
            return (+item.roomCapacity > options.minOpacity
                && options.timeQuantum.includes(startTimeHour));
        });
        return filterResult;
    },
    checkYearMonAndDay: function (tempYear, tempMon, tempDay) {
        switch(tempMon) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
                if (tempDay > 31) {
                    return {
                        year: tempYear,
                        mon: tempMon + 1,
                        day: tempDay - 31
                    }
                }
                else  {
                    return {
                        year: tempYear,
                        mon: tempMon,
                        day: tempDay
                    }
                }
                break;
            case 2:
                let run = (!(year % 100) && !(year % 400)) || ((year % 100) && !(year % 4));
                if (run) {
                    if (tempDay > 29) {
                        return {
                            year: tempYear,
                            mon: tempMon + 1,
                            day: tempDay - 31
                        }
                    }
                    else {
                        return {
                            year: tempYear,
                            mon: tempMon,
                            day: tempDay
                        }
                    }
    
                }
                else {
                    if (tempDay > 28) {
                        return {
                            year: tempYear,
                            mon: tempMon + 1,
                            day: tempDay - 31
                        }
                    }
                    else {
                        return {
                            year: tempYear,
                            mon: tempMon,
                            day: tempDay
                        }
                    }
    
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                if (tempDay > 30) {
                    return {
                        year: tempYear,
                        mon: tempMon + 1,
                        day: tempDay - 30
                    }
                }
                else  {
                    return {
                        year: tempYear,
                        mon: tempMon,
                        day: tempDay
                    }
                }
                break;
            case 12:
                if (tempDay > 31) {
                    return {
                        year: tempYear + 1,
                        mon: 1,
                        day: tempDay - 31
                    }
                }
                else {
                    return {
                        year: tempYear,
                        mon: mon,
                        day: tempDay
                    }
                }
                break;
        }
    }
 };

 module.exports = hanldlers;