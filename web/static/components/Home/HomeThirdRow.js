var React = require('react');
var ReactDOM = require('react-dom');
import {Row, Col} from 'react-bootstrap';
import HomePageFeedback from './HomePageFeedback.js'
import HomePageNewProduct from './HomePageNewProduct.js'

export default class HomeThirdRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_modal: false
		}
	}


	render() {
		var col_size = 6

		// first thing is the rotating carousel (for images)
		// vertical line separating these 2
		// second is feedback

		return (
				<Row className = "show-grid">
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<HomePageNewProduct />
					</Col>
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<HomePageFeedback toggleFeedbackModal = {this.props.toggleFeedbackModal}/>
					</Col>
				</Row>
			);
		}
}