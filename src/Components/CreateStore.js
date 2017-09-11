import React  from 'react'

class CreateStore extends React.Component {


	render(){

		return (
			<div>
				<button onClick={this.props.createStore}>Create A New Store</button>
			</div>
		);
	}

}

export default CreateStore