const { google } = require('googleapis');
const logger = require('../config/logger');
const { formatYoutubeDuration } = require('../helpers/formatter-helpers');
const VideoDurationHelper = require('../helpers/video-duration-helpers');

let instance = null;

const MAX_YOUTURE_RESULTS_PER_PAGE = 50;

class VideoService {
  constructor({ availableHoursPerWeek, highestAvailableMinutesTime, searchKeywords }) {
    const { MAX_ITEMS_VIDEO_SEARCH, YOUTUBE_SECRET_KEY } = process.env;
    this._youtube = google.youtube('v3');
    this._videosMapping = {};
    this._videoIds = [];
    this._secretKey = YOUTUBE_SECRET_KEY;
    this._itemsPerPage = 1;
    this._pendingPaginationHits = 4;
    this._daysNeededToWatchVideoList = 0;
    this._searchKeywords = searchKeywords;
    this._availableHoursPerWeek = availableHoursPerWeek;
    this._highestAvailableMinutesTime = highestAvailableMinutesTime;

    if (MAX_ITEMS_VIDEO_SEARCH > MAX_YOUTURE_RESULTS_PER_PAGE) {
      this._itemsPerPage = Math.round(MAX_ITEMS_VIDEO_SEARCH / MAX_YOUTURE_RESULTS_PER_PAGE);
      this._pendingPaginationHits = MAX_YOUTURE_RESULTS_PER_PAGE;
    }

  }

  async _searchListYoutube({ pageToken = '' }) {
    const searchResult = await this._youtube.search.list({
      q: this._searchKeywords,
      part: 'id',
      key: this._secretKey,
      maxResults: this._itemsPerPage,
      type: 'video',
      eventType: 'completed',
      pageToken,
    });
    return searchResult.data;
  };

  _buildVideoMapping(items) {
    if (Array.isArray(items) && items.length > 0 ) {
      items.forEach(({ id }) => {
        this._videoIds.push(id.videoId);
        this._videosMapping[`_${id.videoId}`] = {};
      });
    }
    return this;
  }

  _buildVideoDetails(items) {
    if (Array.isArray(items) && items.length > 0 ) {
      let duration = null;
      items.forEach(({ id, snippet, contentDetails }) => {
        duration = formatYoutubeDuration(contentDetails.duration);
        if (duration <= this._highestAvailableMinutesTime) {
          this._videosMapping[`_${id}`] = {
            title: snippet.title,
            description: snippet.description,
            thumbnails: snippet.thumbnails.default,
            duration,
          };
        } else {
          delete this._videosMapping[`_${id}`];
        }
      });
    }
    return this;
  }

  async _listYoutubeVideos({ pageToken }) {
    const searchResult = await this._youtube.videos.list({
      id: this._videoIds,
      part: 'snippet, contentDetails',
      key: this._secretKey,
      maxResults: this._itemsPerPage,
      type: 'video',
      eventType: 'completed',
      pageToken,
    });
    return searchResult.data;
  }

  get videoMappingList() {
    return this._videosMapping;
  }

  async searchVideo() {
    try {
      let nextPageToken = '';
      let items = null;
      let pageInfo = null;
      let hasAvailableVideos = true;
      let itemsArr = [];
      for (let count = 0; count < this._pendingPaginationHits; count += 1) {
        if (hasAvailableVideos) {
          ({
            nextPageToken,
            items,
            pageInfo,
          } = await this._searchListYoutube({ pageToken: nextPageToken }));
          itemsArr = [...itemsArr, ...items];
          hasAvailableVideos = (parseInt(pageInfo.totalResults) - this._itemsPerPage) > 0;
        } else {
          break;
        }
      }
      this._buildVideoMapping(itemsArr);
      return this;
    } catch (error) {
      throw error;
    }
  }

  async buildVideosDetailsFromIds() {
    let nextPageToken = '';
    let items = null;
    let itemsList = [];
    let pageInfo = null;
    let hasAvailableVideos = true;
    for (let count = 0; count < this._pendingPaginationHits; count += 1) {
      if (hasAvailableVideos) {
        ({
          nextPageToken,
          items,
          pageInfo,
        } = await this._listYoutubeVideos({ pageToken: nextPageToken }));
        hasAvailableVideos = (parseInt(pageInfo.totalResults) - this._itemsPerPage) > 0;
        itemsList = [...itemsList, ...items];
      } else {
        break;
      }
    }
    console.log('[itemsList]', itemsList);
    this._buildVideoDetails(itemsList);
    return this;
  }

  buildTotalDaysNeededToWatchVideoList() {
    const videoDurationHelper = new VideoDurationHelper(this._availableHoursPerWeek);
    for (let key in this._videosMapping) {
      videoDurationHelper.appendVideoToWatch(this._videosMapping[key].duration);
    }
    this._daysNeededToWatchVideoList = videoDurationHelper.totalDaysToWatchVideoList;
    return this;
  }

  static getInstance() {
    if (!instance) {
      instance = new VideoService();
    }

    return instance;
  }
}

module.exports = VideoService;