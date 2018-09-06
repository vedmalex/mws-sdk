imws
======

Originally forked from [vedmalex/mws-sdk](https://github.com/vedmalex/mws-sdk).

Why forked?
-------------
The response object made by `xml2js` is
 - So looooooong
 - Un-clean `~~~~`
 - Hard to track ...00.aa444
 - Tired to access =>.=>.=>.=>

What is done:
-------------

 - I fix it with better response format!!!


Installation
--------
```
$ npm i -S imws
```

Examples
--------

Initialize

```javascript
var MWS = require('imws'),
    client = new MWS.Client(
      'accessKeyId',
      'secretAccessKey',
      'merchantId',
      {
        // target mws host. Default: 'mws.amazonservices.com'
        host: MWS.Endpoint.jp,
        // Optional Auth Token when using delegated Developer access.
        authToken: 'amzn.mws...',
        // request options (https://github.com/request/request#requestoptions-callback)
        requestOpts: {
          proxy: 'http://PROXY_HOST:PROXY_PORT',
          encoding: null
        }
      }
    ),
    MarketplaceId = "ATVPDKIKX0DER";
```

now you can use it

```javascript
function getListOrders(client, args) {
  var req = MWS.Orders.requests.ListOrders();
  req.set('CreatedAfter', args.CreatedAfter);
  req.set('CreatedBefore', args.CreatedBefore);
  req.set('LastUpdatedAfter', args.LastUpdatedAfter);
  req.set('MarketplaceId', args.MarketplaceId);
  req.set('LastUpdatedBefore', args.LastUpdatedBefore);
  req.set('OrderStatus', args.OrderStatus);
  req.set('FulfillmentChannel', args.FulfillmentChannel);
  req.set('PaymentMethod', args.PaymentMethod);
  req.set('BuyerEmail', args.BuyerEmail);
  req.set('SellerOrderId', args.SellerOrderId);
  req.set('MaxResultsPerPage', args.MaxResultsPerPage);
  return client.invoke(req);
}
// or you can do like this
function getListOrders(client, args) {
  var req = MWS.Orders.requests.ListOrders();
  req.set(args);
  return client.invoke(req);
}

```

Use it.

```javascript
var date = new Date();
getListOrders(client, {
  MarketplaceId: MarketplaceId,
  MaxResultsPerPage: 10,
  CreatedAfter: new Date(2015, 1, 1),
  CreatedBefore: new Date(2015, 1, 31)
})
// convert to clean JS Object
.then(MWS.Orders.responses.ListOrders)
.catch(function(error) {
  console.error(error);
})
.then(function(RESULT){
  console.log("--------");
  console.log(JSON.stringify(RESULT));
  console.log("--------");
});
```

Tests
-----

1. Fill in the values for `env.sh` and run tests:

  ```
  cd cloneOfThisProject
  . ./env.sh
  npm test
  ```
2. To see more logs while running tests, choose from:

  ```
  NODE_DEBUG=request npm test
  NODE_ENV=development npm test
  NODE_ENV=development NODE_DEBUG=request npm test
  ```

License: MIT
