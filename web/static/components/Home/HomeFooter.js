var React = require('react');
var ReactDOM = require('react-dom');


const footer_links = ['Smile', 'Guarantee', 'AboutFab', 'CardsMobile', 'AppsCareers', 'Blog', 'FAQs', 'Contact Us', 'Return Policy', 'Shipping', 'TermsPrivacy']
export default class HomeFooter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {

		return (
			<div id = "footer-wrapper">
				<div id = "edgar-footer">
					<ul className = "footer-links float-left">
						{footer_links.map((footer_link) => <li> <a href = "#"> {footer_link} </a> </li> )}
					</ul>
				</div>
			</div>
		);
	}
}