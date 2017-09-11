pragma solidity ^0.4.6;

import './PullPayment.sol';
import './Administrable.sol';
import './Stoppable.sol';

contract Storefront is Administrable, PullPayment, Stoppable {
	using SafeMath for uint256;

	struct Product {
		uint price;
		uint stock;
	}

	address public manager;
	uint[] public productIds;
	mapping(uint => Product) public products;

	event LogAddProduct(uint id, uint price, uint stock);
	event LogRemovedProduct(uint id, uint price, uint stock);
	event LogPurchase(address purchaser, uint id, uint price, uint quantity, uint stock);

	//constructor
	function Storefront(){
	}

	function getProductArrayLength()
		constant
		public
		returns(uint)
	{
		return productIds.length;
	}

	function getProduct(uint id)
		constant
		public
		returns(uint price, uint stock)
	{
		return(products[id].price, products[id].stock);
	}

	function addProduct(uint price, uint stock, uint id)
		//isAdmin
		public
		returns(bool success)
	{
		//require(products[id].price == 0);
		require(price > 0);
		require(stock >= 0);
		products[id] = Product(price, stock);
		productIds.push(id);
		LogAddProduct(id, price, stock);
		return true;
	}

	function purchaseProduct(uint id, uint quantity)
		public
		payable
		returns(bool success)
	{
		require(products[id].stock >= quantity);
		uint totalCost = products[id].price.mul(quantity);
		require(msg.value >= totalCost);

		uint amountToReturn = msg.value.sub(totalCost);
		PullPayment.asyncSend(this, totalCost); 

		products[id].stock -= quantity;
		msg.sender.transfer(amountToReturn); //return any overpayment
		LogPurchase(msg.sender, id, products[id].price, quantity, products[id].stock);
		return true;
	}

	// withdrawals covered by PullPayment.withdrawPayments()

	function removeProduct(uint id)
		public
		isAdmin
		returns(bool success)
	{
		// remove a product from the list
		require(products[id].price != 0 && products[id].stock != 0); // make sure the prodcut has been added
		uint stock = products[id].stock;
		uint price = products[id].price;
		products[id] = Product(0,0);  // set to the uninitialized state
		LogRemovedProduct(id, price, stock);
		return true;
	}

	function coPurchase()
		public
		//isConfirmed
		returns(bool success)
	{
		//purchase something with another person
		return true;
	}

}
