var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {Button} from 'react-bootstrap';
import ProductImages from '../../ProductImages'
import AppStore from '../../../../stores/AppStore'
import AddToCartButton from '../../ProductPayment/AddToCartButton.js'
import styles from './product_styles.css'



export default class ProductTemplate1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image : null,
			items : [],
			price : null,
			cart_item : [],
			is_loading : true,
			more_information_open : false
		}


		
		// Ben's unit test :P
		// var test_prices = [1.00, 2.12, 3.123, 0.1, 0, 1]

		// test_prices.map((price) => console.log(this.formatPrice(price)))
	}


	startLoading(){
		$('#product-page-container').addClass("faded")
	}

	endLoading(){
		$('#product-page-container').removeClass("faded");
	}

	getMainImageId(product) {
		if (product == null || product.product_id == null) return null;
		if (product.images.length == 0) return null
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		if (!product.main_image) {
			var main_image_id = product.images[0].image_id
		}
		else {
			var main_image_id = product.main_image
		}
		return main_image_id
	}

	componentDidMount(){
		this.refreshUserInformation.bind(this)()
		this.setState({selected_image : this.getMainImageId(this.props.product)})
	}

	selectImage(image_id){
		this.setState({selected_image : image_id})
	}

	componentWillReceiveProps(nextProps){
		this.setState({selected_image : this.getMainImageId(nextProps.product)})
	}

	refreshUserInformation() {
		if (!AppStore.getCurrentUser()){
			return
		}
		// this.setState({is_loading : true})
		$('#product-page-container').addClass("faded");
			var form_data = JSON.stringify({
			"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/getUserInfo",
				data: form_data,
				success: function(data) {
					if (data.success) {
						this.setState({
							items: data.user.cart.items, 
							price : data.user.cart.price,
						})
						for (var i = 0; i < data.user.cart.items.length; i++){
							if (data.user.cart.items[i].product_id == this.props.product.product_id){
								this.setState({cart_item : data.user.cart.items[i]})
							}
						}		
					}
					else {
						console.log("an error")
					}
				$('#product-page-container').removeClass("faded");
				this.setState({is_loading : false})
				}.bind(this),
				error : function(){
					console.log("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}


	// input is float 
	formatPrice(price){
		if (!price) {
			if (price == 0) {
				return "0.00"
			}
			else {
				return ""	
			}
		}
		var decimal_splits = price.toString().split('.')
		var dollars = decimal_splits[0]
		var cents = decimal_splits[1]
		if (!cents){
			cents = "00"
		}
		else if (cents.length == 1) {
			cents = cents + "0"
		}

		cents = cents.substring(0,2)
		return dollars + "." + cents

	}


	render() {
		// keep in mind for the fade on loading
		// this wasn't working last I checked
		if (this.props.is_loading){
			this.startLoading()
		}
		else {	
			this.endLoading()
		}


		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		if (this.props.is_loading){
			return <div/>
		}
	
		
		return (	
			<div className = "container">	
					<div className = "col-sm-6 col-md-6 col-lg-6" >
						<div className = "row">
							<div className = "product-image-main-container">
								<img src= {src_base + this.state.selected_image} className = "img-responsive product-image-main"/>
							</div>
						</div>

						<div className = "top-buffer"/>

					</div>

					<div className = "col-sm-6 col-md-6 col-lg-6">
						<div className = "row">
							<span className = "product-name-text">
								{this.props.product.name} 
							</span>
						</div>
						<div className = "row">
							<span className = "product-price-text">
								${this.formatPrice(this.props.product.price)}
							</span>
						</div>

						<div className = "small-buffer"/>
						<div className = "row">
							<ul>
							{this.props.product.description.split("\n").map(i => {
					            return <li>{i}</li>;
					        })}
					        	<li> Manufactured by {this.props.product.manufacturer}  </li>
					        	<li> Category: {this.props.product.category} </li>
					        </ul>
						</div>

					
					{/* <div onClick = {() => this.setState({more_information_open : !this.state.more_information_open})}
						 className = "row product-description-collapse-preview " data-toggle="collapse" data-target="#more_info_dropdown">
								<span className = "product-more-information-text"> More Information	</span>
								<span className = {this.state.more_information_open ? 
									"glyphicon glyphicon-chevron-up product-more-information-icon"
									 : "glyphicon glyphicon-chevron-down product-more-information-icon"}/>
						</div> */}
					

						<div className = "small-buffer"/>
						<div className="row" >
							<div className = "collapse" id = "more_info_dropdown">
								<div className = "card">
									<div className = "card-block">
										<span> Manufacturer : {this.props.product.manufacturer} </span> <br/>
										<span> Category : {this.props.product.category} </span> <br/>
									</div>
								</div>
							</div>
						</div>

						<div className = "small-buffer"/>
							
						<AddToCartButton cart_item = {this.state.cart_item}
						refreshUserInformation = {this.refreshUserInformation.bind(this)}
						product = {this.props.product}/>

						<div className = "small-buffer"/>
						
						<div className = "row">
							<div className = "panel-content">
								<ProductImages selectImage = {this.selectImage.bind(this)} product = {this.props.product}/>
							</div>
						</div>
					

					</div>
			</div>

		)
	}
}