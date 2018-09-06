'use strict';
var qs = require('querystring');
var crypto = require('crypto');
var xml2js = require('xml2js');
var request = require('request');
var _ = require('underscore');
var tls = require('tls');
var define = require('./define');

/**
 * Constructor for the main MWS client interface used to make api calls and
 * various data structures to encapsulate MWS requests, definitions, etc.
 *
 * @param {String} accessKeyId     Id for your secret Access Key (required)
 * @param {String} secretAccessKey Secret Access Key provided by Amazon (required)
 * @param {String} merchantId      Aka SellerId, provided by Amazon (required)
 * @param {Object} options         Additional configuration options for this instance
 */
function AmazonMwsClient(accessKeyId, secretAccessKey, merchantId, options) {
  options = options || {};

  var createCredentials = tls.createSecureContext || crypto.createCredentials;
  this.host = options.host || define.Endpoint.us;
  this.creds = createCredentials(options.creds || {});
  this.appName = options.appName || 'mws-js';
  this.appVersion = options.appVersion || '0.1.0';
  this.appLanguage = options.appLanguage || 'JavaScript';
  this.accessKeyId = accessKeyId || null;
  this.secretAccessKey = secretAccessKey || null;
  this.merchantId = merchantId || null;
  this.authToken = options.authToken;
  this.reqOpts = options.requestOpts || {};
}

/**
 * The method used to invoke calls against MWS Endpoints. Recommended usage is
 * through the invoke wrapper method when the api call you're invoking has a
 * request defined in one of the submodules. However, you can use call() manually
 * when a lower level of control is necessary (custom or new requests, for example).
 *
 * @param  {Object}   api      Settings object unique to each API submodule
 * @param  {String}   action   Api `Action`, such as GetServiceStatus or GetOrder
 * @param  {Object}   query    Any parameters belonging to the current action
 * @return Promise
 */
AmazonMwsClient.prototype.call = function (api, action, query) {
  if (this.secretAccessKey == null || this.accessKeyId == null || this.merchantId == null) {
    throw 'accessKeyId, secretAccessKey, and merchantId must be set';
  }

  var requestOpts = Object.assign({}, this.reqOpts, {
    method: 'POST',
    uri: 'https://' + this.host + api.path
  });

  // Check if we're dealing with a file (such as a feed) upload
  if (api.upload) {
    requestOpts.body = query._BODY_;
    query._FORMAT_ = 'application/x-www-form-urlencoded';
    requestOpts.headers = {
      'Content-Type': query._FORMAT_,
      'Content-MD5': crypto.createHash('md5').update(query._BODY_).digest('base64')
    };
    delete query._BODY_;
    delete query._FORMAT_;
  }

  // Add required parameters and sign the query
  query['Action'] = action;
  query['Version'] = api.version;
  query['Timestamp'] = new Date().toISOString();
  query['AWSAccessKeyId'] = this.accessKeyId;

  if (this.authToken) {
    query['MWSAuthToken'] = this.authToken;
  }

  if (api.legacy) {
    query['Merchant'] = this.merchantId;
  } else {
    query['SellerId'] = this.merchantId;
  }

  query = this.sign(api.path, query);

  if (!api.upload) {
    requestOpts.form = query;
  } else {
    requestOpts.qs = query;
  }

  return new Promise(function (resolve, reject) {
    request(requestOpts, function (err, response, data) {
      if (err) {
        reject(err);
      } else {
        if (data.slice(0, 5) == '<?xml') {
          xml2js.parseString(data, function (err, result) {
            // Throw an error if there was a problem reported
            if (err != null) {
              reject(new Error(err.Code + ': ' + err.Message));
            } else {
              resolve(result);
            }
          });
        } else {
          resolve(data);
        }
      }
    });
  });
};

/**
 * Calculates the HmacSHA256 signature and appends it with additional signature
 * parameters to the provided query object.
 *
 * @param  {String} path  Path of API call (used to build the string to sign)
 * @param  {Object} query Any non-signature parameters that will be sent
 * @return {Object}       Finalized object used to build query string of request
 */
