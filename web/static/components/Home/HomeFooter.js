var React = require('react');
var ReactDOM = require('react-dom');


const footer_links = ['Smile', 'Guarantee', 'About', 'Fab', 'Cards', 'Mobile', 'Apps', 'Careers', 'Blog', 'FAQs', 'Contact Us', 'Return Policy', 'Shipping', 'Terms', 'Privacy']
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
							<span className = "badgebody badgetext">FAB PLUS Orders over $49 ship free. DESIGNER DIRECT items ship directly from our global network of designers and incur a small shipping charge.</span>
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
						<ul className = "footer-links float-left">
							{footer_links.map((footer_link) => <li> <a href = "#"> {footer_link} </a> </li> )}
						</ul>

						<div className="footerRightBlockRelatedCSS">
							<div className="footerStoreLinks float-left">
								<span className="storeName">Fab US </span>
								<i className="fa fa-chevron-circle-up fa-2x" id = "footer-language-select-icon" aria-hidden="true"/>
								
							</div>
						</div>
						<ul className="socialLinks float-right">
							<li><a href="https://web.archive.org/web/20140702093317/http://www.twitter.com/fab/" target="_blank"><i className="fa fa-facebook fa-2x" aria-hidden="true"/></a></li>
							<li><a href="https://web.archive.org/web/20140702093317/http://facebook.com/fab.com/" target="_blank"><i className="fa fa-instagram fa-2x" aria-hidden="true"/></a></li>
							<li><a href="https://web.archive.org/web/20140702093317/http://www.pinterest.com/fab/" target="_blank"><i className="fa fa-twitter fa-2x" aria-hidden="true"/></a></li>
							<li><a href="https://web.archive.org/web/20140702093317/http://instagram.com/fab" target="_blank"><i className="fa fa-pinterest fa-2x" aria-hidden="true"/></a></li>
						</ul>
						<div className = "clear"/>
					</div>

					
				</div>
				<footer>
					<div id = "dynamic-footer-wrapper">
						<div id="dynamic-footer">
							<div className="departments section">
								<span className="section-title">Departments</span>
								<ul>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/furniture/?ref=footer">Furniture</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/kitchen-dining/?ref=footer">Kitchen &amp; Dining</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/home/?ref=footer">Home</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/bed-bath/?ref=footer">Bed &amp; Bath</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/art/?ref=footer">Art</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/jewelry/?ref=footer">Jewelry</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/department/personal-accessories/?ref=footer">Personal Accessories</a>
									</li>
								</ul>
							</div>
							<div className="most-popular-categories section">
								<span className="section-title">Most Popular Categories</span>
								<ul>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/lighting/?ref=footer">Lighting</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/workspace/?ref=footer">Workspace</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/bedding/?ref=footer">Bedding</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/rugs-curtains/?ref=footer">Rugs &amp; Curtains</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/earrings/?ref=footer">Earrings</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/sofas/?ref=footer">Sofas</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/beds-mattresses/?ref=footer">Beds &amp; Mattresses</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/rings/?ref=footer">Rings</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/bracelets/?ref=footer">Bracelets</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/candles/?ref=footer">Candles</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/duvet-covers-shams/?ref=footer">Duvet Covers &amp; Shams</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/storage/?ref=footer">Storage</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/tables/?ref=footer">Tables</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/lamp-shades/?ref=footer">Lamp Shades</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/necklaces/?ref=footer">Necklaces</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/shower-curtains/?ref=footer">Shower Curtains</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/wall-decals/?ref=footer">Wall Decals</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/counter-barstools/?ref=footer">Counter &amp; Barstools</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/table-linens/?ref=footer">Table Linens</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/office-desk-chairs/?ref=footer">Office &amp; Desk Chairs</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/stools-ottomans/?ref=footer">Stools &amp; Ottomans</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/placemats/?ref=footer">Placemats</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/clocks/?ref=footer">Clocks</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/prep-tools/?ref=footer">Prep Tools</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/table-lamps/?ref=footer">Table Lamps</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/dining-tables/?ref=footer">Dining Tables</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/carpet-tiles/?ref=footer">Carpet Tiles</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/kitchen-storage-organization/?ref=footer">Kitchen Storage &amp; Organization</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/throw-pillows/?ref=footer">Throw Pillows</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/blankets-throws/?ref=footer">Blankets &amp; Throws</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/side-tables/?ref=footer">Side Tables</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/lounge-chairs/?ref=footer">Lounge Chairs</a>
									</li>
									<li>
										<a href="//web.archive.org/web/20140702093317/http://fab.com/browse/cook-prep/?ref=footer">Cook &amp; Prep</a>
									</li>
								</ul>
								</div>
								<div className="top-designers section">
									<span className="section-title" style= {{"text-transform" : "none"}}>Get It First</span>
									<span className="updtdLatstArriTxt">You're just one step away from receiving fresh Happy Modern Designs and special offers in your inbox.</span>
									<form accept-charset="UTF-8" action="https://web.archive.org/web/20140702093317/https://fab.com/login/?" id="uBtmSignup" method="post">
										<div style= {{"margin" : "0", "padding" :"0", "display" : "inline"}}/>
										<input type="text" placeholder="Your Email" autocomplete="off" name="user[email]" className="inputBoxSignUpFooter borderR5 dB boxSizing"/>
										<a className="fabSubmitBtn borderR3 boxSizing" id="signUpEmailCaptr">Sign Up</a>
									</form>
								</div>
							</div>
						</div>
				</footer>
			</div>
		);
	}
}