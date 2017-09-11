pragma solidity ^0.4.6;

import './Ownable.sol';

contract Administrable is Ownable {

	mapping(address => bool) public admins;

	event LogNewAdmin(address address1);
	event LogRemovedAdmin(address address1);

	modifier isAdmin {
		require(admins[msg.sender] == true);
		_;
	}

	function Administrable(){
		admins[msg.sender] = true;
	}

	function getUserIsAdmin()
		public
		constant
		returns(bool isIndeed)
	{
		return admins[msg.sender];
	}

	function addAdmin(address newAdmin)
		onlyOwner
		public
		returns(bool success)
	{
		admins[newAdmin] = true;
		LogNewAdmin(newAdmin);
		return true;
	}

	function removeAdmin(address deleteAdmin)
		onlyOwner
		public
		returns(bool success)
	{
		require(deleteAdmin != owner); //owner cannot be removed from admins
		admins[deleteAdmin] = false;
		LogRemovedAdmin(deleteAdmin);
		return true;
	}
}