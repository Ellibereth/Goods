var React = require('react');
var ReactDOM = require('react-dom');

import ProductRequestModal from '../Product/ProductRequest/ProductRequestModal.js'
import FeedbackModal from '../CustomerService/Feedback/FeedbackModal.js'
import HomePageMainContainer from './HomePageMainContainer.js'
import PageContainer from '../Misc/PageContainer'


export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_request_modal: false,
			show_feedback_modal: false
		}
	}

	//we make sure only one modal isopen at a time
	toggleRequestFormModal() {
		this.setState({show_feedback_modal : false})
		this.setState({show_request_modal : !this.state.show_request_modal})
	}

	toggleFeedbackModal (){
		this.setState({show_request_modal : false})
		this.setState({show_feedback_modal : !this.state.show_feedback_modal})
	} 

	render() {
		var component = (
					<HomePageMainContainer    
					toggleFeedbackModal ={this.toggleFeedbackModal.bind(this)}
					toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)}/>
				)

		return (
				<PageContainer component = {component}/>
		);
	}
}