const moment = require('moment');

const date = moment();
// date.add(1, 'years');
// date.subtract(9, 'months');

// 10:35 am
// 6:06 am
console.log(date.format('H:mm a'));

const timeStamp = moment().valueOf();
console.log(timeStamp);
