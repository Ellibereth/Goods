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


	render() {

		var date = this.props.product.sale_end_date
		var item_in_stock = this.itemInStock(this.props.product)
		// if (this.state.invalid_product) return <div id = {this.props.product.product_id}/>
		var col_size = this.props.col_size
		return (

			<div 
			id = {this.props.product.product_id} 
			// onClick = {this.goToProduct.bind(this)}
			className = {"home-product-preview col-md-" + col_size + " col-lg-" + col_size}
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
					<div className = "row home-product-preview-details">
							
						{item_in_stock ? 
							<span className = "home-product-preview-price"> ${formatPrice(this.props.product.price)} </span> 
							:
							<span className = "home-product-preview-price">
								<s>${formatPrice(this.props.product.price)} </s> 
								<span className = "home-product-sold-out-textw" >{" Sold Out!"}</span>
							</span>
						}
							<br/>
							<span className = "home-product-preview-name"> {this.props.product.name} </span> <br/>
							
							<span className = "home-product-preview-manufacturer"> By {this.props.product.manufacturer} </span> <br/>
					</div>
				</a>
			</div>
		);
	}
}