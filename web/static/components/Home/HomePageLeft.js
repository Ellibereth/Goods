var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap';
import RequestModal from './RequestModal.js'


export default class HomePageLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // show_modal: false
    }
  }


  render() {
    // the page left and page right are place holders for better names
    // any advice before changing would be good
    // <PageLeft />
    // <PageRight/>
    return (
        <div>
          <div id = "text-part">
              <h1> 
                Lorem Ipsum Horse **** Kramnik Fisherman Kazuma
              </h1>
          </div>
          <Button onClick = {this.props.toggleRequestFormModal.bind(this)}>
                Open the modal
          </Button>        
        </div>
    );
  }
}