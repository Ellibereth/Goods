var React = require('react');
var ReactDOM = require('react-dom');

import ProductRequestModal from '../Product/ProductRequest/ProductRequestModal.js'
import FeedbackModal from '../CustomerService/Feedback/FeedbackModal.js'
import HomePageMainContainer from './HomePageMainContainer.js'
import PageContainer from '../Misc/PageContainer'

import HomeNavBar from './HomeNavBar'

import HomeFooter from './HomeFooter'

const fab_logo = "https://web.archive.org/web/20140713231906im_/http://dnok91peocsw3.cloudfront.net/relaunch/fab_2_0_logo.png"


export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {

		return (
				<div>
					<div className = "page-top-row">
						<div className = "page-wrapper">
							<div className = "top-row-inner">
								<span className = "top-row-text"> Free Shipping. Free Returns. Smiles Guaranteed.</span>
								<span className = "top-row-text float-right"> 
									<span className = "glyphicon glyphicon-envelope top-row-envelope-icon"/>
								 	<span>Email Us</span>
								</span>
							</div>
						</div>
					</div>
					<div className = "page-wrapper">
						<HomeNavBar />
						<div className = "content-wrapper"> 

							<HomePageMainContainer />
						</div>
					</div>
					<div className = "top-buffer"/>
					<HomeFooter />
					<div className = "top-buffer"/>
				</div>
		);
	}
}