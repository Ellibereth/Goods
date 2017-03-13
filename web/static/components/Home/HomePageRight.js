var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import RequestModal from './RequestModal.js'


export default class HomePageRight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // show_modal: false
    }
  }


  render() {
    return (
        <div>
             This is the right half of the page...an image will go here
        </div>        
    );
  }
}