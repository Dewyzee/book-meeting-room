/**
 * @file
 * @author
 */

const start = require('./start');
const schedule = require('node-schedule');

function startSchedule() {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(1, 5)];
    rule.hour = 10;
    rule.minute = [0, 1, 3, 5, 7, 10, 15, 30];
    rule.second = 0;
    return schedule.scheduleJob(rule, start);
}

startSchedule();
