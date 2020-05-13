const moment = require('moment');
const { WEEK_DAYS_ENUM } = require('../utils/const-utils');

class WeekDayHelper {
  constructor() {
    this._weekDay = (moment().format('dddd')).toUpperCase();
    this._weekDayIndex = WEEK_DAYS_ENUM.indexOf(this._weekDay);
  }

  get weekDay() {
    return WEEK_DAYS_ENUM[this._weekDayIndex];
  }

  nextDay() {
    this._weekDayIndex += 1;
    if (this._weekDayIndex > 6) {
      this._weekDayIndex = 0;
    }
    this._weekDay = WEEK_DAYS_ENUM[this._weekDayIndex];
    return this;
  }

}

module.exports = WeekDayHelper;