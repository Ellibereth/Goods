var React = require('react');
var ReactDOM = require('react-dom');

export default class ProductExtraInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}



	render() {
		return (
			<div id="productExtraInfo" data-refreshed-section="section_product_extra_info">
				<div className="productDescExtraInfo">
					<div id="productPgMoreInfo" className="productMoreInfoInLeft">
						<div className="prodMidblock" id="prodMDWrap" style= {{"padding" : "0px 0px 15px 0px"}}>
							<div style = {{"padding-bottom" : "6px"}}>
								<span className="h3">More Details&nbsp;
								</span>
							</div>
							<div className="desc">
								<ul>
									<li><span className = "product-extra-info-bullet">Edgarric wristband with genuine leather details and lining</span></li>
									<li><span className = "">Japanese quartz movement</span></li>
									<li><span className = "product-extra-info-bullet">Metal case; stainless steel back</span></li>
									<li><span className = "product-extra-info-bullet">Water resistance: 3 ATM</span></li>
									<li><span className = "product-extra-info-bullet">Strap length: 7”</span></li>
									<li><span className = "product-extra-info-bullet">Face diameter: 36mm</span></li>
								</ul>
								<p>
									<span style= {{"fontFamily" : "'Helvetica Neue', Helvetica, Arial, Geneva, sans-serif", "fontSize " : "x-small"}}>
										<span style= {{"lineHeight" : "18px"}}>
											<br/>
											<span className = "product-extra-info-bullet">
												Each watch in the Jean-Michel Basquiat x KOMONO Collection features a band printed with a detail from one of Basquiat's works. No two watches are the same.
											</span>
											<br/>
										</span>
									</span>
								</p>
							</div>
							<div className="clear"></div>
								<ul className="tblList" id="tblListTgl">
										<li>
												<div className="half width55">
													<div className="productAttr">Designer</div>
													<div className="productAttr55Details">Jean-Michel Basquiat</div>
												</div>
												<div className="half width45">
													<div className="productAttr">Care </div>
													<div className="productAttr45Details">Spot clean.</div>
												</div>
										</li>
										<li>
												<div className="half width55">
													<div className="productAttr">Brand </div>
													<div className="productAttr55Details" itemprop="brand">KOMONO </div>
												</div>
										</li>


										<li>
											<div>
												<div className="productAttr">Color </div>
												<div className="productAttrDetails" itemprop="color">Black, White</div>
											</div>
										</li>
								</ul>
							</div>
						</div>
						<div className="designersDetailsonProductPg inLeftBlock">
							<div>
								<h2 className="designerName font20 color333 fontLtr">KOMONO</h2>
								<div className="designerImageWithProdPg float-left">
									<a target="_blank" href="/web/20140708022006/http://edgar.com:80/designer/komono/" title="More from: KOMONO">
										<img src="//web.archive.org/web/20140708022006im_/http://dnok91peocsw3.cloudfront.net/designer/32549-175x175-1381504804-pri.png" alt="KOMONO" title="KOMONO" height="112" width="112"/>
									</a>
								</div>
								<div className="float-right designerContent poRel">
									<div className="font13 color666 marginTop2 designerDescription">Founded in 2009, KOMONO is on a mission to bring the world cool, street-style accessories. Designers Anton Jassens and Raf Maes are based in Belgium, but the label has garnered a major following all over Europe, Asia, and Australia. Its line of retro-futuristic watches, sunglasses, and apparel are updated, quirkier, and more colorful versions of classNameic designs. </div>
										<a target="_blank" href="/web/20140708022006/http://edgar.com:80/designer/komono/" title="More from: KOMONO" className="font13 color666 marginTop2 designerLink">
											More from&nbsp;KOMONO<span className="dIB edgarShopSpriteNew smallRightArrow vAm"></span>
										</a>
									</div>
								</div>
						</div>



						<div className="edgarSeal round3 productPgWithSeal color666">
							<span className = "edgarSeal_icon">
								<img id = "product-edgar-flag-stamp"
								 src = "https://images-na.ssl-images-amazon.com/images/I/41iFbTFN21L._SX300_.jpg"/>
							</span>
								We guarantee that Edgar USA is authorized to sell this product and that <span style={{"color" : "#333333"}}>every brand we sell is authentic</span>.
						</div>
					</div>
					<div className="productInfoWithVideo">
						<div id="productPgMoreShippingInfo" className="shippingInfoOnTop">
								 <div className="prodMidblock" style= {{"padding" : "0 0 15px 0"}}>
									<span className="float-left h3">Shipping Info
										<i id = "product-shipping-info-truck-icon" className="fa fa-truck" aria-hidden="true"/>
									</span>
									<div className="clear"></div>
									<ul className="tblList" id="shippingDetails" style= {{"overflow" : "visible"}}>
										<li className="xmasMsgForProductPg">
											<span className="full">
										<label className="ead-label">Estimated Arrival:</label>
										<span>
											Friday, Jul. 11 to 
										<span className="eadWrapCls" style= {{"display" : "inline"}}>
											<span className="ead_zip_code" style= {{"color": "#999"}}>{" 23454,"}</span> 
												<input type="text" maxlength="7" className="ead_zip_code_input" value="19131" original="19131"/>
												<span className="ship_country" original="USA" style= {{"display" : "inline", "color" : "#999"}}>USA</span>
												<span className="eadEdit float-right colorRed" style= {{"display" :" none"}}>Edit</span>
												<span className="eadErrMsg" style= {{"display" : "none"}}>Please enter a valid zip code</span>
											</span>
										</span>
								</span>
												</li>

											<li className="noBorderTop">
													
										<span className="float-left" style= {{"lineHeight" : "18px"}}><span className="dB"><em className="redText fontNr"> Want it delivered Wednesday, July 09?</em> Order it in the next <em className="redText fontNr"> 16 hrs</em> and <em className="redText fontNr"> 40 mins</em>, and choose <em className="fontNr fontB" style= {{"color" : "#000"}}> Fastest delivery</em> at checkout. (U.S. only)</span></span>
									


											</li>
											<li>
												<span className="full">
													<label>Shipping Information</label>
													<span style= {{"display" : "inline", "paddingRight" : "4px"}}>This item is in stock and ships immediately.</span>
												</span>
											</li>
										<li>
											<span className="full">
												<label>Return Policy</label>
												<span style= {{"display" : "inline"}}>We will gladly accept returns for any reason within 30 days of receipt of delivery.</span>
											</span>
										</li>
										<li>
											<span className="full">
												<label>Availability</label>
													<span style= {{"display" : "inline"}}>Ships to U.S. and Canada</span>
											</span>
										</li>
									</ul>
								</div>
							</div>
					</div> 
			</div>
		);
	}
}
