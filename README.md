mws-sdk-promises
======

Originally forked from [ticadia/mws-sdk](https://github.com/ticadia/mws-sdk).

What is done:
-------------

 - It is uses [request](https://www.npmjs.com/package/request). it is more flexible and there is no eventEmitter syntax.

 - Promises to provide generic async support.

 - I've add some new requests from updated Amazone API.

 - I fix it with better set params ability... so it now looks niceier!!!


Use it. Contriburte it.

it can be seamlesly used in ES2015/2016 way using [babel.js](https://babeljs.io/).
with new javascript code features like `yield` or `async` `wait` to put some sugar on your code.

Examples
--------

Initialize

```javascript
var MWS = require('mws-sdk-promises'),
    client = new MWS.Client(
      'accessKeyId',
      'secretAccessKey',
      'merchantId',
      {
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
