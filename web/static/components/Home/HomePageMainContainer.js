var React = require('react');
var ReactDOM = require('react-dom');
import {Grid, Row, Col, Button} from 'react-bootstrap';
import StoreProductPreview from '../Store/StoreProductPreview'

export default class HomePageMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

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
		var bottom_col_size = 6

		return (
			<Grid>
				<Row className="show-grid">
					<Col xs = {12} md={12}>
						<div>
							<center>
								<div id = "text-part">	
									<h1>
										<b>
											Weekly Deals on American Made Products
										</b>
									</h1>
									
								</div>
								<br/>
							      
							</center>
						</div>
					</Col>
				</Row>
				<hr/>
				<Row className = "show-grid">
					<Col md={bottom_col_size} style = {{overflow : "hidden"}}> 
						<center>
							<h1> Let us know what you want! </h1>
							<Button onClick = {this.props.toggleFeedbackModal}>
									Tell us!
								</Button>
						</center>
					</Col>
					<Col md={bottom_col_size} style = {{overflow : "hidden"}}> 
						<div>
							<center>
								<h1>  Looking for anything right now? </h1>	
								<Button onClick = {this.props.toggleRequestFormModal}>
									Start a request
								</Button>  
							</center>
						</div>
					</Col>
				</Row>
				<hr/>
				<div className = "row">
					<div className = "col-sm-6 col-md-6 col-lg-6">
						<StoreProductPreview product_id = {1}/>
					</div>
				</div>
			</Grid>
			);
	}
}