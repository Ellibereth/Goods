var React = require('react');
var ReactDOM = require('react-dom');
import Footer from '../Nav/Footer'
import {formatPrice} from '../Input/Util'

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class ProductDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image_id : "",
			selected_image_index : 0,
		}
	}

	selectImage(index, image_id) {
		this.setState({
			selected_image_id : image_id,
			selected_image_index : index
		})
	}

	componentDidMount(){
		var main_image_id = this.getMainImage(this.props.product)
		this.setState({
			selected_image_id : main_image_id
		})
	}

	componentWillReceiveProps(nextProps) {
		var main_image_id = this.getMainImage(nextProps.product)
		this.setState({
			selected_image_id : main_image_id
		})
	}

	getMainImage(product) {
		if (product == null || product.product_id == null) return null;
		if (product.images.length == 0) return null
		// something better needs to be done about bad pages, but I'll figure something out soon
		
		if (!product.main_image) {
			var main_image_id = product.images[0].image_id
		}
		else {
			var main_image_id = product.main_image
		}
		return main_image_id
	}

	getProductImages (product) {
		if (!product) return <div/>
		if (!product.images) return <div/>
		var product_images = product.images.map((image,index) => {
			return (
				<li>
					<img onClick = {this.selectImage.bind(this, index, image.image_id)}
					 className = {index == this.state.selected_image_index ? "selected" : ""} src={src_base + image.image_id}/>
				</li>
			)
		})
		return product_images
	}

	render() {
		var main_image_src = src_base + this.state.selected_image_id
		var product_images = this.getProductImages(this.props.product)

		return (

				<div id = "productpgTopWrapper">
					<div className = "paddingBottom13">
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
											<p className="fabPrice retailPriceNotPresent">
												<span >${formatPrice(this.props.product.price)}</span>
											</p>
										</li>

										<li className="colorsWithAddToCart">
											<div className="quantitySelBlock" style={{"visibility" : "hidden"}}>
												<select tabindex="2" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="qtyDropDownOnProductPg" className="quantityPgSizeDD def_select quantityDPP">
													{/* quantity select options */}
													<option value="1">1</option>
												</select>
											</div>
											<div className="prodPgAddcartButton clear">
												<a tabindex="3" href="javascript:void(0)" data-attr-btnname="top_cart" className="prodPgAddcartAchrButton fabSubmitBtn addToCart round5 noShadow fabGrad">
													Add to Cart
												</a>
											</div>
											<div className="clear"></div>
											<div className="productBadge">
												<span className="fabShopSprite2 fabproductBigSizeLogo dIB"></span>
												<span className="badgeRelatedContent font12 dIB"><span className="font14 fabProductTextColor">FAB PLUS</span> – This product ships immediately. <span className="colorRed font12 fontNr fontWeight500 free-shipping-link">FREE SHIPPING</span> above $49.</span>
												<span data-badgetype="fabproduct_morecontentLeftopen" className=" productBadgeQuestionMark dIB fabShopSpriteNew productBadgeTooltipHandler">
												</span> 
											</div>
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
				</div>
				
		);
	}
}
