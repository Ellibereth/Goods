var React = require('react')
var ReactDOM = require('react-dom')

var browserHistory = require('react-router').browserHistory
import {formatPrice} from '../Input/Util'

export default class HomeProductPreview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			countdown_time : null,
		}
		this.countdown_interval = setInterval(this.updateCountdown.bind(this), 1000)	
	}

	componentDidMount () {
		var product = this.props.product
		var product_object = {
			'id': product.product_id, 
			'name': product.name,
			'brand' : product.manufacturer.name,
			'list': 'Home',
		}
		ga('ec:addImpression', product_object)
		
	}

	updateCountdown() {
		if (this.props.product){
			if (this.props.product.sale_end_date){

				// Get todays date and time
				var now = new Date()

				// Find the distance between now an the count down date
				var string = this.props.product.sale_end_date
				var sale_end_date = new Date(string)
			  	var distance = sale_end_date - now
			  	// Time calculations for days, hours, minutes and seconds
			  	var days = Math.floor(distance / (1000 * 60 * 60 * 24))
			  	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			  	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			  	var seconds = Math.floor((distance % (1000 * 60)) / 1000)
			  	if (days == 0){
			  		// Display the result in the element with id="demo"
				  	var countdown_time = hours + 'h '
				  		+ minutes + 'm ' + seconds + 's '
				  	this.setState({countdown_time : countdown_time})
					// If the count down is finished, write some text 
					if (distance < 0) {
				    	clearInterval(this.countdown_interval)
				    	this.setState({countdown_time : 'EXPIRED'})
				  	}
			  	}
			  	
			}
		}
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
			'brand' : product.manufacturer.name,
			'list': 'Home',
			'price' : product.price
		})
		ga('ec:setAction', 'click', {list: 'Home'})
		ga('send', 'event', 'UX', 'click', 'HomeProduct')
		window.location = '/eg/' + product.product_id
		return true
	}

	getPriceRow(item_in_stock) {
		var product = this.props.product
		if (product.sale_text_home) {
			return (
				<div>
					<span className = "home-product-preview-current-price" >${formatPrice(this.props.product.price)}</span>
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
							style = {{'fontWeight': 'normal'}}
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

				<a className = "no-underline" onClick = {this.productClicked.bind(this)} href = {'/eg/' + this.props.product.product_id} style = {{'width' : '100%', 'height' : '100%'}} href = {'/eg/' + this.props.product.product_id}>
					{
						this.props.product.images.length == 0 ? 
							<div> No Image For This Product </div>
							:
							<img 
								alt = {this.props.product.product_id}
								src = {'https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/' 
								+ this.props.product.main_image}
								className = "img-responsive home-product-preview-image"/>
					}
				</a>
				<div className = "home-product-preview-details">		
					<div onClick = {this.productClicked.bind(this)} className = "home-product-preview-name"> {this.props.product.name} </div> 
					<div className = "home-product-preview-manufacturer">{' by '}
						 <span onClick = {() => window.location = '/search/' + this.props.product.manufacturer.name} 
							className = "home-product-preview-manufacturer-name">
							{this.props.product.manufacturer.name}
						</span>
					</div> 
					{price_row}
					{this.state.countdown_time && 
						<div
							className = "home-product-preview-manufacturer-name">
							{this.state.countdown_time}
						</div>
					}
				</div>
			</div>
		)
	}
}