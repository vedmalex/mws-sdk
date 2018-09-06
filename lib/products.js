/**
 * Products API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
var mws = require('./mws');

/**
 * Construct a Products API request for using with mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */
function ProductsRequest(action, params) {
  var opts = {
    name: 'Products',
    group: 'Products',
    path: '/Products/2011-10-01',
    version: '2011-10-01',
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

  ItemConditions: function () {
    return new mws.Enum(['New', 'Used', 'Collectible', 'Refurbished', 'Club']);
  }

};

/**
 * Contains brief definitions for unique data type values.
 * Can be used to explain input/output to users via tooltips, for example
 * @type {Object}
 */
var types = exports.types = {

  CompetitivePriceId: {
    '1': 'New Buy Box Price',
    '2': 'Used Buy Box Price'
  },

  ServiceStatus: {
    'GREEN': 'The service is operating normally.',
    'GREEN_I': 'The service is operating normally + additional info provided',
    'YELLOW': 'The service is experiencing higher than normal error rates or degraded performance.',
    'RED': 'The service is unabailable or experiencing extremely high error rates.'
  },

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var calls = exports.requests = {

  /**
   * Requests the operational status of the Products API section.
   */
  GetServiceStatus: function () {
    return new ProductsRequest('GetServiceStatus', {});
  },

  /**
   * Returns a list of products and their attributes, ordered by relevancy,
   * based on a search query that you specify
   */
  ListMatchingProducts: function () {
    return new ProductsRequest('ListMatchingProducts', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      Query: { name: 'Query', required: true },
      QueryContextId: { name: 'QueryContextId' }
    });
  },

  /**
   * Returns a list of products and their attributes,
   * based on a list of ASIN values that you specify
   */
  GetMatchingProduct: function () {
    return new ProductsRequest('GetMatchingProduct', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },

  /**
   * Returns a list of products and their attributes,
   * based on a list of specified ID values that you specify
   */
  GetMatchingProductForId: function () {
    return new ProductsRequest('GetMatchingProductForId', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      IdType: { name: 'IdType', required: true },
      IdList: { name: 'IdList.Id', list: true, required: true }
    });
  },

  /**
   * Returns the current competitive pricing of a product,
   * based on the SellerSKU and MarketplaceId that you specify
   */
  GetCompetitivePricingForSKU: function () {
    return new ProductsRequest('GetCompetitivePricingForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true }
    });
  },

  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to uniquely
   * identify a product, and it does not return the SKUIdentifier element
   */
  GetCompetitivePricingForASIN: function () {
    return new ProductsRequest('GetCompetitivePricingForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },

  /**
   * Returns the lowest price offer listings for a specific product by item condition.
   */
  GetLowestOfferListingsForSKU: function () {
    return new ProductsRequest('GetLowestOfferListingsForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ItemCondition: { name: 'ItemCondition' },
      ExcludeMe: { name: 'ExcludeMe' },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true }
    });
  },

  /**
   * Same as above but by a list of ASIN's you provide
   */
  GetLowestOfferListingsForASIN: function () {
    return new ProductsRequest('GetLowestOfferListingsForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ItemCondition: { name: 'ItemCondition' },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },

  /**
   * Returns the product categories that a product belongs to,
   * including parent categories back to the root for the marketplace
   */
  GetProductCategoriesForSKU: function () {
    return new ProductsRequest('GetProductCategoriesForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKU: { name: 'SellerSKU', required: true }
    });
  },

  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to
   * uniquely identify a product.
   */
  GetProductCategoriesForASIN: function () {
    return new ProductsRequest('GetProductCategoriesForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASIN: { name: 'ASIN', required: true }
    });
  },

  /**
   * Returns pricing information for your own offer listings, based on ASIN.
   *
   */
  GetMyPriceForASIN: function () {
    return new ProductsRequest('GetMyPriceForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },

  /**
   * Returns pricing information for your own offer listings,
   * based on SellerSKU.
   */
  GetMyPriceForSKU: function () {
    return new ProductsRequest('GetMyPriceForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true }
    });
  },
};

/**
 * Parse XML result to clean JS Object
 * @type {Object}
 */
var result = exports.responses = {

  /**
   * Requests the operational status of the Products API section.
   */
  GetServiceStatus: function (xml) {
    return xml;
  },

  /**
   * Returns a list of products and their attributes, ordered by relevancy,
   * based on a search query that you specify
   */
  ListMatchingProducts: function (xml) {
    return xml;
  },

  /**
   * Returns a list of products and their attributes,
   * based on a list of ASIN values that you specify
   */
  GetMatchingProduct: function (xml) {
    return xml.GetMatchingProductResponse.GetMatchingProductResult.map(res => {
      let ret = Object.assign({}, res['$']);
      if (ret.status !== 'Success') {
        return ret;
      }
      ret.MarketplaceId = res.Product[0].Identifiers[0].MarketplaceASIN[0].MarketplaceId[0];
      let attr = res.Product[0].AttributeSets[0]['ns2:ItemAttributes'][0]
      return Object.assign(ret, {
        lang: attr['$']['xml:lang'],
        Binding: attr['ns2:Binding'][0],
        IsAutographed: attr['ns2:IsAutographed'][0],
        IsMemorabilia: attr['ns2:IsMemorabilia'][0],
        ListPrice: {
            Amount: attr['ns2:ListPrice'][0]['ns2:Amount'],
            CurrencyCode: attr['ns2:ListPrice'][0]['ns2:CurrencyCode']
        },
        Manufacturer: attr['ns2:Manufacturer'][0],
        ProductGroup: attr['ns2:ProductGroup'][0],
        ProductTypeName: attr['ns2:ProductTypeName'][0],
        Publisher: attr['ns2:Publisher'][0],
        SmallImage: attr['ns2:SmallImage'][0]['ns2:URL'][0].replace('._SL75_.', '.'),
        Studio: attr['ns2:Studio'][0],
        Title: attr['ns2:Title'][0],
        Color: attr['ns2:Color'] ? attr['ns2:Color'][0] : null,
        Department: attr['ns2:Department'] ? attr['ns2:Department'][0] : null,
        Size: attr['ns2:Size'] ? attr['ns2:Size'][0] : null,
      });
    });
  },

  /**
   * Returns a list of products and their attributes,
   * based on a list of specified ID values that you specify
   */
  GetMatchingProductForId: function (xml) {
    return xml;
  },

  /**
   * Returns the current competitive pricing of a product,
   * based on the SellerSKU and MarketplaceId that you specify
   */
  GetCompetitivePricingForSKU: function (xml) {
    return xml;
  },

  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to uniquely
   * identify a product, and it does not return the SKUIdentifier element
   */
  GetCompetitivePricingForASIN: function (xml) {
    return xml;
  },

  /**
   * Returns the lowest price offer listings for a specific product by item condition.
   */
  GetLowestOfferListingsForSKU: function (xml) {
    return xml;
  },

  /**
   * Same as above but by a list of ASIN's you provide
   */
  GetLowestOfferListingsForASIN: function (xml) {
    return xml;
  },

  /**
   * Returns the product categories that a product belongs to,
   * including parent categories back to the root for the marketplace
   */
  GetProductCategoriesForSKU: function (xml) {
    return xml;
  },

  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to
   * uniquely identify a product.
   */
  GetProductCategoriesForASIN: function (xml) {
    return xml;
  },

  /**
   * Returns pricing information for your own offer listings, based on ASIN.
   *
   */
  GetMyPriceForASIN: function (xml) {
    return xml.GetMyPriceForASINResponse.GetMyPriceForASINResult.map(res => {
      let ret = Object.assign({}, res['$']);
      if (ret.status !== 'Success') {
        return ret;
      }
      ret.MarketplaceId = res.Product[0].Identifiers[0].MarketplaceASIN[0].MarketplaceId[0];
      let offer = res.Product[0].Offers[0].Offer;
      if (!offer) {
        return ret;
      }
      offer = offer[0]
      return Object.assign(ret, {
        SellerId: offer.SellerId[0],
        SellerSKU: offer.SellerSKU[0],
        FulfillmentChannel: offer.FulfillmentChannel[0],
        ItemCondition: offer.ItemCondition[0],
        ItemSubCondition: offer.ItemSubCondition[0],
        CurrencyCode: offer.RegularPrice[0].CurrencyCode[0],
        LandedPrice: offer.BuyingPrice[0].LandedPrice[0].Amount[0],
        ListingPrice: offer.BuyingPrice[0].ListingPrice[0].Amount[0],
        Shipping: offer.BuyingPrice[0].Shipping[0].Amount[0],
        RegularPrice: offer.RegularPrice[0].Amount[0]
      });
    });
  },

  /**
   * Returns pricing information for your own offer listings,
   * based on SellerSKU.
   */
  GetMyPriceForSKU: function (xml) {
    return xml;
  },
};
