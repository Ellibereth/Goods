var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import RequestModal from './RequestModal.js'
import HomePageMainContainer from './HomePageMainContainer.js'
import TopNavBar from '../Navbar/TopNavBar.js'


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
        <div id = "home_page_container">
              <TopNavBar/>
              <HomePageMainContainer toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)}/>
              <RequestModal show = {this.state.show_modal} toggleRequestFormModal = {this.toggleRequestFormModal.bind(this)} />
        </div>
    );
  }
}