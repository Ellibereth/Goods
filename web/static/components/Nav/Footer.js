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
							<i className="fa fa-2x fa-truck home-badge-icon"/>
							<span className = "badgehead badgetext">Free Shipping</span> <br/>
							<span className = "badgebody badgetext">PLUS Orders over $49 ship free. DESIGNER DIRECT items ship directly from our global network of designers and incur a small shipping charge.</span>
						</a>
						<a href = "#" className = "home-badge">
							<i className="fa fa-2x fa-smile-o home-badge-icon"/>
							<span className = "badgehead badgetext">Smile Guarantee</span> <br/>
							<span className = "badgebody badgetext">We promise you'll love it. <br/> If you don't, we fix it. </span>
						</a>
						<a href = "#" id = "last-badge" className = "home-badge">
							<i className="fa fa-2x fa-gift home-badge-icon"/>
							<span className = "badgehead badgetext">Free Returns</span> <br/>
							<span className = "badgebody badgetext">
								We want you to love your purchase. If you don't, <br/>
								send it back (for free) and get your money back. <br/>
								No questions asked.
							</span>
						</a>
					</div>
				</div>
				<div id = "footer-wrapper">
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
						</div> */}
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
				<footer>
					<div id = "dynamic-footer-wrapper">
						<div id="dynamic-footer">
							<div className="top-designers section">
								<span className="section-title" style= {{"text-transform" : "none"}}>Get It First</span>
								<span className="updtdLatstArriTxt">You're just one step away from receiving fresh Happy Modern Designs and special offers in your inbox.</span>
								<form accept-charset="UTF-8" action="#" id="uBtmSignup" method="post">
									<div style= {{"margin" : "0", "padding" :"0", "display" : "inline"}}/>
									<input style = {{"display" : "inline-block"}} type="text" placeholder="Your Email"  className="inputBoxSignUpFooter borderR5 dB boxSizing"/>
									<a style = {{"marginLeft" : "12px"}} className="edgarSubmitBtn borderR3 boxSizing" id="signUpEmailCaptr">Sign Up</a>
								</form>
							</div>

							<div className="departments section">
							{/* <div className="departments section"> */}
								<span className="section-title">INFO</span>
								<ul>
									<li> <a href="#">Company</a> </li>
									<li> <a href="#">All Products</a> </li>
									<li> <a href="#">How Edgar Works</a> </li>
									<li> <a href="#">About Us</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section">
								<span className="section-title">EDGAR</span>
								<ul>
									<li> <a href="#">Edgar for Fun</a> </li>
									<li> <a href="#">Be an Edgar</a> </li>
									<li> <a href="#">Shop with Edgar</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section">
								<span className="section-title">RESOURCES</span>
								<ul>
									<li> <a href="#">Contact Us</a> </li>
									<li> <a href="#">Press Room</a> </li>
									<li> <a href="#">FAQ</a> </li>
									<li> <a href="#">Hot Products</a> </li>
									<li> <a href="#"></a> </li>
								</ul>
							</div>
							<div className="departments section last-department">
								<span className="section-title">QUICK LINKS</span>
								<ul>
									<li> <a href="#">Terms of Service</a> </li>
									<li> <a href="#">Privacy Policy</a> </li>
									<li> <a href="#">Affiliates</a> </li>
									<li> <a href="#"></a> </li>
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