import React  from 'react'

class ShowStores extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			store: null
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event){
		this.state.store = event.target.value
		this.props.setStore(this.state.store);
	}

	getStores(){
		var stores = this.props.stores.map(function(store){
			return(
				<option key={store}>{store}</option>
				);
		});
		return stores;
	}


	render(){

		var stores = this.getStores()

		return (
			<div>
				<div>Change Store:</div>
				<select onChange={this.handleChange}>
					{stores}
				</select>
			</div>
		);
	}

}

export default ShowStores