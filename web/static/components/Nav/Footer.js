var React = require('react');
var ReactDOM = require('react-dom');

const footer_links = ['Smile', 'Guarantee', 'About', 'Edgar', 'Cards', 'Mobile', 'Apps']
// , 'Careers', 'Blog', 'FAQs', 'Contact Us', 'Return Policy', 'Shipping', 'Terms', 'Privacy']
export default class HomeFooter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {





		return (
			<div className = "page-wrapper"> 
				<div id = "footer-badge-wrapper">
					<div id = "edgar-footer-badges">
						<a href = "#/" id = "first-badge" className = "home-badge">
							<span>
								<img className = "home-badge-icon home-badge-flag" src = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/flag.png"/>
							</span>
							<span className = "badgehead badgetext">Made in the USA</span> <br/>
							<span className = "badgebody badgetext">We proudly only carry products that were made in the USA. <br/> To learn more about what that means and why it's important <a className = "badgetext-link" href = "/usa">click here</a>.</span>
						</a>
						<a href = "#/" className = "home-badge">
							<i className="fa fa-2x fa-smile-o home-badge-icon"/>
							<span className = "badgehead badgetext">Meet our Vendors</span> <br/>
							<span className = "badgebody badgetext">We work with top-notch American makers and designers. Discover their stories while you shop.</span>
						</a>
						<a href = "#/" id = "last-badge" className = "home-badge">
							<i className="fa fa-2x fa-thumbs-up home-badge-icon"/>
							<span className = "badgehead badgetext">Quality Guaranteed</span> <br/>
							<span className = "badgebody badgetext">
								We only see the highest quality products. Not satisfied with your purchase? We'll fix it.
							</span>
						</a>
					</div>
				</div>
				{/* <div id = "footer-wrapper">
					<div id = "edgar-footer">
						

						{/*
							


							<ul className = "footer-links float-left">
							{footer_links.map((footer_link) => <li> <a href = "#"> {footer_link} </a> </li> )}
						</ul>

						 <div className="footerRightBlockRelatedCSS">
							<div className="footerStoreLinks float-left">
								<span className="storeName">Edgar US </span>
								<i className="fa fa-chevron-circle-up fa-2x" id = "footer-language-select-icon" aria-hidden="true"/>
								
							</div>
						</div> 
						<ul className="socialLinks">
							<li><a href="#"><i className="fa fa-facebook fa-3x" aria-hidden="true"/></a></li>
							<li><a href="#"><i className="fa fa-instagram fa-3x" aria-hidden="true"/></a></li>
							<li><a href="#"><i className="fa fa-twitter fa-3x" aria-hidden="true"/></a></li>
							<li><a href="#"><i className="fa fa-pinterest fa-3x" aria-hidden="true"/></a></li>
						</ul>

						<ul className="socialLinks">
							{footer_links.map((footer_link) => <li> <a href = "#"> {footer_link} </a> </li> )}
						</ul>
						<div className = "clear"/>
					</div>
				</div>
				*/}
				<footer>
					<div id = "dynamic-footer-wrapper">
						<div id="dynamic-footer">
							

							<div className="departments section">
							{/* <div className="departments section"> */}
								<ul>
									<li> <a href="/about">About Us</a> </li>
									<li> <a href="/faq">FAQ</a> </li>
									<li> <a href="/usa">Made in the USA</a> </li>
									<li> <a href="/suggestProduct">Suggest Products</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section">
								<ul>
									<li> <a href="/contact">Contact Us</a> </li>
									<li> <a href="/careers">Careers</a> </li>
									<li> <a href="/vendors">Vendors</a> </li>
									<li> <a href="/sellWithEdgar">Sell on Edgar USA</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section">
								<ul>
									<li> <a href="/terms">Terms of Service</a> </li>
									<li> <a href="/privacy">Privacy Policy</a> </li>
									<li> <a href="/returnPolicy">Returns</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section last-department">
								<ul>
									<li> <a href="/settings">Your Account</a> </li>
									<li> <a href="/myCart">Your Cart</a> </li>
									<li> <a href="/myOrders">Your Orders</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>

							

							<div id = "edgar-footer">
								<ul className="socialLinks">
									<li><a href="#"><i className="fa fa-facebook fa-2x" aria-hidden="true"/></a></li>
									<li><a href="#"><i className="fa fa-twitter fa-2x" aria-hidden="true"/></a></li>
								</ul>
							</div>

							<div className="top-designers section">
								<span className="section-title" style= {{"text-transform" : "none"}}>Opening Special!</span>
								<span className="updtdLatstArriTxt">
									Get 10% off for your first month!*
								</span> 

								<span className = "special-notice-text">
									New customers only. Offer lasts first 30 days. See details <a href = "#">here</a>
								</span>
							</div> 

							{/* <div className="most-popular-categories section">
								
								<span className="section-title">Most Popular Categories</span>
								<ul>
									<li>
										<a href="#">Lighting</a>
									</li>
								</ul>
							</div> */}
							
							
						</div>
					</div>
				</footer>
			</div>
		);
	}
}