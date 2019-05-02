/**
 * Feeds API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
var mws = require('./mws');

/**
 * Construct a Feeds API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */
function FeedsRequest(action, params, isUpload) {
  var opts = {
    name: 'Feeds',
    group: 'Feeds',
    path: '/',
    upload: !!isUpload,
    version: '2009-01-01',
    legacy: true,
    action: action,
    // This next field is the just the SPECIFICATION (schema) of the parameters.
    // There are no VALUES for these parameters yet.
    params: params
  };
  // Note that mws.Request is AmazonMwsRequest in the mws.js file.
  return new mws.Request(opts);
}

/**
 * Objects to represent enum collections used by some request(s)
 * @type {Object}
 */
var enums = exports.enums = {

  FeedProcessingStatuses: function () {
    return new mws.Enum(['_SUBMITTED_', '_IN_PROGRESS_', '_CANCELLED_', '_DONE_']);
  },

  FeedTypes: function () {
    return new mws.Enum([
      '_POST_PRODUCT_DATA_', '_POST_PRODUCT_RELATIONSHIP_DATA_', '_POST_PRODUCT_OVERRIDES_DATA_', '_POST_PRODUCT_IMAGE_DATA_',
      '_POST_PRODUCT_PRICING_DATA_', '_POST_INVENTORY_AVAILABILITY_DATA_', '_POST_ORDER_ACKNOWLEDGEMENT_DATA_', '_POST_ORDER_FULFILLMENT_DATA_',
      '_POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN_', '_POST_FBA_INBOUND_CARTON_CONTENTS_', '_POST_FLAT_FILE_FBA_CREATE_REMOVAL_', '_POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN_', '_POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA_', '_POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_', '_POST_FULFILLMENT_ORDER_REQUEST_DATA_',
      '_POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_', '_POST_PAYMENT_ADJUSTMENT_DATA_', '_POST_INVOICE_CONFIRMATION_DATA_',
      '_POST_FLAT_FILE_LISTINGS_DATA_', '_POST_FLAT_FILE_ORDER_ACKNOWLEDGEMENT_DATA_', '_POST_FLAT_FILE_FULFILLMENT_DATA_',
      '_POST_FLAT_FILE_PAYMENT_ADJUSTMENT_DATA_', '_POST_FLAT_FILE_INVOICE_CONFIRMATION_DATA_', '_POST_FLAT_FILE_INVLOADER_DATA_', '_POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA_',
      '_POST_FLAT_FILE_BOOKLOADER_DATA_', '_POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA_', '_POST_UIEE_BOOKLOADER_DATA_', '_POST_STD_ACES_DATA_'
    ]);
  }

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var calls = exports.requests = {

  CancelFeedSubmissions: function () {
    return new FeedsRequest('CancelFeedSubmissions', {
      FeedSubmissionIds: { name: 'FeedSubmissionIdList.Id', list: true, required: false },
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      SubmittdFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' }
    });
  },

  GetFeedSubmissionList: function () {
    return new FeedsRequest('GetFeedSubmissionList', {
      FeedSubmissionIds: { name: 'FeedSubmissionIdList.Id', list: true, required: false },
      MaxCount: { name: 'MaxCount' },
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      FeedProcessingStatuses: { name: 'FeedProcessingStatusList.Status', list: true, type: 'bde.FeedProcessingStatuses' },
      SubmittedFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' }
    });
  },

  GetFeedSubmissionListByNextToken: function () {
    return new FeedsRequest('GetFeedSubmissionListByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  },

  GetFeedSubmissionCount: function () {
    return new FeedsRequest('GetFeedSubmissionCount', {
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      FeedProcessingStatuses: { name: 'FeedProcessingStatusList.Status', list: true, type: 'bde.FeedProcessingStatuses' },
      SubmittedFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' }
    });
  },

  GetFeedSubmissionResult: function () {
    return new FeedsRequest('GetFeedSubmissionResult', {
      FeedSubmissionId: { name: 'FeedSubmissionId', required: true }
    });
  },

  SubmitFeed: function () {
    return new FeedsRequest('SubmitFeed',
      // schema:
      {
        FeedContents: { name: '_BODY_', required: true },
        FeedType: { name: 'FeedType', required: true },
        FeedContentType: { name: '_FORMAT_', required: false },
        MarketplaceIds: { name: 'MarketplaceIdList.Id', list: true, required: false },
        PurgeAndReplace: { name: 'PurgeAndReplace', required: false, type: 'Boolean' }
      }, true);
  }

};
