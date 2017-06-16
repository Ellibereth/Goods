var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from './PageContainer'


export default class PrivacyPolicyPage extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  // show_modal: false
	}
  }


  render() {
	var component = (
			<div className = "container">
				<div style = {{"font-size" : "36px"}}> <b> Privacy Policy </b> </div>
				<div> Last Updated: June 16, 2017 </div>
				<br/>

				<div style = {{"font-size" : "24px"}}> <b>  Privacy Policy Scope </b> </div>
				<div> This Privacy Policy identifies and describes the way Edgar USA uses and protects the information we collect about users. </div>
				<br/>

				<div style = {{"font-size" : "24px"}}> <b> Information We Collect and How We Collect It. </b> </div>
				<div> We collect information automatically when you visit our website and use our products and services.  Information can be directly provided by you and can be collected by automated means. </div>
				<div>
					You provide information to us when you interact with our website, 
					including when you join our mailing list, create an account, place an order, 
					contact us (via email, telephone, or otherwise), respond to a survey or questionnaire, 
					or enter any other promotion sponsored by us. The information you provide to us may include:
				</div>
					<ul>	
						<li> Your contact and shipping information, such as your name, address, telephone number, and email address; </li>
						<li> Your payment information (for example, credit card, banking and/or payment details, banking and your billing address); </li>
						<li> The shipping information (such as names, shipping addresses, and telephone numbers) for anyone to whom you want us to ship your purchases. </li>
					</ul>

				<div> 
					We may collect information by automated means with technologies such as cookies, Web server logs, and user behavior. 
					We may tie this information to information about you that we collect from other sources or that you provide us.  
					We use third-party Web analytics services, such as those of Google Analytics and Atlas, to help us analyze how you use our site. 
					These service providers use cookies and other automated technologies to collect information about you when you visit our site. 
					Learn about Google Analytics and its opt-out choices <a href = "https://tools.google.com/dlpage/gaoptout">here</a>.
				</div>

				<br/>
				<div style = {{"font-size" : "24px"}}> <b>  How We Use Your Information </b> </div>
				<div> We use the information you provide to us and information that we collect from you in a variety of ways, including to: </div>
					<ul>
						<li> Provide you with the best user experience possible; </li>
						<li> Process, evaluate, and respond to your requests and inquiries; </li>
						<li> Create, administer, and communicate with you about your account; </li>
						<li> Communicate with you about our and our retail partner’s product, services, offers, and promotions; </li>
						<li> Tailor and deliver customized content that you may see on our site;</li>
						<li> Operate, evaluate, and improve our business, products and services;</li>
						<li> Verify your identity and protect against fraud, unauthorized transactions, claims, and other liabilities; </li>
						<li> Comply with applicable laws, regulations and industry standards and enforce our rights under our Terms of Service; </li>
						<li> Notify you about changes to the website, this Privacy Policy and our Terms of Service. </li>

					</ul>
				
				<div style = {{"font-size" : "24px"}}> <b> How We Share Your Information </b> </div>

				<div> 
					When you complete a purchase on our website, we may share your submitted 
					shipping address, phone number, name, and email for shipping purposes only.  
					This information is shared with the entities fulfilling and shipping your 
					order, such as the merchant and the shipping provider.
				</div>

				<div> Additionally, we may provide personal information to third parties for purposes such as: </div>
					<ul>
						<li> Responding to 911 calls and other emergencies; </li>
						<li> Complying with court orders and other legal process; </li>
						<li> To assist with the identify verification, and to prevent fraud and identity threat; </li>
						<li> Enforcing our agreements and property rights. </li>
					</ul>

				<div style = {{"font-size" : "24px"}}> <b> How We Safeguard Your Information </b> </div>
					<ul>
						<li> We do not sell your Personal Information to anyone for any purpose;  </li>
						<li> We maintain information about you in our business records while you are a user, or until it is no longer needed for business, tax, or legal purposes; </li>
						<li> We have implemented encryption or other appropriate security controls to protect Personal Information when stored or transmitted by Edgar USA; </li>
						<li> 
							We require non-Edgar USA companies acting on our behalf to protect any Personal 
							Information they may receive in a manner consistent with this Policy. 
							We do not allow them to use such information for any other purpose.
						</li>	
					</ul>

				<div style = {{"font-size" : "24px"}}> <b> Links to/from Other Websites and Online Services </b> </div>
				<div>
				 	We are not responsible for the practices employed by websites linked to or from our website, 
					nor the information or content contained therein. Please remember that when you use a link to go 
					from our website to another website, our Privacy Policy is no longer in effect. 
					Your browsing and interaction on any other website, including those that have a link
					on our website, is subject to that website’s own rules and policies. 
					Please read over those rules and policies before proceeding.
				</div>

				<br/>
				<div style = {{"font-size" : "24px"}}> 
					<b> Updates to Our Privacy Policy </b>
				</div>

				<div>
					If we change our privacy policies and procedures, we will post those changes on 
					our website to keep you aware of what information we collect, how we use it and 
					under what circumstances we may disclose it.
					Changes to this Privacy Policy are effective when they are posted on this page.
				</div>


				<br/>
				<div style = {{"font-size" : "24px"}}> <b> Your California Privacy Rights  </b> </div>
				<div>
					California Civil Code Section 1798.83 entitles California customers to request 
					information concerning whether a business has disclosed Personal Information to 
					any third parties for the third parties' direct marketing purposes. 
					As stated in this Privacy Policy, we will not sell or share your Personal Information 
					with any third party for their direct marketing purposes without your consent. 
					California customers who wish to request further information about our compliance 
					with this law or have questions or concerns about our privacy practices and policies 
					may contact us at privacy@edgarusa.com or write to us at 
					Edgar USA Privacy Policy, 27 Woodfield Lane, Saddle River NJ, 07458.
				</div>

			</div>
		)
	return (
		<PageContainer component = {component} />
	);
  }
}