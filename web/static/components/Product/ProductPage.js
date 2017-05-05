var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import ProductTemplates from './ProductTemplates/ProductTemplates.js'

import PageContainer from '../Misc/PageContainer'



export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}





	render() {
		var component = <ProductTemplates product_id = {this.props.params.product_id}/>
		return (
				<PageContainer component ={component}/>
		);
	}
}