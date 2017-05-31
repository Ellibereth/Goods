var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory
import {Col, Form, FormControl, Grid, Row, FormGroup, Button} from 'react-bootstrap';

import TextInput from '../../../Input/TextInput.js'
import UploadMarketPhoto from '../ProductAdd/UploadMarketPhoto.js'
import AdminEditProductPhotos from './AdminEditProductPhotos.js' 
import UploadStoryPhoto from '../ProductAdd/UploadStoryPhoto'


export default class AdminEditImages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {	
		
		return (
			<div className = "container" id = "admin_edit_product">

				<div className = "row" id = "add_story">
					<UploadStoryPhoto product = {this.props.product}/>
				</div>
				
				
				<div className = "row" id = "image_edit">
					<UploadMarketPhoto product = {this.props.product}/>
					<AdminEditProductPhotos getProductInformation = {this.props.getProductInformation} 
						product = {this.props.product}/>
				</div>
			</div>
		)
	}
}