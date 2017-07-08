var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory;
import {formatPrice} from '../Input/Util'


export default class ProductPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount () {
		var product = this.props.product
		var product_object = {
			'id': product.product_id, 
			'name': product.name,
			'brand' : product.manufacturer,
			'list': 'Home',
		}
		ga('ec:addImpression', product_object);
		
	}

	itemInStock(product){
		if (!product.has_variants) {
			if (product.inventory > 0){
				return true
			}
			else {
				return false
			}
		}
		else {
			return true
		}
		
	}

	productClicked(event) {
		event.preventDefault()
		var product = this.props.product
		ga('ec:addProduct', {
			'id': product.product_id, 
			'name': product.name,
			'brand' : product.manufacturer,
			'list': 'Home',
			'price' : product.price
		});
		ga('ec:setAction', 'click', {list: 'Home'});
		ga('send', 'event', 'UX', 'click', 'HomeProduct')
		window.location = '/eg/' + product.product_id;
		return true
	}

	getPriceRow(item_in_stock) {
		if(item_in_stock){
			if (this.props.product.sale_price) {
				return (
					<span>
						<span className = "home-product-preview-sale-price-text" >${formatPrice(this.props.product.sale_price)}</span>
						<span className = "home-product-preview-price with-sale">${formatPrice(this.props.product.price)} </span> 
					</span>
				)
			}

			else {
				return (
					<span className = "home-product-preview-price"> ${formatPrice(this.props.product.price)} </span> 
				)	
			}
			
		}
		else  {
			return (
				<span>
					<span className = "dark-blue-line-through"> <span className = "home-product-preview-price">${formatPrice(this.props.product.price)} </span> </span>
					<span className = "home-product-preview-sold-out-text" >{" Sold Out!"}</span>
				</span>
			)
		}
						
							
	}


	render() {

		var date = this.props.product.sale_end_date
		var item_in_stock = this.itemInStock(this.props.product)
		var price_row = this.getPriceRow(item_in_stock)
		// if (this.state.invalid_product) return <div id = {this.props.product.product_id}/>
		return (
			<div className = {"col-md-6  col-lg-3  col-sm-6 col-xs-12 col-sm-offset-0 col-xs-offset-0"}>

			<div 
			id = {this.props.product.product_id} 
			// onClick = {this.goToProduct.bind(this)}
			className = {"home-product-preview"}
			>
				<a className = "no-underline" onClick = {this.productClicked.bind(this)} href = {'/eg/' + this.props.product.product_id} style = {{"width" : "100%", "height" : "100%"}} href = {"/eg/" + this.props.product.product_id}>
					<div className = "row home-product-preview-image-row">
						{
							this.props.product.images.length == 0 ? 
							<div> No Image For This Product </div>
								:
								<img 
								src = {"https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" 
								+ this.props.product.main_image}
								className = "img-responsive img-rounded center-block home-product-preview-image"/>
						}
					</div>
					<div className = "row home-product-preview-details text-center">
							
						{price_row}
						<br/>
						<span className = "home-product-preview-name"> {this.props.product.name} </span> <br/>
						
						<span className = "home-product-preview-manufacturer"> By {this.props.product.manufacturer} </span> <br/>
					</div>
				</a>
			</div>
			</div>
		);
	}
}