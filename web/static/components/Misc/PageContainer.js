var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import TopNavBar from '../Misc/TopNavBar.js'
import Footer from '../Misc/Footer.js'
import BottomNavBar from '../Misc/BottomNavBar'




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