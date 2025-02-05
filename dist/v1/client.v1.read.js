"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_subclient_1 = __importDefault(require("../client.subclient"));
const globals_1 = require("../globals");
const helpers_1 = require("../helpers");
const client_v1_1 = __importDefault(require("../v1/client.v1"));
const tweet_paginator_v1_1 = require("../paginators/tweet.paginator.v1");
const mutes_paginator_v1_1 = require("../paginators/mutes.paginator.v1");
const user_paginator_v1_1 = require("../paginators/user.paginator.v1");
const list_paginator_v1_1 = require("../paginators/list.paginator.v1");
/**
 * Base Twitter v1 client with only read right.
 */
class TwitterApiv1ReadOnly extends client_subclient_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /* Tweets */
    /**
     * Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-show-id
     */
    singleTweet(tweetId, options = {}) {
        return this.get('statuses/show.json', { tweet_mode: 'extended', id: tweetId, ...options });
    }
    tweets(ids, options = {}) {
        return this.post('statuses/lookup.json', { tweet_mode: 'extended', id: ids, ...options });
    }
    /**
     * Returns a single Tweet, specified by either a Tweet web URL or the Tweet ID, in an oEmbed-compatible format.
     * The returned HTML snippet will be automatically recognized as an Embedded Tweet when Twitter's widget JavaScript is included on the page.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-oembed
     */
    oembedTweet(tweetId, options = {}) {
        return this.get('oembed', {
            url: `https://twitter.com/i/statuses/${tweetId}`,
            ...options,
        }, { prefix: 'https://publish.twitter.com/' });
    }
    /* Tweets timelines */
    /**
     * Returns a collection of the most recent Tweets and Retweets posted by the authenticating user and the users they follow.
     * The home timeline is central to how most users interact with the Twitter service.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-home_timeline
     */
    async homeTimeline(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('statuses/home_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.HomeTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the 20 most recent mentions (Tweets containing a users's @screen_name) for the authenticating user.
     * The timeline returned is the equivalent of the one seen when you view your mentions on twitter.com.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-mentions_timeline
     */
    async mentionTimeline(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('statuses/mentions_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.MentionTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the user_id parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    async userTimeline(userId, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            user_id: userId,
            ...options,
        };
        const initialRq = await this.get('statuses/user_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.UserTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the screen_name parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    async userTimelineByUsername(username, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            screen_name: username,
            ...options,
        };
        const initialRq = await this.get('statuses/user_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.UserTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Users */
    /**
     * Returns a variety of information about the user specified by the required user_id or screen_name parameter.
     * The author's most recent Tweet will be returned inline when possible.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-show
     */
    user(user) {
        return this.get('users/show.json', { tweet_mode: 'extended', ...user });
    }
    /**
     * Returns fully-hydrated user objects for up to 100 users per request,
     * as specified by comma-separated values passed to the user_id and/or screen_name parameters.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
     */
    users(query) {
        return this.get('users/lookup.json', { tweet_mode: 'extended', ...query });
    }
    /**
     * Returns an HTTP 200 OK response code and a representation of the requesting user if authentication was successful;
     * returns a 401 status code and an error message if not.
     * Use this method to test if supplied user credentials are valid.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
     */
    verifyCredentials(options = {}) {
        return this.get('account/verify_credentials.json', options);
    }
    /**
     * Returns an array of user objects the authenticating user has muted.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/mute-block-report-users/api-reference/get-mutes-users-list
     */
    async listMutedUsers(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('mutes/users/list.json', queryParams, { fullResponse: true });
        return new mutes_paginator_v1_1.MuteUserListV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns an array of numeric user ids the authenticating user has muted.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/mute-block-report-users/api-reference/get-mutes-users-ids
     */
    async listMutedUserIds(options = {}) {
        const queryParams = {
            stringify_ids: true,
            ...options,
        };
        const initialRq = await this.get('mutes/users/ids.json', queryParams, { fullResponse: true });
        return new mutes_paginator_v1_1.MuteUserIdsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Provides a simple, relevance-based search interface to public user accounts on Twitter.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-search
     */
    async searchUsers(query, options = {}) {
        const queryParams = {
            q: query,
            tweet_mode: 'extended',
            page: 1,
            ...options,
        };
        const initialRq = await this.get('users/search.json', queryParams, { fullResponse: true });
        return new user_paginator_v1_1.UserSearchV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Friendship API */
    /**
     * Returns detailed information about the relationship between two arbitrary users.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-show
     */
    friendship(sources) {
        return this.get('friendships/show.json', sources);
    }
    /**
     * Returns the relationships of the authenticating user to the comma-separated list of up to 100 screen_names or user_ids provided.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-lookup
     */
    friendships(friendships) {
        return this.get('friendships/lookup.json', friendships);
    }
    /**
     * Returns a collection of user_ids that the currently authenticated user does not want to receive retweets from.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-no_retweets-ids
     */
    friendshipsNoRetweets() {
        return this.get('friendships/no_retweets/ids.json', { stringify_ids: true });
    }
    /**
     * Returns a collection of numeric IDs for every user who has a pending request to follow the authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-incoming
     */
    async friendshipsIncoming(options = {}) {
        const queryParams = {
            stringify_ids: true,
            ...options,
        };
        const initialRq = await this.get('friendships/incoming.json', queryParams, { fullResponse: true });
        return new user_paginator_v1_1.FriendshipsIncomingV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of numeric IDs for every protected user for whom the authenticating user has a pending follow request.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-outgoing
     */
    async friendshipsOutgoing(options = {}) {
        const queryParams = {
            stringify_ids: true,
            ...options,
        };
        const initialRq = await this.get('friendships/outgoing.json', queryParams, { fullResponse: true });
        return new user_paginator_v1_1.FriendshipsOutgoingV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Account/user API */
    /**
     * Get current account settings for authenticating user.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-settings
     */
    accountSettings() {
        return this.get('account/settings.json');
    }
    /**
     * Returns a map of the available size variations of the specified user's profile banner.
     * If the user has not uploaded a profile banner, a HTTP 404 will be served instead.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-users-profile_banner
     */
    userProfileBannerSizes(params) {
        return this.get('users/profile_banner.json', params);
    }
    /* Lists */
    /**
     * Returns the specified list. Private lists will only be shown if the authenticated user owns the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-show
     */
    list(options) {
        return this.get('lists/show.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Returns all lists the authenticating or specified user subscribes to, including their own.
     * If no user is given, the authenticating user is used.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-list
     */
    lists(options = {}) {
        return this.get('lists/list.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Returns the members of the specified list. Private list members will only be shown if the authenticated user owns the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-members
     */
    async listMembers(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/members.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListMembersV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Check if the specified user is a member of the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-members-show
     */
    listGetMember(options) {
        return this.get('lists/members/show.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Returns the lists the specified user has been added to.
     * If user_id or screen_name are not provided, the memberships for the authenticating user are returned.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-memberships
     */
    async listMemberships(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/memberships.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListMembershipsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the lists owned by the specified Twitter user. Private lists will only be shown if the authenticated user is also the owner of the lists.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-ownerships
     */
    async listOwnerships(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/ownerships.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListOwnershipsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a timeline of tweets authored by members of the specified list. Retweets are included by default.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-statuses
     */
    async listStatuses(options) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/statuses.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.ListTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the subscribers of the specified list. Private list subscribers will only be shown if the authenticated user owns the specified list.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-subscribers
     */
    async listSubscribers(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/subscribers.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListSubscribersV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Check if the specified user is a subscriber of the specified list. Returns the user if they are a subscriber.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-subscribers-show
     */
    listGetSubscriber(options) {
        return this.get('lists/subscribers/show.json', { tweet_mode: 'extended', ...options });
    }
    /**
     * Obtain a collection of the lists the specified user is subscribed to, 20 lists per page by default.
     * Does not include the user's own lists.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-subscriptions
     */
    async listSubscriptions(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('lists/subscriptions.json', queryParams, { fullResponse: true });
        return new list_paginator_v1_1.ListSubscriptionsV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Media upload API */
    /**
     * The STATUS command (this method) is used to periodically poll for updates of media processing operation.
     * After the STATUS command response returns succeeded, you can move on to the next step which is usually create Tweet with media_id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/get-media-upload-status
     */
    mediaInfo(mediaId) {
        return this.get('media/upload.json', {
            command: 'STATUS',
            media_id: mediaId,
        }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
    }
    filterStream({ autoConnect, ...params } = {}) {
        const parameters = {};
        for (const [key, value] of Object.entries(params)) {
            if (key === 'follow' || key === 'track') {
                parameters[key] = value.toString();
            }
            else if (key === 'locations') {
                const locations = value;
                parameters.locations = helpers_1.arrayWrap(locations).map(loc => `${loc.lng},${loc.lat}`).join(',');
            }
            else {
                parameters[key] = value;
            }
        }
        const streamClient = this.stream;
        return streamClient.postStream('statuses/filter.json', parameters, { autoConnect });
    }
    sampleStream({ autoConnect, ...params } = {}) {
        const streamClient = this.stream;
        return streamClient.getStream('statuses/sample.json', params, { autoConnect });
    }
    /**
     * Create a client that is prefixed with `https//stream.twitter.com` instead of classic API URL.
     */
    get stream() {
        const copiedClient = new client_v1_1.default(this);
        copiedClient.setPrefix(globals_1.API_V1_1_STREAM_PREFIX);
        return copiedClient;
    }
    /* Trends API */
    /**
     * Returns the top 50 trending topics for a specific id, if trending information is available for it.
     * Note: The id parameter for this endpoint is the "where on earth identifier" or WOEID, which is a legacy identifier created by Yahoo and has been deprecated.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/trends-for-location/api-reference/get-trends-place
     */
    trendsByPlace(woeId, options = {}) {
        return this.get('trends/place.json', { id: woeId, ...options });
    }
    /**
     * Returns the locations that Twitter has trending topic information for.
     * The response is an array of "locations" that encode the location's WOEID
     * and some other human-readable information such as a canonical name and country the location belongs in.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-available
     */
    trendsAvailable() {
        return this.get('trends/available.json');
    }
    /**
     * Returns the locations that Twitter has trending topic information for, closest to a specified location.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-closest
     */
    trendsClosest(lat, long) {
        return this.get('trends/closest.json', { lat, long });
    }
    /* Geo API */
    /**
     * Returns all the information about a known place.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/place-information/api-reference/get-geo-id-place_id
     */
    geoPlace(placeId) {
        return this.get('geo/id/:place_id.json', undefined, { params: { place_id: placeId } });
    }
    /**
     * Search for places that can be attached to a Tweet via POST statuses/update.
     * This request will return a list of all the valid places that can be used as the place_id when updating a status.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-search
     */
    geoSearch(options) {
        return this.get('geo/search.json', options);
    }
    /**
     * Given a latitude and a longitude, searches for up to 20 places that can be used as a place_id when updating a status.
     * This request is an informative call and will deliver generalized results about geography.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-reverse_geocode
     */
    geoReverseGeoCode(options) {
        return this.get('geo/reverse_geocode.json', options);
    }
    /* Developer utilities */
    /**
     * Returns the current rate limits for methods belonging to the specified resource families.
     * Each API resource belongs to a "resource family" which is indicated in its method documentation.
     * The method's resource family can be determined from the first component of the path after the resource version.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/rate-limit-status/api-reference/get-application-rate_limit_status
     */
    rateLimitStatuses(...resources) {
        return this.get('application/rate_limit_status.json', { resources });
    }
    /**
     * Returns the list of languages supported by Twitter along with the language code supported by Twitter.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/supported-languages/api-reference/get-help-languages
     */
    supportedLanguages() {
        return this.get('help/languages.json');
    }
}
exports.default = TwitterApiv1ReadOnly;
