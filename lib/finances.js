/**
 * Orders API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Kevin Dolan
 */
var mws = require('./mws');

/**
 * Construct an Orders API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */
function FinancesRequest(action, params) {
    var opts = {
        name: 'Finances',
        group: 'Finances Retrieval',
        path: '/Finances/2015-05-01',
        version: '2015-05-01',
        legacy: false,
        action: action,
        params: params
    };
    return new mws.Request(opts);
}

/**
 * Ojects to represent enum collections used by some request(s)
 * @type {Object}
 */
var enums = exports.enums = {

    FulfillmentChannels:  function() {
        return new mws.Enum(['AFN', 'MFN']);
    },

    OrderStatuses:  function() {
        return new mws.Enum(['Pending', 'Unshipped', 'PartiallyShipped', 'Shipped', 'Canceled', 'Unfulfillable']);
    },

    PaymentMethods:  function() {
        return new mws.Enum(['COD', 'CVS', 'Other']);
    }

};

/**
 * Contains brief definitions for unique data type values.
 * Can be used to explain input/output to users via tooltips, for example
 * @type {Object}
 */
var types = exports.types = {
    ServiceStatus: {
        'GREEN':'The service is operating normally.',
        'GREEN_I':'The service is operating normally + additional info provided',
        'YELLOW':'The service is experiencing higher than normal error rates or degraded performance.',
        'RED':'The service is unabailable or experiencing extremely high error rates.' }
};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var calls = exports.requests = {

    /**
     * Requests the operational status of the Orders API section.
     */
    GetServiceStatus: function() {
        return new FinancesRequest('GetServiceStatus', {});
    },

    /**
     * Returns financial created or updated during a time frame you specify or by order or groupId.
     */
    ListFinancialEvents: function() {
        return new FinancesRequest('ListFinancialEvents', {
            PostedAfter: { name: 'PostedAfter', type: 'Timestamp' },
            PostedBefore: { name: 'PostedBefore', type: 'Timestamp' },
            FinancialEventGroupId: { name: 'FinancialEventGroupId' },
            AmazonOrderId: {name: 'AmazonOrderId'},
            MaxResultsPerPage: { name: 'MaxResultsPerPage' }
        });
    },

    /**
     * Returns the next page of events using the NextToken parameter.
     */
    ListFinancialEventsByNextToken: function() {
        return new FinancesRequest('ListFinancialEventsByNextToken', {
            NextToken: { name: 'NextToken', required: true }
        });
    },

    /**
     * Returns financial event groups
     */
    ListFinancialEventGroups: function() {
        return new FinancesRequest('ListFinancialEventGroups', {
            StartedAfter: { name: 'FinancialEventGroupStartedAfter', type: 'Timestamp', required: true },
            StartedBefore: { name: 'FinancialEventGroupStartedBefore', type: 'Timestamp' },
            MaxResultsPerPage: { name: 'MaxResultsPerPage' }
        });
    },

    /**
     * Returns the next page of groups using the NextToken parameter.
     */
    ListFinancialEventsByNextToken: function() {
        return new FinancesRequest('ListFinancialEventsByNextToken', {
            NextToken: { name: 'NextToken', required: true }
        });
    }
};
