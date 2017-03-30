var React = require('react');
var ReactDOM = require('react-dom');
import {Grid, Row, Col, Button} from 'react-bootstrap';

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
					<Col xs = {8} md={8}>
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
							<Button onClick = {this.props.toggleRequestFormModal}>
								Start a request
							</Button>        
							</center>
						</div>
					</Col>
					<Col xs = {4} md={4}>
						<div>
							<h3> Send a request </h3>
							<h3> We'll get back to you with an American selection  </h3>
							<h3> We'll talk until you're happy  </h3>
						</div>
					</Col>
				</Row>
				<hr/>
				<Row className = "show-grid">
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<h1 className="text-center"> Free </h1>
						<h3 className="text-center"> No payments necessary! </h3>
					</Col>
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<h1 className="text-center"> Fast </h1>
						<h3 className="text-center"> We'll respond within 12 hours </h3>
					</Col>
					<Col md={col_size} style = {{overflow : "hidden"}}> 
						<h1 className="text-center"> Privacy </h1>
						<h3 className="text-center"> Your information will be confidential </h3>
					</Col>
				</Row>
				<hr/>
				<Row className = "show-grid">
					<Col md={bottom_col_size} style = {{overflow : "hidden"}}> 
						<center>
							<h1> Edgar USA </h1>
							<h3> Full Store  </h3>
							<h3> Coming soon! </h3>
						</center>
					</Col>
					<Col md={bottom_col_size} style = {{overflow : "hidden"}}> 
						<div>
							<center>
								<h1> Feedback </h1>	
								<h3> Any questions or suggestions? </h3>
								<br/>
								<Button onClick = {this.props.toggleFeedbackModal}>
									Let us know!
								</Button>
							</center>
						</div>
					</Col>
				</Row>
			</Grid>
			);
	}
}