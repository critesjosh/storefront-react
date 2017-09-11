pragma solidity ^0.4.6;

import './Storefront.sol';

contract Hub is Stoppable {

	address[] public stores;
	mapping(address => bool) public storeExists;

	modifier onlyIfStore(address store) {
		require(storeExists[store] == true);
		_;
	}

	event LogNewStorefront(address storefrontAddress, address storefrontCreator);
	event LogStorefrontClosed(address sender, address storefrontAddress);
	event LogStorefrontOpen(address sender, address storefrontAddress);
	event LogStoreOwnerChanged(address sender, address storefront, address newOwner);

	function getStoreCount()
		public
		constant
		returns(uint storeCount)
	{
		return stores.length;
	}

	function createStore()
		public
		returns(address storefrontContract)
	{
		Storefront trustedStorefront = new Storefront();
		stores.push(trustedStorefront);
		storeExists[trustedStorefront] = true;
		LogNewStorefront(trustedStorefront, msg.sender);
		return trustedStorefront;
	}

	// pass through admin controls

	function closeStore(address storefrontAddress)
		onlyOwner
		onlyIfStore(storefrontAddress)
		returns(bool success)
	{
		Storefront trustedStorefront = Storefront(storefrontAddress);
		LogStorefrontClosed(msg.sender, trustedStorefront);
		return (trustedStorefront.runSwitch(false));
	}

	function openStore(address storefrontAddress)
		onlyOwner
		onlyIfStore(storefrontAddress)
		returns(bool success)
	{
		Storefront trustedStorefront = Storefront(storefrontAddress);
		LogStorefrontOpen(msg.sender, trustedStorefront);
		return (trustedStorefront.runSwitch(true));
	}

	function changeStoreOwner(address storefrontAddress, address newOwner)
		onlyOwner
		onlyIfStore(storefrontAddress)
		returns(bool success)
	{
		Storefront trustedStorefront = Storefront(storefrontAddress);
		LogStoreOwnerChanged(msg.sender, trustedStorefront, newOwner);
		return(trustedStorefront.transferOwnership(newOwner));
	}

}