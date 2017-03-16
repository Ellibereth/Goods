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
		return (
			<div>
				<center>
				<div id = "text-part">	
				  		<h1>
				  			<b>
								It can be hard to buy American
							</b>
						</h1>
						<h3>
							Find the things you want,
						<br/>
							at the prices you want
						</h3>
				</div>
				<br/>
				<Button onClick = {this.props.toggleRequestFormModal.bind(this)}>
					Start a request
				</Button>        
				</center>
			</div>
		);
	}
}