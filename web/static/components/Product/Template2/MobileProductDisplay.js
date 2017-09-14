var React = require('react')
var ReactDOM = require('react-dom')
import ProductAddToCart from './ProductAddToCart'
import {formatPrice} from '../../Input/Util.js'
import MobileAddToCart from './MobileAddToCart'
const src_base = 'https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/'
const INVENTORY_ALERT_LIMIT = 5

export default class MobileProductDisplay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selected_image_id : '',
			selected_image_index : 0,
			item_in_stock : true,
			can_add_to_cart : true
		}
	}

	selectImage(index, image_id) {
		this.setState({
			selected_image_id : image_id,
			selected_image_index : index
		})
	}

	

	checkItemInStock(product, variant){

		if (product.has_variants) {
			if (variant) {
				var item_in_stock = (variant.inventory > 0)
			}
			else {
				var item_in_stock = true
			}
		}
		// item does not have variants
		else {
			var item_in_stock = (product.inventory > 0)
		}

		this.setState({
			item_in_stock : item_in_stock,
			can_add_to_cart : item_in_stock
		})
	}

	getPriceDisplay() {

		var product = this.props.product
		if (!product) return ''
		if (this.state.item_in_stock) {
			if (product.sale_text_product) {
				return (
					<div className = "text-center" >
						<span style = {{'color' : '#d42729'}} className="bold-texts">
							${formatPrice(product.price)}
						</span>
						<span className="bold-texts"
							dangerouslySetInnerHTML = {{__html : product.sale_text_product}}>
						</span>
					</div>
				)
			}

			else {
				return (
					<div className = "text-center">
						<span className="edgar-color-black bold-texts">
						${formatPrice(product.price)}
						</span>
					</div>
				)
			}
		}
		else {
			return (
				<div className = "text-center">
					<span className="edgar-color-black bold-texts">
						Sold Out
					</span>
				
					<span style = {{'paddingLeft' : '6px'}}className="edgar-color-black bold-texts">
						<s>${formatPrice(product.price)}</s>
					</span>
				</div>
			)
		}

	}

	componentDidMount(){
		if (!this.props.product || !this.props.product.images) {
			return
		}
		if (!this.props.product.has_variants) {
			this.checkItemInStock.bind(this)(this.props.product, null)
		}
		else {
			this.checkItemInStock.bind(this)(this.props.product, this.props.product.variants[0])
		}
		var main_image_id = this.getMainImage(this.props.product)
		this.props.product.images.map((image,index) => {
			if (image.image_id == main_image_id){
				this.setState({
					selected_image_id : main_image_id,
					selected_image_index : index
				})		
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		var main_image_id = this.getMainImage(nextProps.product)
		if (!nextProps.product.has_variants) {
			this.checkItemInStock.bind(this)(nextProps.product, null)
		}
		else {
			this.checkItemInStock.bind(this)(nextProps.product, nextProps.product.variants[0])
		}
		nextProps.product.images.map((image, index) => {
			if (image.image_id == main_image_id){
				this.setState({
					selected_image_id : main_image_id,
					selected_image_index : index
				})		
			}
		})
	}


	getMainImage(product) {
		if (product == null || product.product_id == null) return null
		if (product.images.length == 0) return null
		// something better needs to be done about bad pages, but I'll figure something out soon
		return !product.main_image ? product.images[0].image_id : product.main_image
	}

	getProductImages (product) {
		if (!product || !product.images){
			return <div/>
		}


		return product.images.map((image,index) => {
			
			var is_selected_class = (index == this.state.selected_image_index) ? ' selected ' : ''
			var is_first_class = (index == 0) ? ' primary ' : ''
			var class_name =  is_selected_class + is_first_class
			return 
			<div className = {'col-xs-2 ' + className}>
				<img onClick = {this.selectImage.bind(this, index, image.image_id)} 
					src={src_base + image.image_id} 
					className = "product-more-images img-responsive" />
			</div>
		})
	}

	


	render() {
		var product = this.props.product
		if (this.state.selected_image_id){
			var main_image_id = src_base + this.state.selected_image_id
		}
		else if (product.images) {
			var main_image_id = src_base + product.images[0].image_id
		}
		var product_images = this.getProductImages(this.props.product)
		var price_row = this.getPriceDisplay.bind(this)(product)
		
		return (
			<div className = "container">
				<div className = "small-buffer"/>
				<div className="row">
					<div className = "col-xs-12 text-center">
						<img className="mobile-product-page-image" src= {main_image_id}/>
					</div>
				</div>
				<div className = "small-buffer"/>
				<div className = "row ">
					<div style = {{'fontSize': '20px'}} className = "col-xs-12">
						{product_images}
					</div>
				</div>
				<div className = "small-buffer"/>
				<div className = "row ">
					<div style = {{'fontSize': '16px'}} className = "col-xs-12 text-center">
						<span> {product.name} </span>
					</div>
				</div>
				<div className = "small-buffer"/>
				<div className = "row ">
					<div style = {{'fontSize': '16px'}} className = "col-xs-12 text-center">
						<a href= {'/search/' + product.manufacturer_obj.name}>{product.manufacturer_obj.name}</a>
					</div>
				</div>
				<div className = "small-buffer"/>
				<div className = "row ">
					<div style = {{'fontSize': '16px'}} className = "col-xs-12 text-center">
						{price_row} 
					</div>
				</div>
				<div className = "small-buffer"/>
				{(product.inventory < INVENTORY_ALERT_LIMIT && this.state.item_in_stock)&& 
							<div className = "row">
								<div className = "col-xs-12 text-center">
									<div style = {{'fontSize': '16px'}} className = "low-inventory-warning-text">Only {product.inventory} remaining - order soon</div>
								</div>
							</div>
				}


								


				<MobileAddToCart 
					setLoading = {this.props.setLoading}
					getProductInformation = {this.props.getProductInformation}
					item_in_stock = {this.state.item_in_stock}
					checkItemInStock = {this.checkItemInStock.bind(this)}
					product = {this.props.product}/>


				<div className="row">
					<div className = "col-xs-12"
						dangerouslySetInnerHTML={{__html: product.quadrant1}}/>
				</div>
				<div className="row">
					<div className = "col-xs-12"
						dangerouslySetInnerHTML = {{__html : product.quadrant2}}/>
				</div>

				<hr/>

				<div className="row">
					<div className = "col-xs-12"
						dangerouslySetInnerHTML = {{__html : product.quadrant3}}/>
				</div>

				<div className="row">
					<div className = "col-xs-12"
						dangerouslySetInnerHTML = {{__html : product.quadrant4}}/>
				</div>


			</div>

		)
	}
}
