var Hub = artifacts.require("./Hub.sol");
var Storefront = artifacts.require("./Storefront");

web3.eth.getTransactionReceiptMined = require("./getTransactionReceiptMined.js");

contract('Hub', function(accounts) {

  //beforeEach()


  it("should deploy a storefront", function() {
    var hub;
    var storefrontAddress;
    var address = accounts[0];

    return Hub.deployed().then(function(instance) {
      hub = instance;
      return hub.createStore();
    })
    .then(function(result){
      storefrontAddress = result.logs[0].args.storefrontAddress;
      return hub.getStoreCount.call();
    })
    .then(function(count) {
      assert.equal(count.valueOf(), 1, "store count is not equal to 1");
      return hub.storeExists.call(storefrontAddress);
    })
    .then(function(exists){
      assert.equal(exists, true, "store should exist at given address");
    });
  });

  it("should allow products to be added to a storefront", function(){ 
    var hub;
    var storefrontAddress;
    var storefrontCreator;
    var store;

    var address = accounts[0];

    var price = 12;
    var stock = 13;
    var id = 14;

    return Hub.deployed().then(function(instance) {
      hub = instance;
      return hub.createStore();
    })
    .then(function(result){
      storefrontAddress = result.logs[0].args.storefrontAddress;
      storefrontCreator = result.logs[0].args.storefrontCreator;
      store = Storefront.at(storefrontAddress);
      return store.addProduct(14,12,13, {from: storefrontCreator});
    })
    .then(function(txn){
      return web3.eth.getTransactionReceiptMined(txn.receipt.transactionHash);
    })
    .then(function(result){
      return store.getProductCount.call();
    })
    .then(function(length){
      assert.equal(length.valueOf(), 1, "one product was not added to the count");
      return store.productIds.call(0);
    })
    .then(function(id){
      return store.getProduct.call(id);
    })
    .then(function(result){
      var _price = result[0];
      var _stock = result[1];
      assert.equal(_price.valueOf(), price, "prices do not match");
      assert.equal(_stock.valueOf(), stock, "stock numbers do not match");
    });
  });

  it("should allow products to be purchased from a storefront", function(){
    var hub;
    var storefrontAddress;

  });

});