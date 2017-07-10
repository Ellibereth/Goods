var React = require('react');
var ReactDOM = require('react-dom');
import ProductTemplates from './ProductTemplates/ProductTemplates'
import StoryTemplates from './StoryTemplates/StoryTemplates'

import PageContainer from '../Misc/PageContainer'
import Spinner from '../Misc/Spinner'
import ProductMainContainer from './ProductMainContainer'
import Navbar from '../Nav/Navbar'
import Footer from '../Nav/Footer'


export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {
		var component = <ProductMainContainer product_id = {this.props.params.product_id} />



		return (
				<PageContainer component ={component}/>
		);
	}
}
