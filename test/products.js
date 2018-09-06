/**
 * Various ways to run the test from CLI:
 *   npm test
 *   NODE_DEBUG=request npm test
 *   NODE_ENV=development npm test
 *   NODE_ENV=development NODE_DEBUG=request npm test
 */

var MWS = require('../');
var env = process.env;

const chai = require('chai');
const expect = chai.expect;

global.Promise = require('bluebird');

describe('Products', function() {
  var MarketPlaceId = env.MarketPlaceId;

  var client;
  it('should set up client', function() {
    expect(env.AccessKey).to.exist;
    expect(env.SecretKey).to.exist;
    expect(env.MerchantId).to.exist;
    expect(env.MarketPlaceId).to.exist;

    expect(env.AccessKey).to.be.a('string');
    expect(env.SecretKey).to.be.a('string');
    expect(env.MerchantId).to.be.a('string');
    expect(env.MarketPlaceId).to.be.a('string');

    console.log(env.AccessKey + '\n' +
      env.SecretKey + '\n' +
      env.MerchantId + '\n' +
      env.MarketPlaceId);

    client = new MWS.Client(env.AccessKey, env.SecretKey, env.MerchantId, {
      host: MWS.Endpoint.in
    });
  });

  it('list matching product', function (done) {
    var listMatchingProducts = MWS.Products.requests.ListMatchingProducts({ "marketplaceId": MarketPlaceId });
    console.log('listMatchingProducts:', listMatchingProducts);
    listMatchingProducts.params.MarketplaceId.value = MarketPlaceId;
    listMatchingProducts.params.Query.value = "shoe leather casual";
    client.invoke(listMatchingProducts)
      .then(function (resp) {
        //console.log(resp);
        console.log(JSON.stringify(arguments,null,2));
        var products = resp.ListMatchingProductsResponse.ListMatchingProductsResult[0].Products[0].Product;
        console.log('products.length:' , products.length);
        done();
      });
  });

});
