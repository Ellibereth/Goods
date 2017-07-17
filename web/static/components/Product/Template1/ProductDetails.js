var React = require('react');
var ReactDOM = require('react-dom');
import {formatPrice} from '../../Input/Util'
import ProductAddToCart from './ProductAddToCart'

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class ProductDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image_id : "",
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
		if (this.state.item_in_stock) {
			if (product.sale_price) {
				return (
					<div>
						<p className="edgarPrice">
							<span >${formatPrice(this.props.product.sale_price)}</span>
						</p>
						<p className="retailPrice">
							${formatPrice(this.props.product.price)}
						</p>
					</div>
				)
			}

			else {
				return (
					<p className="edgarPrice retailPriceNotPresent">
						<span >${formatPrice(this.props.product.price)}</span>
					</p>
				)
			}
		}
		else {
			return (
				<p className="edgarPrice soldOut">
					<p className="edgarPrice">
						<span >Sold Out</span>
					</p>
					<p className="retailPrice">
						${formatPrice(this.props.product.price)}
					</p>
				</p>
			)
		}

	}

	componentDidMount(){
		if (!this.props.product) {
			return;
		}
		this.checkItemInStock.bind(this)(this.props.product)
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
		this.checkItemInStock.bind(this)(nextProps.product)
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
		if (product == null || product.product_id == null) return null;
		if (product.images.length == 0) return null
		// something better needs to be done about bad pages, but I'll figure something out soon
		return !product.main_image ? product.images[0].image_id : product.main_image;
	}

	getProductImages (product) {
		if (!product || !product.images){
			return <div/>
		}
		return product.images.map((image,index) => 
			<li>
				<img onClick = {this.selectImage.bind(this, index, image.image_id)}
				 className = {index == this.state.selected_image_index ? "selected" : ""} src={src_base + image.image_id}/>
			</li>
		)
	}

	getInventoryAlert(product) {
		// if ()
	}

	render() {
		var main_image_src = src_base + this.state.selected_image_id
		var product_images = this.getProductImages(this.props.product)
		var inventory_alert_ribbon = this.getInventoryAlert(this.props.product)
		return (

				<div id = "productpgTopWrapper">
					<div className = "productpgLeft float-left">
						<div id="productpgSliderWrap">

						<ul id="productImageSlider">
							<li>
								<img className="productPgMainImage" src={main_image_src}/>
							</li>
						</ul>
						</div>
					</div>

					<div className="productpgRight float-right">
						<div id="productPricingDetails">
							<div className="prodBFuyWrap newProductPgBuyList">
								<ul class="prodBuyList">
									<li className = "productPrice">
										<div id="dynamicOffrLink" className="dynamicTxtProdPage" style={{"cursor": "pointer"}}>
											<p>Happy 4th! This product is 20% off, just through July 7. Add it to your cart, start!</p>
										</div>
										{this.getPriceDisplay.bind(this)()}
									</li>

									<li className="colorsWithAddToCart">
										<ProductAddToCart
											item_in_stock = {this.state.item_in_stock}
											checkItemInStock = {this.checkItemInStock.bind(this)}
											product = {this.props.product}/>
									</li>

									<li id = "productParagraphDescription">
										<div className="productPgDisc">
											<p>In the 1970s and ’80s,&nbsp;
												<span style={{"color" : "#000000"}}>
													<strong>Jean-Michel Basquiat</strong>
												</span>
												&nbsp;pulverized the barriers between high and low art. His works were more
												<span style={{"color" : "#dd0017"}}>
													<strong>&nbsp;volatile and outwardly expressive</strong>
												</span>
												&nbsp;than Haring’s, yet equally rife with social commentary. In striving for all things fresh, loud, uninhibited, and diverse, the Brooklyn-born artist came to epitomize urban culture. Part of the&nbsp;
												<span style= {{"color" : "#000000"}}>
													<strong>KOMONO Curated</strong>
												</span>&nbsp;series presented in partnership with the Basquiat estate, the&nbsp;
												<span style= {{"color" : "#000000"}}>
													<strong>Wizard Watch</strong>
												</span>
												&nbsp;
												<span style= {{"line-height" : "1.231"}}>
													keeps a snippet of 50 Cent Piece—his 1983 text-based collage of charcoal, acrylic, pastel, crayon, and pencil—within arm’s reach.
												</span>
											</p>
										</div>
									</li>
									<li className="moreProdImages moreImagesWithABTesting">
										<div className="optimizelySliderForMoreImages">
											<ul id="moreIndvProdImages" className="moreProductSmlImages">
												{product_images}
											</ul>
										</div>
									</li>
								</ul>	
							</div>
							<div className = "clear"/>
						</div>
					</div>
				</div>
				
		);
	}
}
