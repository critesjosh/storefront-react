import React  from 'react'

class CurrentStore extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			products: [],
			price: null,
			quantity: null
		}

		this.handleChange = this.handleChange.bind(this)
		this.setPrice = this.setPrice.bind(this)
		this.setQuantity =this.setQuantity.bind(this)
		this.addProduct = this.addProduct.bind(this)
	}

	handleChange(event){
	}

	// getProducts(){
	// 	var products
	// 	this.props.store.getProductArrayLength.call()
	// 	.then(length => {
	// 		length = parseInt(length.toString(10))
	// 		console.log('length', length)
	// 		for(let i = 0; i < length; i++){
	// 			this.props.store.productIds.call(i)
	// 			.then(id => {
	// 				id = parseInt(id.toString(10))
	// 				this.props.store.getProduct.call(id)
	// 				.then(results => {
	// 					var product = {}
	// 					var products = this.state.products
	// 					product.id = id
	// 					product.price = results[0].toString(10)
	// 					product.quantity = results[1].toString(10)
	// 					products.push(product)
	// 					this.setState({
	// 						products:products
	// 					})
	// 				})
	// 			})
	// 		}
	// 	})
	// }

	setPrice(event){
		this.state.price = parseInt(event.target.value)
	}
	setQuantity(event){
		this.state.quantity = parseInt(event.target.value)
	}

	addProduct(){
		var id = Date.now()
		this.props.store.addProduct(this.state.price, this.state.quantity, id, {from: this.props.currentAccount, gas: 900000})
		this.setState({
			price: null,
			quantity: null
		})
	}


	render(){

		if(this.props.store){
			var store = this.props.store.address
			var products = this.props.products.map(function(element){
				return(
					<div key={element.id}> 
						Product id: {element.id}, price: {element.price}, quantity: {element.quantity}
					</div>
					)
			})

			return (
					<div>
						<div>Current Store address: {this.props.store.address}</div>
						<input type="text" placeholder="Price (in wei)" value={this.state.price} onChange={this.setPrice}/>
						<input type="text" placeholder="Quantity" value={this.state.quantity} onChange={this.setQuantity}/>
						<button onClick={this.addProduct}>Add a product</button>
						<div>
							Products: {products}
						</div>
					</div>
				);
		} else {
			return null
		}


	}

}

export default CurrentStore