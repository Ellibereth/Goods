var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import AdminProductMainContainer from './AdminProductMainContainer.js'
import TopNavBar from '../../../Misc/TopNavBar.js'
import Footer from '../../../Misc/Footer.js'




export default class AdminEditProductPage extends React.Component {
  constructor(props) {
	super(props);
	this.state = {

	}
  }


  render() {
	return (
		<div>
			  <TopNavBar/>
			  <AdminProductMainContainer  product_id = {this.props.params.product_id}/>
			 {/*  <Footer/> */}
		</div>
	);
  }
}