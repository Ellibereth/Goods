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
						<a href = "#" id = "first-badge" className = "home-badge">
							<i className="fa fa-2x fa-flag home-badge-icon"/>
							<span className = "badgehead badgetext">Made in the USA</span> <br/>
							<span className = "badgebody badgetext">We proudly only carry products that were made in the USA. To learn more about what that means and why it's important click here.</span>
						</a>
						<a href = "#" className = "home-badge">
							<i className="fa fa-2x fa-smile-o home-badge-icon"/>
							<span className = "badgehead badgetext">Meet our Vendors</span> <br/>
							<span className = "badgebody badgetext">We work with top-notch American makers and designers. Discover their stories while you shop.<br/> If you don't, we fix it. </span>
						</a>
						<a href = "#" id = "last-badge" className = "home-badge">
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
							{/* 
							<div className="top-designers section">
								<span className="section-title" style= {{"text-transform" : "none"}}>Get It First</span>
								<span className="updtdLatstArriTxt">You're just one step away from receiving fresh Happy Modern Designs and special offers in your inbox.</span>
								<form accept-charset="UTF-8" action="#" id="uBtmSignup" method="post">
									<div style= {{"margin" : "0", "padding" :"0", "display" : "inline"}}/>
									<input style = {{"display" : "inline-block"}} type="text" placeholder="Your Email"  className="inputBoxSignUpFooter borderR5 dB boxSizing"/>
									<a style = {{"marginLeft" : "12px"}} className="edgarSubmitBtn borderR3 boxSizing" id="signUpEmailCaptr">Sign Up</a>
								</form>
							</div> */}

							<div className="departments section">
							{/* <div className="departments section"> */}
								<ul>
									<li> <a href="#">About Us</a> </li>
									<li> <a href="#">FAQ</a> </li>
									<li> <a href="#">Made in the USA</a> </li>
									<li> <a href="#">All Products</a> </li>
									<li> <a href="#">Suggest Products</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section">
								<ul>
									<li> <a href="#">Contact Us</a> </li>
									<li> <a href="#">Jobs</a> </li>
									<li> <a href="#">Vendors</a> </li>
									<li> <a href="#">Sell on Edgar USA</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section">
								<ul>
									<li> <a href="#">Terms of Service</a> </li>
									<li> <a href="#">Privacy Policy</a> </li>
									<li> <a href="#">Returns</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section last-department">
								<ul>
									<li> <a href="#">Your Account</a> </li>
									<li> <a href="#">Your Cart</a> </li>
									<li> <a href="#">Your Orders</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div id = "edgar-footer">
								<ul className="socialLinks">
									<li><a href="#"><i className="fa fa-facebook fa-2x" aria-hidden="true"/></a></li>
									<li><a href="#"><i className="fa fa-twitter fa-2x" aria-hidden="true"/></a></li>
								</ul>
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