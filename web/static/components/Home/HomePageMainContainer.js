var React = require('react');
var ReactDOM = require('react-dom');
import HomeProductPreview from './HomeProductPreview'
import HomePageSingleImage from './HomePageSingleImage'



export default class HomePageMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){

	}

	


	orderProducts(product_list) {
		var ordered_products = []
		product_list.map((product, index) => {
			if (product.is_available) {
				ordered_products.unshift(product)
			}
			else {
				ordered_products.push(product)
			}

		})
		return ordered_products
	}
	
	render() {
		var ordered_products = this.orderProducts(this.props.products)
		var products = ordered_products.map((product, index) =>
				<HomeProductPreview product = {product}/>
			)

		return (
			<div className = "hidden-xs">
				<div className = "home-container">
					<HomePageSingleImage />
				</div>
				<div className = "small-buffer"/>
				<div className = "dark-grey-horizontal-line"/>
				<div className = "small-buffer"/>
				<div style = {{"marginBottom" : "-10px"}} className ="container-fluid">
					<div className = "row home-product-group-header-row">
						<span className = "home-product-group-header">
							Featured
						</span>
					</div>
					<div className = "small-buffer"/>
					<div className = "row">
						{products}	
					</div>
				</div>
			</div>
			);
	}
}