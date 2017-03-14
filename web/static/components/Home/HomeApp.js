var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import RequestModal from './RequestModal.js'
import HomePageMainContainer from './HomePageMainContainer.js'
import TopNavBar from '../Navbar/TopNavBar.js'
import Footer from '../Misc/Footer.js'



export default class HomeApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_modal: false
    }
  }

  toggleRequestFormModal() {
    this.setState({show_modal : !this.state.show_modal})
  }



  render() {

    return (
        <div id = "home-page-container">
              <TopNavBar/>
              <HomePageMainContainer toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)}/>
              <Footer/>
              <RequestModal show = {this.state.show_modal} toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)} />
        </div>
    );
  }
}