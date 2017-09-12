import React, { Component } from 'react'
import HubContract from '../build/contracts/Hub.json'
import StorefrontContract from '../build/contracts/Storefront.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import AccountInfo from './Components/AccountInfo.js'
import SelectAccount from './Components/SelectAccount.js'
import CreateStore from './Components/CreateStore.js'
import ShowStores from './Components/ShowStores.js'
import CurrentStore from './Components/CurrentStore.js'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      accounts: null,
      account: null,
      balance: null,
      stores: [],
      products: [],
      currentStore: null,
      currentStoreProducts: [],
      StorefrontABI: null,
      hub: null
    }

    this.setAccount = this.setAccount.bind(this)
    this.createStore = this.createStore.bind(this)
    this.setStore = this.setStore.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const Hub = contract(HubContract)
    this.state.StorefrontABI = contract(StorefrontContract)
    Hub.setProvider(this.state.web3.currentProvider)
    this.state.StorefrontABI.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on hub.
    var hub

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      Hub.deployed().then((instance) => {
        hub = instance

        this.setState({
          accounts: accounts,
          account: accounts[0],
          hub: instance,
        })

        this.watchStores()
       // this.watchProducts()

        return this.state.web3.eth.getBalance(accounts[0]);
      }).then((balance) => {
        this.setState({
          balance: balance.toString(10)
        })
        return hub.getStoreCount.call()
      })

    })
  }

  setAccount(account){
    this.state.web3.eth.getBalance(account, (error, balance) => {
      if(error == null) {
        this.setState({
          account: account,
          balance: balance.toString(10)
        });
      }
    });
  }

  setStore(address){
    var store = this.state.StorefrontABI.at(address)
    this.setState({
      currentStore: store
    })
    this.watchProducts(store)
    this.getProducts(store)
  }

  watchStores(){
    var updateEvent = this.state.hub.LogNewStorefront({}, {fromBlock: 0})
    updateEvent.watch((error, result) => {
      if(error) {
        console.log(error);
        return;
      } else {
        var address = result.args.storefrontAddress
        var stores = this.state.stores
        stores.push(address)
        this.setState({
          stores: stores
        });
      }
    });
  }

  watchProducts(store){
        store.LogAddProduct({}, {fromBlock: 0})
        .watch((error, result) => {
          if(error) {
            console.log(error);
            return
          } else {
            console.log('Product added', result)
            var product = {}
            product.id = result.args.id
            product.price = result.args.price
            product.quantity = result.args.quantity
            product.store = store.address
            var products = this.state.products
            products.push(product) 
            this.setState({
              products: products
            })
          }
        })
  }

  getProducts(store){
    var products
    store.getProductArrayLength.call()
    .then(length => {
      length = parseInt(length.toString(10))
      for(let i = 0; i < length; i++){
        store.productIds.call(i)
        .then(id => {
          id = parseInt(id.toString(10))
          store.getProduct.call(id)
          .then(results => {
            var product = {}
            var products = this.state.products
            product.id = id
            product.price = results[0].toString(10)
            product.quantity = results[1].toString(10)
            products.push(product)
            this.setState({
              currentStoreProducts:products
            })
          })
        })
      }
    })
  }

  createStore(){
    this.state.hub.createStore({from: this.state.account, gas:900000})
   // this.watchProducts()
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">React Storefront</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <AccountInfo 
                account={this.state.account} 
                balance={this.state.balance} />
              <SelectAccount 
                accounts={this.state.accounts}
                web3={this.state.web3} 
                setAccount={this.setAccount}/>
              <CreateStore
                createStore={this.createStore}
                /> 
              <ShowStores
                stores={this.state.stores}
                setStore={this.setStore}
                />
             {/*} <CurrentStore
                store={this.state.currentStore}
                currentAccount={this.state.account}
                products={this.state.currentStoreProducts}
                /> */}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
