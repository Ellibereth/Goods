var React = require('react');
var ReactDOM = require('react-dom');
import {Row, Col} from 'react-bootstrap';


export default class HomePageImageRow extends React.Component {
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
		console.log(image_sources)
		var col_sizes = [4,4,4]
		var columns = col_sizes.map((col_size, index) =>
			<Col md={col_size} style = {{overflow : "hidden"}}> 
				<img className = "img-responsive" src={image_sources[index]} />
			</Col>
		)

		return (
				<Row className = "show-grid">
					{columns}
				</Row>
			);
		}
}