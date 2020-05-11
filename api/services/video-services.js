const { google } = require('googleapis');
const logger = require('../config/logger');
const { formatYoutubeDuration } = require('../helpers/formatter-helpers');
let instance = null;

const MAX_YOUTURE_RESULTS_PER_PAGE = 50;

class VideoService {
  constructor() {
    const { MAX_ITEMS_VIDEO_SEARCH, YOUTUBE_SECRET_KEY } = process.env;
    this._youtube = google.youtube('v3');
    this._videosMapping = {};
    this._videoIds = [];
    this._secretKey = YOUTUBE_SECRET_KEY;
    this._itemsPerPage = 1;
    this._pendingPaginationHits = 4;

    if (MAX_ITEMS_VIDEO_SEARCH > MAX_YOUTURE_RESULTS_PER_PAGE) {
      this._itemsPerPage = Math.round(MAX_ITEMS_VIDEO_SEARCH / MAX_YOUTURE_RESULTS_PER_PAGE);
      this._pendingPaginationHits = MAX_YOUTURE_RESULTS_PER_PAGE;
    }

  }

  async _searchListYoutube({ pageToken = '', searchKeywords }) {
    const searchResult = await this._youtube.search.list({
      q: searchKeywords,
      part: 'id',
      key: this._secretKey,
      maxResults: this._itemsPerPage,
      type: 'video',
      eventType: 'completed',
      pageToken,
    });
    return searchResult.data;
  };

  async searchVideo(searchKeywords) {
    try {
      let nextPageToken = '';
      let items = null;
      let pageInfo = null;
      let hasAvailableVideos = true;

      for (let count = 0; count < this._pendingPaginationHits; count += 1) {
        if (hasAvailableVideos) {
          ({
            nextPageToken,
            items,
            pageInfo,
          } = await this._searchListYoutube({ searchKeywords, pageToken: nextPageToken }));
          hasAvailableVideos = (parseInt(pageInfo.totalResults) - this._itemsPerPage) > 0;
          this.buildVideoMapping(items);
        } else {
          break;
        }
      }
      return this;
    } catch (error) {
      throw error;
    }
  }

  buildVideoMapping(items) {
    items.forEach(({ id }) => {
      this._videoIds.push(id.videoId);
      this._videosMapping[`_${id.videoId}`] = {};
    });
    return this;
  }

  _buildVideoDetails(items) {
    items.forEach(({ id, snippet, contentDetails }) => {
      this._videosMapping[`_${id}`] = {
        title: snippet.title,
        description: snippet.description,
        thumbnails: snippet.thumbnails.default,
        duration: formatYoutubeDuration(contentDetails.duration),
      };
    });
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

  async buildVideosDetailsFromIds() {
    let nextPageToken = '';
    let items = null;
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
        this._buildVideoDetails(items);
      } else {
        break;
      }
    }
    console.log(this._videosMapping);
  }

  static getInstance() {
    if (!instance) {
      instance = new VideoService();
    }

    return instance;
  }
}

module.exports = VideoService;