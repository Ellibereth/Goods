var React = require('react');
var ReactDOM = require('react-dom');

import PageContainer from '../Misc/PageContainer'
import ProductMainContainer from './ProductMainContainer'


export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {



		return (
				<PageContainer>
					<ProductMainContainer product_id = {this.props.params.product_id} />
				</PageContainer>
		);
	}
}
