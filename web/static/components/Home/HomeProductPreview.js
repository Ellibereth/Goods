var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory;
import {formatPrice} from '../Input/Util'


export default class HomeProductPreview extends React.Component {
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
			return (product.inventory > 0)
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
		var product = this.props.product
		if (product.sale_text_home) {
			return (
				<div>
					<span className = "home-product-preview-current-price" >${formatPrice(this.props.product.sale_price)}</span>
					<span className = "home-product-preview-price"
					dangerouslySetInnerHTML = {{__html : product.sale_text_home}}
					></span> 
				</div>
			)
		}

		else {
			if (product.inventory == 0) {
				return (
					<div>
						<span className = "home-product-preview-current-price"> Sold Out  </span>
						<span 
						style = {{"fontWeight": "normal"}}
						className = "home-product-preview-current-price"> <s>${formatPrice(this.props.product.price)} </s></span>
					</div> 
				)	
			}
			else {
				return (
					<div className = "home-product-preview-current-price"> ${formatPrice(this.props.product.price)} </div> 
				)	
			}
		}

	}


	render() {

		// var date = this.props.product.sale_end_date
		var item_in_stock = this.itemInStock(this.props.product)
		var price_row = this.getPriceRow(item_in_stock)
		// if (this.state.invalid_product) return <div id = {this.props.product.product_id}/>
		return (
			<div className = "home-product-preview">

				<a className = "no-underline" onClick = {this.productClicked.bind(this)} href = {'/eg/' + this.props.product.product_id} style = {{"width" : "100%", "height" : "100%"}} href = {"/eg/" + this.props.product.product_id}>
						{
							this.props.product.images.length == 0 ? 
							<div> No Image For This Product </div>
								:
								<img 
								src = {"https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" 
								+ this.props.product.main_image}
								className = "img-responsive home-product-preview-image"/>
						}
				</a>
				<div className = "home-product-preview-details">		
					<div onClick = {this.productClicked.bind(this)} className = "home-product-preview-name"> {this.props.product.name} </div> 
					<div className = "home-product-preview-manufacturer">{" by "}
						 <span onClick = {() => window.location = "/search/" + this.props.product.manufacturer} 
							className = "home-product-preview-manufacturer-name">
							{this.props.product.manufacturer}
						</span>
					</div> 
					{price_row}
				</div>
			</div>
		);
	}
}