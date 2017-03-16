var React = require('react');
var ReactDOM = require('react-dom');
import {Row, Col} from 'react-bootstrap';


export default class HomeMiddleRow extends React.Component {
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
		var image_sources = []
		var num_images = 4
		for (var i = 0; i < 3; i ++){
			image_sources.push('../../static/images/home_page/' + i + '.png')
		}
		var col_sizes = [4,4,4]
		var col_size = 4

		return (
				<Row className = "show-grid">
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<h1 className="text-center"> Free </h1>
						<h3 className="text-center"> No payment necessary! </h3>
					</Col>
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<h1 className="text-center"> Fast </h1>
						<h3 className="text-center"> We'll get back within 12 hours </h3>
					</Col>
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<h1 className="text-center"> Private </h1>
						<h3 className="text-center"> We won't share your information </h3>
					</Col>
				</Row>
			);
		}
}