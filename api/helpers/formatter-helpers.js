const { isParamEmpty } = require('simple-object-handler');
const moment = require('moment');

const { specialCharactersRegex, removeMoreThanOneSpaceBetweenWordsRegex } = require('../utils/regex-utils');

const normalize = (value = null) => {
  if (!isParamEmpty(value)) {
    return value
      .replace(specialCharactersRegex, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\uFFFD/g, '')
      .replace(removeMoreThanOneSpaceBetweenWordsRegex, ' ')
      .trim();
  }
  return null;
};

/**
 * https://medium.com/@yazeedb/youtube-durations-in-4-lines-of-javascript-e9a92cea67a4
*/
const formatYoutubeDuration = (duration) => moment
  .duration(duration).asMinutes().toFixed(2);

module.exports = {
  normalize,
  formatYoutubeDuration,
};