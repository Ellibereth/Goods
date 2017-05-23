var React = require('react');
var ReactDOM = require('react-dom');

import {} from 'react-bootstrap';
import PageContainer from '../Misc/PageContainer'
import SearchProductPreview from './SearchProductPreview'


export default class SearchPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products : [],
			num_results:  0
		}
	}
	componentDidMount(){
		this.loadProducts.bind(this)(this.props.params.search_input)
	}

	componentWilReceiveProps(nextProps){
		this.loadProducts.bind(this)(nextProps.search_input)
	}

	loadProducts(search_input){
		var form_data = JSON.stringify({
			'search_input' : search_input
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: "/searchProducts",
			success: function(data) {
				if (data.success) {
					this.setState({
						products: data.products,
						num_results : data.products.length
					})
				}
				else {
					swal("nice try!")
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}

	render() {
		var products = this.state.products
		if (!products) return <PageContainer component = {<div/>}/>
		var products_display = products.map((product, index)=>
			<SearchProductPreview product = {product} index = {index}/>
		)
		
		var component = (
				<div id = "search-container" className = "container-fluid">
					<div className = "container">
						<div className = "row search-result-amount-text">
							Showing {this.state.num_results} results for {this.props.params.search_input}
						</div>
						{products_display}
					</div>
				</div>
			)

		return (
				<PageContainer component = {component}/>
		);
	}
}