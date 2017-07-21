var React = require('react');
var ReactDOM = require('react-dom');
import HomeProductPreview from './HomeProductPreview'
import HomePageSingleImage from './HomePageSingleImage'
// this is hard coded for now
const product_id_list = [2,5,3,4, 1]
export default class HomePageMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products : [],
		}
	}

	componentDidMount(){
		this.fetchProductInformation.bind(this)()
	}


	fetchProductInformation(){
		var form_data = JSON.stringify({
			product_id_list : product_id_list
		})
		$.ajax({
		  type: "POST",
		  url: "/getBatchedProductInformation",
		  data: form_data,
		  success: function(data) {
			if (data.success){
				this.setState({products : data.products})
			}
		  }.bind(this),
		  error : function(){
			ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'getHomePageProducts',
					});
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		})
	}

	orderProducts(product_list) {
		var ordered_products = []
		product_list.map((product, index) => {
			if (product.inventory == 0) {
				ordered_products.push(product)
			}
			else {
				ordered_products.unshift(product)
			}
		})
		return ordered_products
	}
	
	render() {
		var ordered_products = this.orderProducts(this.state.products)
		var products = ordered_products.map((product, index) =>
				<HomeProductPreview product = {product}/>
			)

		return (
			<div>
				<div className = "container-fluid home-container">
					<div className="row show-grid">
						<div className = "col-xs-12 col-md-12 col-sm-12 col-lg-12">
							<HomePageSingleImage />
						</div>
					</div>
				</div>
				<div className = "small-buffer"/>
				<div className = "dark-grey-horizontal-line"/>
				<div className = "small-buffer"/>
				<div className ="container-fluid">
					<div className = "row">
						<span className = "home-product-group-header">
							New this week
						</span>
					</div>
					<div className = "small-buffer"/>
					<div className = "row">
						{products}	
					</div>
					<div className = "row">
						{products}
					</div>
				</div>
			</div>
			);
	}
}