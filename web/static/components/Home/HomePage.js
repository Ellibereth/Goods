var React = require('react');
var ReactDOM = require('react-dom');

import FeedbackModal from '../CustomerService/Feedback/FeedbackModal.js'
import HomePageMainContainer from './HomePageMainContainer.js'
import PageContainer from '../Misc/PageContainer'
import HomePageContainerMobile from './HomePageContainerMobile'




export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {
		return (
				<PageContainer no_add_buffer = {true}>
					<HomePageContainerMobile/>
					<HomePageMainContainer />
				</PageContainer>
		);
	}
}