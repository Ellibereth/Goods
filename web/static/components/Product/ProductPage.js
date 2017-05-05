var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import ProductTemplates from './ProductTemplates/ProductTemplates.js'
import TopNavBar from '../Misc/TopNavBar.js'
import Footer from '../Misc/Footer.js'




export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}





	render() {
		return (
				<div>
					<TopNavBar/>
					<ProductTemplates   
						product_id = {this.props.params.product_id}
					/>
					<Footer/>
				</div>
		);
	}
}