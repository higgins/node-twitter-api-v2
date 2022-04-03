"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeDeprecationWarning = exports.applyResponseHooks = exports.hasMultipleItems = exports.isTweetStreamV2ErrorPayload = exports.trimUndefinedProperties = exports.arrayWrap = exports.sharedPromise = void 0;
const settings_1 = require("./settings");
const types_1 = require("./types");
function sharedPromise(getter) {
    const sharedPromise = {
        value: undefined,
        promise: getter().then(val => {
            sharedPromise.value = val;
            return val;
        }),
    };
    return sharedPromise;
}
exports.sharedPromise = sharedPromise;
function arrayWrap(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}
exports.arrayWrap = arrayWrap;
function trimUndefinedProperties(object) {
    // Delete undefined parameters
    for (const parameter in object) {
        if (object[parameter] === undefined)
            delete object[parameter];
    }
}
exports.trimUndefinedProperties = trimUndefinedProperties;
function isTweetStreamV2ErrorPayload(payload) {
    // Is error only if 'errors' is present and 'data' does not exists
    return typeof payload === 'object'
        && 'errors' in payload
        && !('data' in payload);
}
exports.isTweetStreamV2ErrorPayload = isTweetStreamV2ErrorPayload;
function hasMultipleItems(item) {
    if (Array.isArray(item) && item.length > 1) {
        return true;
    }
    return item.toString().includes(',');
}
exports.hasMultipleItems = hasMultipleItems;
/* Response helpers */
function applyResponseHooks(requestParams, computedParams, requestOptions, error) {
    if (error instanceof types_1.ApiRequestError || error instanceof types_1.ApiPartialResponseError) {
        this.applyPluginMethod('onRequestError', {
            url: this.getUrlObjectFromUrlString(requestParams.url),
            params: requestParams,
            computedParams,
            requestOptions,
            error,
        });
    }
    else if (error instanceof types_1.ApiResponseError) {
        this.applyPluginMethod('onResponseError', {
            url: this.getUrlObjectFromUrlString(requestParams.url),
            params: requestParams,
            computedParams,
            requestOptions,
            error,
        });
    }
}
exports.applyResponseHooks = applyResponseHooks;
const deprecationWarningsCache = new Set();
function safeDeprecationWarning(message) {
    if (typeof console === 'undefined' || !console.warn || !settings_1.TwitterApiV2Settings.deprecationWarnings) {
        return;
    }
    const hash = `${message.instance}-${message.method}-${message.problem}`;
    if (deprecationWarningsCache.has(hash)) {
        return;
    }
    const formattedMsg = `[twitter-api-v2] Deprecation warning: In ${message.instance}.${message.method}() call` +
        `, ${message.problem}.\n${message.resolution}.`;
    console.warn(formattedMsg);
    console.warn('To disable this message, import variable TwitterApiV2Settings from twitter-api-v2 and set TwitterApiV2Settings.deprecationWarnings to false.');
    deprecationWarningsCache.add(hash);
}
exports.safeDeprecationWarning = safeDeprecationWarning;
