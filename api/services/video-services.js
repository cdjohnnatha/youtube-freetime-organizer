const { google } = require('googleapis');
const logger = require('../config/logger');
const { formatYoutubeDuration } = require('../helpers/formatter-helpers');
const VideoDurationHelper = require('../helpers/video-duration-helpers');
const { TimesheetVideos, TimesheetVideoThumbnails } = require('../db/models');
const videoDetailsMock = require('./__mock__/videosDetailsMock.json');
const videoItemsMock = require('./__mock__/videosItemsMock.json');
let instance = null;

const MAX_YOUTURE_RESULTS_PER_PAGE = 50;
const isProduction = process.env.NODE_ENV === 'production';
class VideoService {
  constructor({ availableHoursPerWeek, highestAvailableMinutesTime, searchKeywords }) {
    const { MAX_ITEMS_VIDEO_SEARCH, YOUTUBE_SECRET_KEY } = process.env;
    this._youtube = google.youtube('v3');
    this._videosMapping = {};
    this._videosList = [];
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

  get videoMappingList() {
    return this._videosMapping;
  }

  get totalDaysNeededToWatchVideoList() {
    return this._daysNeededToWatchVideoList;
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
    if (Array.isArray(items) && items.length > 0) {
      items.forEach(({ id }) => {
        this._videoIds.push(id.videoId);
        this._videosMapping[`_${id.videoId}`] = {};
      });
    }
    return this;
  }

  _buildThumbnails = (thumbnails) => {
    const thumbnailList = [];
    for (let key in thumbnails) {
      thumbnailList.push({
        image_quality_type: key,
        ...thumbnails[key]
      });
    }

    return thumbnailList;
  }

  _buildVideoDetails(items, timesheet_id) {
    console.log('\n\n[_buildVideoDetails]');
    console.log('[_buildVideoDetails]', timesheet_id);
    if (Array.isArray(items) && items.length > 0) {
      let duration = null;
      let timesheet_video_thumbnails = [];
      let timesheetVideo = null;
      items.forEach(({ id, snippet, contentDetails }) => {
        duration = formatYoutubeDuration(contentDetails.duration);
        if (duration <= this._highestAvailableMinutesTime) {
          timesheet_video_thumbnails = this._buildThumbnails(snippet.thumbnails);
          timesheetVideo = TimesheetVideos.build({
            title: snippet.title,
            description: snippet.description,
            timesheet_video_thumbnails,
            duration,
            timesheet_id,
            youtube_video_id_key: id,
          }, {
            include: [
              {
                model: TimesheetVideoThumbnails,
                as: 'timesheet_video_thumbnails'
              }
            ]
          });
          this._videosMapping[`_${id}`] = timesheetVideo;
          this._videosList.push(timesheetVideo);
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

  async searchVideo() {
    try {
      let nextPageToken = '';
      let items = null;
      let pageInfo = null;
      let hasAvailableVideos = true;

      let itemsArr = videoItemsMock;
      if (isProduction) {
        itemsArr = [];
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
        };
      }
      this._buildVideoMapping(itemsArr);
      return this;
    } catch (error) {
      throw error;
    }
  }

  async buildVideosDetailsFromIds(timesheet_id) {
    let nextPageToken = '';
    let items = null;
    let itemsList = [];
    let pageInfo = null;
    let hasAvailableVideos = true;
    if (isProduction) {
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
    } else {
      itemsList = videoDetailsMock.items;
    }
    console.log('[itemsList]', timesheet_id);
    this._buildVideoDetails(itemsList, timesheet_id);
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

  async saveTimesheetVideos(transaction) {
    if (this._videosList.length > 0 && transaction) {
      let saving = this._videosList.map((timesheetVideo) => {
        return timesheetVideo.save({ transaction });
      });
      saving = await Promise.all(saving);
      return saving;
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new VideoService();
    }

    return instance;
  }
}

module.exports = VideoService;