AmazonMwsClient.prototype.sign = function (path, query) {
  // Configure the query signature method/version
  query['SignatureMethod'] = 'HmacSHA256';
  query['SignatureVersion'] = '2';

  // Copy query keys, sort them, then copy over the values
  var sorted = _.reduce(_.keys(query).sort(), function (m, k) {
    m[k] = query[k];
    return m;
  }, {});

  var stringToSign = ['POST', this.host, path, qs.stringify(sorted)].join('\n');

  query['Signature'] = crypto.createHmac('sha256', this.secretAccessKey).update(stringToSign, 'utf8').digest('base64');

  return query;
};

/**
 * Suggested method for invoking a pre-defined mws request object.
 *
 * @param  {Object}   request  An instance of AmazonMwsRequest with params, etc.
 * @return Promise
 */
AmazonMwsClient.prototype.invoke = function (request) {
  var _this = this;
  return request.query().then(function (q) {
    return _this.call(request.api, request.action, q);
  });
};

/**
 * Constructor for general MWS request objects, wrapped by api submodules to keep
 * things DRY, yet familiar despite whichever api is being implemented.
 *
 * @param {Object} options Settings to apply to new request instance.
 */
function AmazonMwsRequest(options) {
  this.api = {
    path: options.path || '/',
    version: options.version || '2009-01-01',
    legacy: options.legacy || false,
    upload: options.upload
  };
  this.action = options.action || 'GetServiceStatus';
  this.params = options.params || {};
  this.paramsMap = {};

  if (Object.keys(this.params).length > 0) {
    for (var name in this.params) {
      var realName = this.params[name].name;
      if (name !== this.params[name].name) {
        this.paramsMap[name] = realName;
        this.params[realName] = this.params[name];
        delete this.params[name];
      }
    }
  }
}

/**
 * Handles the casting, renaming, and setting of individual request params.
 *
 * @param {String} param Key of parameter (not ALWAYS the same as the param name!)
 * @param {Mixed} value Value to assign to parameter
 * @return {Object} Current instance to allow function chaining
 */
AmazonMwsRequest.prototype.set = function (param, value) {
  if (param instanceof Object && (value === null || value === undefined)) {
    return this.setMultiple(param);
  } else if (value !== null && value !== undefined) {
    var self = this;

    if (this.paramsMap.hasOwnProperty(param)) {
      param = this.paramsMap[param];
    }

    var p = this.params[param],
      v = p.value = {};
    // Handles the actual setting based on type
    var setListValue = function setListValue(name, val) {
      if (p.type == 'Timestamp') {
        v[name] = val.toISOString();
      } else if (p.type == 'Boolean') {
        v[name] = val ? 'true' : 'false';
      } else {
        v[name] = val;
      }
    };

    // Handles the actual setting based on type
    var setValue = function setValue(name, val) {
      if (p.type == 'Timestamp') {
        self.params[name].value = val.toISOString();
      } else if (p.type == 'Boolean') {
        self.params[name].value = val ? 'true' : 'false';
      } else {
        self.params[name].value = val;
      }
    };

    // Lists need to be sequentially numbered and we take care of that here
    if (p.list) {
      var i = 0;
      if (typeof value == 'string' || typeof value == 'number') {
        setListValue(p.name + '.1', value);
      }
      if (typeof value == 'object') {
        if (Array.isArray(value)) {
          for (i = value.length - 1; i >= 0; i--) {
            setListValue(p.name + '.' + (i + 1), value[i]);
          }
        } else {
          for (var key in value) {
            setListValue(p.name + '.' + ++i, value[key]);
          }
        }
      }
    } else {
      setValue(p.name, value);
    }
  }
  return this;
};

AmazonMwsRequest.prototype.setMultiple = function (conf) {
  _.each(conf, (function (value, key) {
    this.set(key, value);
  }).bind(this));

  return this;
};

/**
 * Builds a query object and checks for required parameters.
 *
 * @return {Object} KvP's of all provided parameters (used by invoke())
 */
