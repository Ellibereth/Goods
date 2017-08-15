var React = require('react');
var ReactDOM = require('react-dom');

import HomePageMainContainer from './HomePageMainContainer.js'
import PageContainer from '../Misc/PageContainer'
import HomePageContainerMobile from './HomePageContainerMobile'


const HOME_TAG = "Home_Page"

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products : [],
		}
	}

	loadProducts(tag){
		var form_data = JSON.stringify({
			tag : tag
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: "/getProductsByListingTag",
			success: function(data) {
				if (data.success) {
					this.setState({
						products: data.products,
						is_loading: false
					})
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}

	componentDidMount() {
		this.loadProducts.bind(this)(HOME_TAG)
	}


	render() {
		return (
				<PageContainer no_add_buffer = {true}>
					<HomePageContainerMobile products = {this.state.products}/>
					<HomePageMainContainer products = {this.state.products} />
				</PageContainer>
		);
	}
}