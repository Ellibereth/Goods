var React = require('react');
var ReactDOM = require('react-dom');
import ProductAddToCart from './ProductAddToCart'
import {formatPrice} from '../../Input/Util.js'
const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class ProductTopRow extends React.Component {
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
						<p className="edgar-color-black new-heading-2 float-left edgarPrice retailPriceNotPresent" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
							<span className="edgar-color-black bold-texts">
								${formatPrice(product.sale_price)}
							</span>
						</p>
						<p className="edgar-color-black new-heading-2 float-left edgarPrice retailPrice" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
							<span className="edgar-color-black bold-texts">
								${formatPrice(product.price)}
							</span>
						</p>
					</div>
				)
			}

			else {
				return (
					<p className="edgar-color-black new-heading-2 float-left edgarPrice retailPriceNotPresent" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
						<span className="edgar-color-black bold-texts">
							${formatPrice(product.price)}
						</span>
					</p>
				)
			}
		}
		else {
			return (
				<div>
						<p className="edgar-color-black new-heading-2 float-left edgarPrice retailPriceNotPresent" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
							<span className="edgar-color-black bold-texts">
								Sold Out
							</span>
						</p>
						<p className="edgar-color-black new-heading-2 float-left edgarPrice retailPrice" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
							<span className="edgar-color-black bold-texts">
								${formatPrice(product.price)}
							</span>
						</p>
					</div>
			)
		}

	}

	componentDidMount(){
		if (!this.props.product || !this.props.product.images) {
			return;
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
		if (product == null || product.product_id == null) return null;
		if (product.images.length == 0) return null
		// something better needs to be done about bad pages, but I'll figure something out soon
		return !product.main_image ? product.images[0].image_id : product.main_image;
	}

	getProductImages (product) {
		if (!product || !product.images){
			return <div/>
		}


		return product.images.map((image,index) => {
			var class_base = "poRel slide prd-alt-thumb-img-wrap prod-mini-thumb center-block prdthumbimgwrap prdaltthumbimgwrap item "
			var is_selected_class = (index == this.state.selected_image_index) ? " selected " : ""
			var is_first_class = (index == 0) ? " primary " : ""
			var class_name = class_base + is_selected_class + is_first_class
			return <li className={class_name}>
						<img onClick = {this.selectImage.bind(this, index, image.image_id)} 
						src={src_base + image.image_id} 
						className = "product-more-images pthumbimg center-block img-responsive" />
							<div className="material-mask">
								<div className="material-inner-mask"></div>
							</div>
					</li>
		})
	}

	


	render() {
		var product = this.props.product
		var main_image_id = src_base + this.state.selected_image_id
		var product_images = this.getProductImages(this.props.product)
		var price_row = this.getPriceDisplay.bind(this)(product)
		
		return (
					<div className="edgar-col-xs-offset-0 edgar-col-sm-offset-1 edgar-col-md-offset-2 edgar-col-lg-offset-6 edgar-col-xl-offset-6 edgar-col-xs-60 edgar-col-sm-58 edgar-col-md-56 edgar-col-lg-48 edgar-col-xl-48" id="productpgTopWrapper">
						<div className="edgar-row">
							<div className="edgar-row-same-height edgar-row-full-height jq-i-parcel-info jq-parcel-product" data-product-size-value="526543">
								<div className="hidden-xs edgar-col-sm-4 no-padding edgar-col-full-height vertical-slider">
									<div className="res-moreProdImages">
										<div className="res-optimizelySliderForMoreImages">
											<ul className="res-moreIndvProdImages res-moreProductSmlImages bxslider">	
												{product_images}
											</ul>
										</div>
									</div>
								</div>
							

								<div className="hidden-xs edgar-col-sm-32 no-padding edgar-col-sm-offset-1 edgar-col-full-height prod-main-img-left-offset">
									<div id="product-pg-images-wrap" className="zoomCursor">
										<li>
											<img className="productPgMainImage edgar-img-responsive js-show-fs" src= {main_image_id}/>
									 	</li>
									</div>
								</div>

								<div className="edgar-col-sm-20 edgar-col-sm-offset-1 edgar-col-xs-60 edgar-col-xs-offset-0    edgar-col-full-height prod-img-left-offset">
									<div className="productpgRight is_new_product_dpp">
										<div id="productPricingDetails">
											<div className="prodBFuyWrap newProductPgBuyList">
												<ul className="prodBuyList">
													<li>
														<div id="prdShareWithTitle">
															<div className="floatLeft price-with-designers">
																<h1 id="productTitle" className="product-title new-heading-1" itemprop="name">{product.name}</h1>
																<link itemprop="url" href="https://edgar.com/product/pink-banana-leaf-pillow-526543/ff7o4r?fref=fb-like"/>
																	<div>
																		<span id="byText" className="byText new-heading-3">by</span>
																		<h2 className="designer-name new-heading-3"><a href= {"/search/" + product.manufacturer} style = {{"paddingLeft" : "4px"}}>{product.manufacturer}</a></h2>
																	</div>
															</div>
														</div>
													</li>
													<li className="productPrice" data-refreshed-section="section_product_price_details">
														{price_row}
														<div className="clear"></div>
													</li>

													<div className="cnfPg-mask"></div>
													<div className="cnfPg-maskL"></div>
													<li id="clickedOnColor" className="colorMask displayNone"></li>
													<ProductAddToCart 
													setLoading = {this.props.setLoading}
													getProductInformation = {this.props.getProductInformation}
													item_in_stock = {this.state.item_in_stock}
													checkItemInStock = {this.checkItemInStock.bind(this)}
													product = {this.props.product}/>
								
												<li className="clear">
													<div className="clear"></div>
													
												{/* <ul className="newShareWidgetLinks ">
													<li className="facebook-li">
														<a data-social-share="facebook" id="productPageNavFB" className="fb-a jShareIcon" href="javascript:void(0)" onclick="window.open(&quot;http:\/\/www.facebook.com\/sharer.php?u=&quot; + encodeURIComponent(&quot;http://edgar.com/product/pink-banana-leaf-pillow-526543/?fref=product-invite-fb&quot;), &quot;my_window&quot;, &quot;height=440,width=620,scrollbars=true&quot;);return false;" title="Share on Facebook"><i className="fa fa-facebook font-size-1_6em "></i></a>
													</li>

													<li className="twitter-li">
														<a data-social-share="twitter" className="tw-a jShareIcon" id="productPageNavTweet" href="http://twitter.com/intent/tweet?text=So+into+this+design+on+Edgar%21+Pink+Banana+Leaf+Pillow+%23EdgarForAll+http%3A%2F%2Fedgar.com%2Fproduct%2Fpink-banana-leaf-pillow-526543%2F%3Ffref%3Dproduct-invite-tw&amp;via=Edgar" target="_blank" title="Share on Twitter"><i className="fa fa-twitter font-size-1_6em "></i></a>
													</li>

													<li className="tumblr-li ">
														<a data-social-share="tumblr" className="tu-a jShareIcon" href="javascript:void(0)" onclick="window.open(&quot;http://www.tumblr.com/share/photo?source=http%3A%2F%2Fdnok91peocsw3.cloudfront.net%2Fproduct%2F526543-1200x1200-1471870412-primary.png&amp;tags=EdgarForAll&amp;caption=So into this design on Edgar! Pink Banana Leaf Pillow %23EdgarForAll%3Ca+href%3D%27http%3A%2F%2Fedgar.com%2Fproduct%2Fpink-banana-leaf-pillow-526543%2F%3Ffref%3Dproduct-invite-tu%27%3E%3C%2Fa%3E%3Cbr%2F%3EEdgar.com%3Cbr%2F%3E&quot;, &quot;my_window&quot;, &quot;height=440,width=620,scrollbars=true&quot;);return false;" title="Share on Tumblr"><i className="fa fa-tumblr font-size-1_6em "></i></a>
													</li>

													<li className="pinterest-li ">
														<a className="pi-a" onclick="return false;" href="http://pinterest.com/pin/create/button/?url=http://edgar.com/product/pink-banana-leaf-pillow-526543/?fref=product-invite-pinterest&amp;media=http://dnok91peocsw3.cloudfront.net/product/526543-360x360-1471870412-primary.png&amp;description=Currently inspired by: Pink+Banana+Leaf+Pillow on Edgar.com" count-layout="horizontal"></a>
														<span data-social-share="pinterest" className="pinIcon2-0 pi-a jShareIcon" title="Pin it on Pinterest"><i className="fa fa-pinterest-p font-size-1_6em"></i></span>
													</li>
												</ul>
												*/}
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>	
		);
	}
}
