var React = require('react');
var ReactDOM = require('react-dom');

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class ProductTopRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		var main_image_id =  this.props.product ? src_base + this.props.product.main_image : ""

		return (
					<div className="fab-col-xs-offset-0 fab-col-sm-offset-1 fab-col-md-offset-2 fab-col-lg-offset-6 fab-col-xl-offset-6 fab-col-xs-60 fab-col-sm-58 fab-col-md-56 fab-col-lg-48 fab-col-xl-48" id="productpgTopWrapper">
						<div className="fab-row">
							<div className="fab-row-same-height fab-row-full-height jq-i-parcel-info jq-parcel-product" data-product-size-value="526543">
								<div className="hidden-xs fab-col-sm-4 no-padding fab-col-full-height vertical-slider">
									<div className="res-moreProdImages">
										<div className="res-optimizelySliderForMoreImages">
											<ul className="res-moreIndvProdImages res-moreProductSmlImages bxslider">
												<li className="poRel slide prd-alt-thumb-img-wrap prod-mini-thumb center-block img-responsive prdthumbimgwrap prdaltthumbimgwrap item    primary">
													<img data-prod-id="526543" alt="" title="" data-sale-id="100000" src="//dnok91peocsw3.cloudfront.net/product/526543-70x70-1471870412-primary.png" className="pthumbimg center-block img-responsive"/>
													<div className="material-mask">
														<div className="material-inner-mask"></div>
													</div>
												</li>
												<li className="poRel prd-alt-thumb-img-wrap prod-mini-thumb center-block img-responsive prdthumbimgwrap prdaltthumbimgwrap item selected">
													<img data-prod-id="526543" alt="" title="" data-sale-id="100000" src="//dnok91peocsw3.cloudfront.net/product/526543-70x70-1471870426-s1.png" className="pthumbimg center-block img-responsive"/>
													<div className="material-mask">
														<div className="material-inner-mask"/>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
							

								<div className="hidden-xs fab-col-sm-32 no-padding fab-col-sm-offset-1 fab-col-full-height prod-main-img-left-offset">
									<div id="product-pg-images-wrap" className="zoomCursor">
										<li>
											<img className="productPgMainImage fab-img-responsive js-show-fs" src= {main_image_id}/>
									 	</li>
									</div>
								</div>

								<div className="fab-col-sm-20 fab-col-sm-offset-1 fab-col-xs-60 fab-col-xs-offset-0    fab-col-full-height prod-img-left-offset">
									<div className="productpgRight is_new_product_dpp">
										<div id="productPricingDetails">
											<div className="prodBFuyWrap newProductPgBuyList">
												<ul className="prodBuyList">
													<li>
														<div id="prdShareWithTitle">
															<div className="floatLeft price-with-designers">
																<h1 id="productTitle" className="product-title new-heading-1" itemprop="name">Pink Banana Leaf Pillow</h1>
																<link itemprop="url" href="https://fab.com/product/pink-banana-leaf-pillow-526543/ff7o4r?fref=fb-like"/>
																	<div>
																		<span id="byText" className="byText new-heading-3">by</span>
																		<h2 className="designer-name new-heading-3"><a href="/designer/wilder-california/" alt="" title="">{" Wilder California"}</a></h2>
																	</div>
															</div>
														</div>
													</li>
													<li className="productPrice" data-refreshed-section="section_product_price_details">
														<p className="fab-color-black new-heading-2 float-left fabPrice retailPriceNotPresent" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
															<span itemprop="price" className="fab-color-black bold-texts">
																$32
															</span>
														</p>
														<div className="clear"></div>
													</li>

													<div className="cnfPg-mask"></div>
													<div className="cnfPg-maskL"></div>
													<li id="clickedOnColor" className="colorMask displayNone"></li>
													<li className="colorsWithAddToCart reg-prod-pg">

														<div className="quantitySelBlock " style= {{"visibility" : "visible"}}>
															<select tabindex="-1" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="qtyDropDownOnProductPg" className="quantityPgSizeDD def_select quantityDPP hide" >
																<option value="1">1</option>
																<option value="2">2</option>
																<option value="3">3</option>
																<option value="4">4</option>
																<option value="5">5</option>
																<option value="6">6</option>
																<option value="7">7</option>
																<option value="8">8</option>
																<option value="9">9</option>
																<option value="10">10</option>
																<option value="11">11</option>
																<option value="12">12</option>
																<option value="13">13</option>
																<option value="14">14</option>
																<option value="15">15</option>
																<option value="16">16</option>
																<option value="17">17</option>
																<option value="18">18</option>
																<option value="19">19</option>
																<option value="20">20</option>
																<option value="21">21</option>
																<option value="22">22</option>
																<option value="23">23</option>
																<option value="24">24</option>
																<option value="25">25</option>
																<option value="26">26</option>
																<option value="27">27</option>
																<option value="28">28</option>
																<option value="29">29</option>
																<option value="30">30</option>
															</select><div className="chosen-container chosen-container-single chosen-container-single-nosearch" style= {{"width" : "75px"}} title="" id="qtyDropDownOnProductPg_chosen"><a className="chosen-single" tabindex="-1"><span>1</span><div><b></b></div></a><div className="chosen-drop"><div className="chosen-search"><input type="text" autocomplete="off" readonly="" tabindex="2"/></div><ul className="chosen-results"></ul></div></div>
														</div>
													<div className="productBadge">
														<span className=" dIB"></span>
														<span className="badgeRelatedContent dIB small-text-grey" style= {{"verticalAlign" : "top"}}><span className="fontB "></span> <span className="colorRed fontNr fontWeight500">FREE SHIPPING</span> above $75* <a href="/shipping-policy/?ref=product_pg"><i className="fa fa-question-circle"></i></a></span>
														
													</div>
													<div className="prodPgAddcartButton clear">
																<a tabindex="3" href="javascript:void(0)" data-attr-btnname="top_cart" className="btn btn-default-red    prodPgAddcartAchrButton fabSubmitBtn addToCart round5 noShadow fabGrad noPadding">
																	<div className="add-to-bag-btn-ct">
																		<span className="shop-bag-icon-white add-bag-btn-img"></span>
																		<span>&nbsp;&nbsp;&nbsp;Add to Bag</span>
																	</div>
																</a>
															<div className="prodNavFaveCt float-left prodPageFav">
																<span data-tracker="fav_login" data-trackerevent-type="loginToFav" id="prodNavFaveImg" className="prodNavFaveImg favProduct new-heading-2 favedOnPNVC faveCountclassName" alt="Like this product? ADD TO YOUR LISTS" title="Like this product? ADD TO YOUR LISTS">
																	<i id="heartContainer" className="fa fa-heart-o"></i>
																	<span id="faveIconCount" style= {{"display" : "inline"}}>65</span>
																</span>
															<div className="list-dropdown-wrapper"><div className="arrow"></div><div className="non-content"><div className="curtain"><div className="error-msg-placeholder">Oops! Something went wrong.</div></div></div><div className="view-content"><ul className="wishlists"><li><label className="wishlist master-list" for="526543_2283159"><input type="checkbox" id="526543_2283159" data-id="2283159" className="master-list"/><label for="526543_2283159"></label><span className="list-name">Faves</span><span className="list-items-count">(0)</span></label></li></ul><form className="new-list"><input type="text" className="new-list-name" placeholder="Create New List"/><input type="submit" className="listBtn createList colorfff" value="Add"/></form></div></div></div>
															<div className="clear"></div>
														</div>
													<div className="clear"></div>
												</li>
								
												<li className="clear">
													<div className="clear"></div>
													
												<ul className="newShareWidgetLinks ">
													<li className="facebook-li">
														<a data-social-share="facebook" id="productPageNavFB" className="fb-a jShareIcon" href="javascript:void(0)" onclick="window.open(&quot;http:\/\/www.facebook.com\/sharer.php?u=&quot; + encodeURIComponent(&quot;http://fab.com/product/pink-banana-leaf-pillow-526543/?fref=product-invite-fb&quot;), &quot;my_window&quot;, &quot;height=440,width=620,scrollbars=true&quot;);return false;" title="Share on Facebook"><i className="fa fa-facebook font-size-1_6em "></i></a>
													</li>

													<li className="twitter-li">
														<a data-social-share="twitter" className="tw-a jShareIcon" id="productPageNavTweet" href="http://twitter.com/intent/tweet?text=So+into+this+design+on+Fab%21+Pink+Banana+Leaf+Pillow+%23FabForAll+http%3A%2F%2Ffab.com%2Fproduct%2Fpink-banana-leaf-pillow-526543%2F%3Ffref%3Dproduct-invite-tw&amp;via=Fab" target="_blank" title="Share on Twitter"><i className="fa fa-twitter font-size-1_6em "></i></a>
													</li>

													<li className="tumblr-li ">
														<a data-social-share="tumblr" className="tu-a jShareIcon" href="javascript:void(0)" onclick="window.open(&quot;http://www.tumblr.com/share/photo?source=http%3A%2F%2Fdnok91peocsw3.cloudfront.net%2Fproduct%2F526543-1200x1200-1471870412-primary.png&amp;tags=FabForAll&amp;caption=So into this design on Fab! Pink Banana Leaf Pillow %23FabForAll%3Ca+href%3D%27http%3A%2F%2Ffab.com%2Fproduct%2Fpink-banana-leaf-pillow-526543%2F%3Ffref%3Dproduct-invite-tu%27%3E%3C%2Fa%3E%3Cbr%2F%3EFab.com%3Cbr%2F%3E&quot;, &quot;my_window&quot;, &quot;height=440,width=620,scrollbars=true&quot;);return false;" title="Share on Tumblr"><i className="fa fa-tumblr font-size-1_6em "></i></a>
													</li>

													<li className="pinterest-li ">
														<a className="pi-a" onclick="return false;" href="http://pinterest.com/pin/create/button/?url=http://fab.com/product/pink-banana-leaf-pillow-526543/?fref=product-invite-pinterest&amp;media=http://dnok91peocsw3.cloudfront.net/product/526543-360x360-1471870412-primary.png&amp;description=Currently inspired by: Pink+Banana+Leaf+Pillow on Fab.com" count-layout="horizontal"></a>
														<span data-social-share="pinterest" className="pinIcon2-0 pi-a jShareIcon" title="Pin it on Pinterest"><i className="fa fa-pinterest-p font-size-1_6em"></i></span>
													</li>
												</ul>
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
