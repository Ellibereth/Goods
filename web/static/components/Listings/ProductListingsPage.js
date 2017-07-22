var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from '../Misc/PageContainer'
// import SearchProductPreview from './SearchProductPreview'
import HomeProductPreview from '../Home/HomeProductPreview'

export default class ProductListingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products : []
		}
	}

	componentDidMount(){
		this.loadProducts.bind(this)(this.props.params.tag)
	}

	loadProducts(tag){
		var form_data = JSON.stringify({
			tag : tag
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: "/getProductsByTag",
			success: function(data) {
				if (data.success) {
					this.setState({
						products: data.products,
					})
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
			<HomeProductPreview product = {product} index = {index}/>
		)

		if (this.props.params.tag) {
			var display_title = this.props.params.tag.split("_").join(" ")
		}
		else {
			var display_title = ""
		}
		
		

		return (
				<PageContainer>
					<div id = "search-container" className = "container-fluid">
						<div className = "container">
							<div className = "row search-result-amount-text">
								{display_title}
							</div> 
							<div className = "row">
								{products_display}
							</div>
						</div>
					</div>
				</PageContainer>
		);
	}
}