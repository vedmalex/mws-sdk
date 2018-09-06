var assert = require('assert');
var MWS = require('../');
var env = process.env;

describe('Orders', function() {
  var MarketPlaceId = MWS.MarketplaceId.us;
  var client;
  it('should set up client', function() {
    client = new MWS.Client(env.AccessKey, env.SecretKey, env.MerchantId, {});
  });


  it('list orders command', function (done) {
    var listOrders = MWS.Orders.requests.ListOrders({ "marketplaceId": MarketPlaceId });
    listOrders.params.MarketplaceId.value = MarketPlaceId;
    listOrders.params.CreatedAfter.value = "2015-01-01";
    client.invoke(listOrders, function (resp) {
      var orders = resp.ListOrdersResponse.ListOrdersResult[0].Orders[0].Order
      console.log(orders.length);
      done();
    });
  });

  it('get single order', function(done){
    var getOrder = MWS.Orders.requests.GetOrder();
    console.log(getOrder);
    // 000-0000000-0000000
    getOrder.params.AmazonOrderId.value = '112-8444240-5137016';
    client.invoke(getOrder, function (resp) {
      var order = resp.GetOrderResponse.GetOrderResult[0].Orders[0].Order;
      console.log(JSON.stringify(order));
      done();
    });
  });

});
