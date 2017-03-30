var React = require('react');
var ReactDOM = require('react-dom');

import {} from 'react-bootstrap';
import ProductRequestModal from '../Product/ProductRequest/ProductRequestModal.js'
import FeedbackModal from '../CustomerService/Feedback/FeedbackModal.js'
import HomePageMainContainer from './HomePageMainContainer.js'
import TopNavBar from '../Misc/TopNavBar.js'
import Footer from '../Misc/Footer.js'

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
    console.log("pressed")
    this.setState({show_request_modal : false})
    this.setState({show_feedback_modal : !this.state.show_feedback_modal})
  } 

  render() {
    return (
        <div id = "home-page-container">
              <TopNavBar/>
              <HomePageMainContainer toggleFeedbackModal ={this.toggleFeedbackModal.bind(this)}
              toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)}/>
             {/*  <Footer/> */}
              <ProductRequestModal show = {this.state.show_request_modal} toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)} />
              <FeedbackModal show = {this.state.show_feedback_modal} toggleFeedbackModal = {this.toggleFeedbackModal.bind(this)}/>
        </div>
    );
  }
}