AmazonMwsRequest.prototype.query = function () {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var q = {};
    var missing = [];
    for (var param in _this.params) {
      var value = _this.params[param].value,
        name = _this.params[param].name,
        complex = _this.params[param].type === 'Complex',
        list = _this.params[param].list,
        required = _this.params[param].required;
      if (value !== undefined && value !== null) {
        if (complex) {
          value.appendTo(q);
        } else if (list) {
          for (var p in value) {
            q[p] = value[p];
          }
        } else {
          q[name] = value;
        }
      } else {
        if (param.required === true) {
          missing.push(name);
        }
      }
    }
    if (missing.length > 0) reject(new Error('ERROR: Missing required parameter(s): ' + missing.join(',') + '!'));
    else resolve(q);
  });
};

/**
 * Contructor for objects used to represent enumeration states. Useful
 * when you need to make programmatic updates to an enumerated data type or
 * wish to encapsulate enum states in a handy, re-usable variable.
 *
 * @param {Array} choices An array of any possible values (choices)
 */
function EnumType(choices) {
  for (var choice in choices) {
    this[choices[choice]] = false;
  }
  this._choices = choices;
}

/**
 * Enable one or more choices (accepts a variable number of arguments)
 * @return {Object} Current instance of EnumType for chaining
 */
EnumType.prototype.enable = function () {
  for (var arg in arguments) {
    this[arguments[arg]] = true;
  }
  return this;
};

/**
 * Disable one or more choices (accepts a variable number of arguments)
 * @return {Object} Current instance of EnumType for chaining
 */
EnumType.prototype.disable = function () {
  for (var arg in arguments) {
    this[arguments[arg]] = false;
  }
  return this;
};

/**
 * Toggles one or more choices (accepts a variable number of arguments)
 * @return {Object} Current instance of EnumType for chaining
 */
EnumType.prototype.toggle = function () {
  for (var arg in arguments) {
    this[arguments[arg]] = !this[arguments[arg]];
  }
  return this;
};

/**
 * Return all possible values without regard to current state
 * @return {Array} Choices passed to EnumType constructor
 */
EnumType.prototype.all = function () {
  return this._choices;
};

/**
 * Return all enabled choices as an array (used to set list params, usually)
 * @return {Array} Choice values for each choice set to true
 */
EnumType.prototype.values = function () {
  var value = [];
  for (var choice in this._choices) {
    if (this[this._choices[choice]] === true) {
      value.push(this._choices[choice]);
    }
  }
  return value;
};

// /**
//  * Takes an object and adds an appendTo function that will add
//  * each kvp of object to a query. Used when dealing with complex
//  * parameters that need to be built in an abnormal or unique way.
//  *
//  * @param {String} name Name of parameter, prefixed to each key
//  * @param {Object} obj  Parameters belonging to the complex type
//  */
// function ComplexType(name) {
// 	this.pre = name;
// 	var _obj = obj;
// 	obj.appendTo = function(query) {
// 		for (var k in _obj) {
// 			query[name + '.' k] = _obj[k];
// 		}
// 		return query;
// 	}
// 	return obj;
// }

// ComplexType.prototype.appendTo = function(query) {
// 	for (var k in value)
// }

/**
 * Complex List helper object. Once initialized, you should set
 * an add(args) method which pushes a new complex object to members.
 *
 * @param {String} name Name of Complex Type (including .member or subtype)
 */
function ComplexListType(name) {
  this.pre = name;
  this.members = [];
}

/**
 * Appends each member object as a complex list item
 * @param  {Object} query Query object to append to
 * @return {Object}       query
 */
ComplexListType.prototype.appendTo = function (query) {
  var members = this.members;
  for (var i = 0; i < members.length; i++) {
    for (var j in members[i]) {
      query[this.pre + '.' + (i + 1) + '.' + j] = members[i][j];
    }
  }
  return query;
};

exports.Client = AmazonMwsClient;
exports.Request = AmazonMwsRequest;
exports.Enum = EnumType;
exports.ComplexList = ComplexListType;
exports.Endpoint = define.Endpoint
exports.MarketplaceId = define.MarketplaceId
exports.Fbs = require('./fba');
exports.Fba = require('./fba');
exports.Orders = require('./orders');
exports.Sellers = require('./sellers');
exports.Feeds = require('./feeds');
exports.Products = require('./products');
exports.Reports = require('./reports');
