var React = require('react');
var ReactDOM = require('react-dom');
import {Row, Col} from 'react-bootstrap';
import HomePageLeft from './HomePageLeft.js'
import HomePageRight from './HomePageRight.js'


export default class HomePageTopRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_modal: false
		}
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
				<Row className="show-grid">
					<Col xs = {4} xsPush ={4} md={4} mdPush={8}>
						<HomePageRight />
					</Col>
					<Col xs = {8} xsPull = {8} md={8} mdPull={4}>
						<HomePageLeft toggleRequestFormModal = {this.props.toggleRequestFormModal}/>
					</Col>
				</Row>
			);
		}
}