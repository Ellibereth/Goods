var React = require('react');
var ReactDOM = require('react-dom');
import HomeProductPreview from './HomeProductPreview'
import HomePageImageCarousel from './HomePageImageCarousel'

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
				"product_id_list" : product_id_list
			})
		$.ajax({
		  type: "POST",
		  url: "/getHomePageProducts",
		  data: form_data,
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
		var items_per_row = 4

		var col_size = 12 / items_per_row
		var ordered_products = this.orderProducts(this.state.products)
		var products = ordered_products.map((product, index) =>
				<HomeProductPreview col_size = {col_size} product = {product}/>
			)

		var product_rows = []

		var num_rows = Math.floor((products.length - 1) / items_per_row + 1)
		for (var i = 0; i < num_rows; i++){
			var this_row = []
			for (var j = i * items_per_row; j < items_per_row * (i+1); j++){
				if (j < products.length){
					this_row.push(products[j])
				}
				else {
					this_row.push(<div 
						className = {"home-page-filler-product col-md-" + col_size + " col-lg-" + col_size}/>)
				}
			}
			product_rows.push(
				<div className = "row row-eq-height product-preview-row">
					{this_row}
				</div>
			)
		}


		return (
			<div>
				<div className = "container-fluid home-container">
					<div className="row show-grid">
						<div className = "col-xs-12 col-md-12 col-sm-12 col-lg-12">
							<HomePageImageCarousel />
						</div>
					</div>
				</div>
				<div className = "home-large-buffer"/>

					
				<div className = "container-fluid home-product-preview-container">
					<div className = "container">
						{product_rows}
					</div>
				</div>
					
			</div>
			);
	}
}