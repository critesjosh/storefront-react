import React from 'react'

function AccountInfo(props){
	return (
		<div>
			<p>Account: {props.account}, current balance: {props.balance}</p>
		</div>
		);
}

export default AccountInfo