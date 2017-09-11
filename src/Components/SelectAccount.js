import React  from 'react'

class SelectAccount extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			newAccount: null
		}
		this.handleChange = this.handleChange.bind(this);
	}

	getAccounts(){
		var accounts = this.props.accounts.map(function(account){
			return(
				<option key={account}>{account}</option>
				);
		});
		return accounts;
	}

	handleChange(event){
		this.state.newAccount = event.target.value
		this.props.setAccount(this.state.newAccount);
	}

	render(){
		var accounts;

		if(this.props.accounts){
			accounts = this.getAccounts();
		}

		return (
			<div>
				<div>Change user account:</div>
				<select id="newAccountInput" onChange={this.handleChange}>
					{accounts}
				</select>
			</div>
		);
	}

}

export default SelectAccount