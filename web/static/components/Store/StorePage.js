var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Grid, Col, Row} from 'react-bootstrap';
import TopNavBar from '../Misc/TopNavBar.js'
import Footer from '../Misc/Footer.js'
import ReactPlayer from 'react-player'
import StoreProductPreview from './StoreProductPreview.js'


export default class StorePage extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
  		}
  	}

  	// the product id is hard coded for now
  	componentDidMount(){
	
	}

  	render() {
	  	var product_id_1 = "P5OWK2GQGTEC83YAWJF9"
	  	var product_id_2 = "XND4K7UJ9XK4GCPRVSK8"
		return (
			<div id = "store-page-container">
				<TopNavBar/>	
				<div className = "container">
					<Grid>
						<Row className="show-grid">
							<Col xs = {8} md={8}>
								<ReactPlayer
									url = "https://www.youtube.com/watch?v=0jgrCKhxE1s"
									playing
									className = "img-responsive"
							  	/>
					  		</Col>
					  		<Col xs = {4} md={4}>
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
					  		</Col>
					  	</Row>
					  	<Row className = "top-buffer row-eq-height">
					  		<Col xs = {6} s = {6} md = {6} lg= {6} 
					  		// className = "nopadding"
					  		>
					  			<StoreProductPreview product_id = {product_id_1} />
					  		</Col>

							<Col xs = {6} s = {6} md = {6} lg = {6}
							 // className = "nopadding"
							 >
								<StoreProductPreview product_id = {product_id_2} />
					  		</Col>			  	
					  	</Row>
				</Grid>				  
				</div>
				{/* <Footer/> */}
			</div>
	);
  }
}