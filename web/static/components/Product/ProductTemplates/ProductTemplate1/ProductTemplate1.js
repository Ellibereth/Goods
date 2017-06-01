var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {Button} from 'react-bootstrap';
import ProductImages from './ProductImages'
import AppStore from '../../../../stores/AppStore'
import AddToCartButton from './AddToCartButton.js'
import styles from '..//product_styles.css'
import {formatPrice} from '../../../Input/Util'
import ProductDescriptionTab from './ProductDescriptionTab'


export default class ProductTemplate1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image : null,
			items : [],
			price : null,
			cart_item : [],
			more_information_open : false
		}
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
					// else {
					// 	console.log(data.error)
					// }
				this.props.setLoading(false)
				}.bind(this),
				error : function(){
					console.log("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}




	render() {


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

						<div className = "small-buffer"/>

						<div className = "row">
							<div className = "panel-content">
								<ProductImages selectImage = {this.selectImage.bind(this)}
								selected_image  = {this.state.selected_image}
								product = {this.props.product}/>
							</div>
						</div>



						
					</div>

					<div className = "col-sm-6 col-md-6 col-lg-6">
						<div className = "row">
							<span className = "product-name-text">
								{this.props.product.name} 
							</span>
						</div>

						<div className = "row">
							<span className = "product-manufacturer-text">
								{this.props.product.manufacturer} 
							</span>
						</div>

						<div className = "row">
							<span className = "product-price-text">
								${formatPrice(this.props.product.price)} 
							</span>
						</div>

						



						<AddToCartButton cart_item = {this.state.cart_item}
						refreshUserInformation = {this.refreshUserInformation.bind(this)}
						product = {this.props.product}
						setLoading = {this.props.setLoading}
						/>

						<div className = 'top-buffer'/>
						<ProductDescriptionTab product = {this.props.product}/>
						{/* <div className = "small-buffer"/>
						<div className = "row">
							<span className = "product-features-heading"> FEATURES </span>
							<ul>
							{this.props.product.description.split("\n").map(i => {
					            return <li>{i}</li>;
					        })}
					        	<li> Manufactured by {this.props.product.manufacturer}  </li>
					        	<li> Category: {this.props.product.category} </li>
					        </ul>
						</div> */}

					
					


						<div className = "small-buffer"/>

					</div>
			</div>

		)
	}
}