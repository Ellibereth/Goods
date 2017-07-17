var React = require('react');
var ReactDOM = require('react-dom');

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class ProductMiddleRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	generateMoreDetails(product){
		if (!product || !product.more_details) return <div/>
		return (
			<ul>
				{product.more_details.split("\n").map((row) => 
					<li><span style={{"line-height" : "1.231"}}>{row}</span></li>
					)
				}
			</ul>
		)
		
	}

	render() {
		var product = this.props.product
		var product_more_details = this.generateMoreDetails(product)
		return (
				<div className="extra-info-wrap edgar-col-xs-offset-0 edgar-col-sm-offset-1 edgar-col-md-offset-2 edgar-col-lg-offset-6 edgar-col-xl-offset-6 edgar-col-xs-60 edgar-col-sm-58 edgar-col-md-56 edgar-col-lg-48">
					<div className="edgar-row" id="productExtraInfo">
						<div className="hidden-xs edgar-col-sm-60">
							<div className="edgar-row">
								<div className="edgar-col-xs-60 edgar-col-sm-29">
									<div className="new-heading-2    edgar-color-black margin-bottom-15">
										Description
									</div>
									<div className="productPgDisc p-normal-text" itemprop="description">
									<p>{product.description}</p>
									</div>
								</div>
								<div className="edgar-col-xs-60 edgar-col-sm-29 edgar-col-sm-offset-2">
									<div id="productPgMoreInfo" className="productMoreInfoInLeft">
										<div className="prodMidblock" id="prodMDWrap" style= {{"padding" : "0 0 15px 0"}}>
											<div>
												<div className="new-heading-2 margin-bottom-15 hidden-xs">More Details&nbsp;<span className="edgarShopSprite moreIconI dIB"></span>
													</div>
														<div className="desc p-normal-text">
																{product_more_details}
														</div>
												<div className="clear"></div>



											</div>
										</div>
									</div>
								</div>
								<div className="edgar-row"><div className="edgar-col-xs-60"><hr/></div></div>
								<div className="edgar-row">
									<div className="edgar-col-xs-60 edgar-col-sm-29">
										<div id="productPgMoreShippingInfo" className="shippingInfoOnTop">
											<div className="prodMidblock" style= {{"padding" :"0 0 15px 0"}}>
												<div className="new-heading-2 hidden-xs margin-bottom-15">Shipping Info
													<span className="fa fa-truck shipping_icon"></span>
												</div>
												<div className="clear"></div>
													<ul className="" id="shippingDetails" style={{"overflow": "visible"}}>
														<li className="padding-bottom-5 xmasMsgForProductPg">
														<span className="full">
															<label className="ead-label p-bold-text">Estimated Arrival:</label>
															<span className="p-normal-text local-ead-lng">
																	Between Jul. 18 and Aug. 2
																{/* <span className="eadWrapCls" style= {{"display" :"inline"}}>
																	<span className="ead_zip_code" style={{"color":"#999"}}>19711,</span> 
																	<div className="ead-ui-adjust">
																		<input type="text" maxlength="7" className="ead_zip_code_input" value="19711" original="19711"/>
																		<span className="ship_country" original="USA" style={{"display":"inline", "color" :"#999"}}>USA</span>
																	</div>
																	<span className="eadEdit floatRight colorRed" style={{"display":"none"}}>Edit</span>
																	<span className="eadErrMsg" style={{"display" : "none"}}>Please enter a valid zip code</span>
																</span> */}
															</span>
														</span>
													</li>
												<li>
								<span className="full">
										<label className="p-bold-text">Shipping Information:</label>
										<span style= {{"display" : "inline", "paddingRight" : "4px"}} className="p-normal-text">Standard Shipping</span>
								</span>
						</li>
				<li>
						<span className="full">
								<label className="p-bold-text ">Return Policy:</label>
								<span style= {{"display" : "inline"}} className="p-normal-text">We will gladly accept returns for any reason within 30 days of receipt of delivery.</span>
						</span>
				</li>
						<li>
								<span className="full">
										<label className="p-bold-text">Availability:</label>
												<span style= {{"display" : "inline"}} className="p-normal-text">Ships to United Kingdom and the contiguous United States</span>
								</span>
						</li>
		</ul>
</div>
								</div>
						</div>

				</div>
		</div>
		<div className="visible-only-xs edgar-col-xs-60">
				<div className="panel-group" id="accordion-extra-info" role="tablist" aria-multiselectable="true">
						<div className="panel panel-default">
								<div className="panel-heading" role="tab" id="heading-description">
										<h4 className="panel-title">
												<a data-toggle="collapse" data-parent="#accordion-extra-info" href="#collapse-description" aria-expanded="true" aria-controls="collapse-description">
														<div className=" edgar-color-black new-heading-3">Description</div>
												</a>
										</h4>
								</div>
								<div id="collapse-description" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-description">
										<div className="panel-body">
												<div className="productPgDisc" itemprop="description">
														<p>Wilder California's washed out, rose-gold plantscapes are like a perma-golden hour. Saturated in a pale pink mist, these details from the deserts, coasts, and meadows of California look like they're being hunted by the sun. Chic and subtly retro and as warm as a late summer evening.</p>
												</div>
										</div>
								</div>
						</div>
						<div className="panel panel-default">
								<div className="panel-heading" role="tab" id="heading-shipping-info">
										<h4 className="panel-title">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordion-extra-info" href="#collapse-shipping-info" aria-expanded="false" aria-controls="collapse-shipping-info">
														<div className="new-heading-3 edgar-color-black">Shipping Info
																		 <span className="fa fa-truck shipping_icon"></span>
														</div>
												</a>
										</h4>
								</div>
								<div id="collapse-shipping-info" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-shipping-info">
										<div className="panel-body">
												<div id="productPgMoreShippingInfo" className="shippingInfoOnTop">
																		<div className="prodMidblock" style= {{"padding" : "0 0 15px 0"}}>
		<div className="new-heading-2 hidden-xs margin-bottom-15">Shipping Info
						<span className="fa fa-truck shipping_icon"></span>
		</div>
		<div className="clear"></div>
		<ul className="" id="shippingDetails" style= {{"overflow" : "visible"}}>

						<li className="padding-bottom-5 xmasMsgForProductPg">
										<span className="full">
				<label className="ead-label p-bold-text">Estimated Arrival:</label>
								<span className="p-normal-text local-ead-lng">
														Between Jul. 18 and Aug. 2
												{/* <span className="eadWrapCls" style= {{"display" :"inline"}}>
																<span className="ead_zip_code" style={{"color":"#999"}}>19711,</span> 
														<div className="ead-ui-adjust"><input type="text" maxlength="7" className="ead_zip_code_input" value="19711" original="19711"/>
																		<span className="ship_country" original="USA" style={{"display":"inline","color":"#999"}}>USA</span>
														</div><span className="eadEdit floatRight colorRed" style={{"display":"none"}}>Edit</span>
														<span className="eadErrMsg" style={{"display": "none"}}>Please enter a valid zip code</span>
												</span> */}
				</span>
</span>

						</li>
						<li>
								<span className="full">
										<label className="p-bold-text">Shipping Information:</label>
										<span style={{"display":"inline", "paddingRight": "4px"}} className="p-normal-text">Standard Shipping</span>
								</span>
						</li>
				<li>
						<span className="full">
								<label className="p-bold-text ">Return Policy:</label>
								<span style= {{"display":"inline"}} className="p-normal-text">We will gladly accept returns for any reason within 30 days of receipt of delivery.</span>
						</span>
				</li>
						<li>
								<span className="full">
										<label className="p-bold-text">Availability:</label>
												<span style={{"display":"inline"}} className="p-normal-text">Ships to United Kingdom and the contiguous United States</span>
								</span>
						</li>
		</ul>
</div>
												</div>
										</div>
								</div>
						</div>
						<div className="panel panel-default">
								<div className="panel-heading" role="tab" id="heading-more-details">
										<h4 className="panel-title">
												<a className="collapsed" data-toggle="collapse" data-parent="#accordion-extra-info" href="#collapse-more-details" aria-expanded="false" aria-controls="collapse-more-details">
														<div className="new-heading-3 edgar-color-black">More Details&nbsp;<span className="edgarShopSprite moreIconI dIB"></span>
														</div>
												</a>
										</h4>
								</div>
								<div id="collapse-more-details" className="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-more-details">
										<div className="panel-body">
												<div id="productPgMoreInfo" className="productMoreInfoInLeft">
														<div className="prodMidblock" id="prodMDWrap" style={{"padding": "0 0 15px 0"}}>
		<div>
				<div className="new-heading-2 margin-bottom-15 hidden-xs">More Details&nbsp;<span className="edgarShopSprite moreIconI dIB"></span>
				</div>
		</div>
				<div className="desc p-normal-text">
						<ul>

<li><span style={{"lineHeight" :"1.231"}}>16” x 16”</span></li>

<li><span style={{"lineHeight" :"1.231"}}>Zipper shell with concealed zipper</span></li>

<li><span style={{"lineHeight" :"1.231"}}>Double sided print</span></li>

<li><span style={{"lineHeight" :"1.231"}}>Pillow insert included (handwash only)</span></li>

<li><span style={{"lineHeight" :"1.231"}}>Printed on soft and super smooth edgarric great for showing print detail</span></li>

<li><span style={{"lineHeight" :"1.231"}}>This item is made to order and will ship to you directly from the designer. Please allow for extra shipping time.</span></li>

</ul>
				</div>
		<div className="clear"></div>

 <div className="prod-attr-details margin-top-5">
								<div className="prod-attr">
										<div className="prod-attr-key p-bold-text">Designer:</div>
										<div className="prod-attr-value p-normal-text">Wilder California</div>
								</div>
								<div className="prod-attr">
										<div className="prod-attr-key p-bold-text">Care:</div>
										<div className="prod-attr-value p-normal-text">Wash Shell Only.Machine Wash Cold, Delicate. No Bleach. Tumble Dry low.</div>
								</div>
								<div className="prod-attr">
										<div className="prod-attr-key p-bold-text">Brand:</div>
										<div className="prod-attr-value p-normal-text" itemprop="brand">Wilder California </div>
								</div>
						<div className="prod-attr">
								<div className="prod-attr-key p-bold-text">Material:</div>
								<div className="prod-attr-value p-normal-text">100% Polyester </div>
						</div>
						<div className="prod-attr">
								<div className="prod-attr-key p-bold-text">Color:</div>
								<div className="prod-attr-value p-normal-text" itemprop="color">Multi</div>
						</div>
						<div className="prod-attr">
								<div className="prod-attr-key p-bold-text">Measurements:</div>
								<div className="prod-attr-value p-normal-text" itemprop="height">W 16” H 16” </div>
						</div>
		</div>




</div>
												</div>
										</div>
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
