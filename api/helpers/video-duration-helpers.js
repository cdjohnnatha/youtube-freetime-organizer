class VideoDurationHelper {
  constructor(availableHoursPerWeek) {
    this._availableHoursPerWeek = availableHoursPerWeek;
    this._dayOfWeekIndex = 0;
    this._totalDaysToWatchVideoList = 0;
    this._watchedVideoDurationTime = 0;
  }

  get availableTime() {
    return this._availableHoursPerWeek[this._dayOfWeekIndex];
  }

  set availableTime(duration) {
    this._availableHoursPerWeek[this._dayOfWeekIndex] -= duration;
  }

  get totalDaysToWatchVideoList() {
    return this._totalDaysToWatchVideoList + 1;
  }

  _nextDay() {
    this._dayOfWeekIndex += 1;
    if (this._dayOfWeekIndex > 7) {
      this._dayOfWeekIndex = 0;
    }
    this._totalDaysToWatchVideoList += 1;
    return this;
  }

  appendVideoToWatch(duration) {
    if (this.availableTime - duration >= 0) {
      this.availableTime = duration;
    } else {
      this._nextDay();
      return this.appendVideoToWatch(duration);
    }

    return this;
  }
}

module.exports = VideoDurationHelper;