var React = require('react');
var ReactDOM = require('react-dom');
import HomeProductPreview from './HomeProductPreview'
import HomePageImageCarousel from './HomePageImageCarousel'
import HomePageSingleImage from './HomePageSingleImage'

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
		$.ajax({
		  type: "POST",
		  url: "/getHomePageProducts",
		  success: function(data) {
			if (!data.success){
			}
			else {
				this.setState({products : data.products})
			}
		  }.bind(this),
		  error : function(){
			ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'getHomePageProducts',
						eventLabel: AppStore.getCurrentUser().email
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
		// for now these are hard coded preview products
		
		// make sure this is divides 12
		var items_per_row = 3

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
				<div className = "home-large-buffer"/>

					
				<div className = "container-fluid home-product-preview-container">
					<div className = "container">
						<div className = "row product-preview-row">
							{products}
						</div>
					</div>
				</div>
					
			</div>
			);
	}
}