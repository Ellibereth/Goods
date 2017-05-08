var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import TopNavBar from '../Nav/TopNavBar.js'
import Footer from '../Nav/Footer.js'
// import BottomNavBar from '../Nav/BottomNavBar'




export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}





	render() {
		return (
				<div>
					<TopNavBar/>
						{this.props.component}
					<Footer/>
				</div>
		);
	}
}