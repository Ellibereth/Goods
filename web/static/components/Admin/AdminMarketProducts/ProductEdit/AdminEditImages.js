var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory

import TextInput from '../../../Input/TextInput.js'
import UploadMarketPhoto from '../ProductAdd/UploadMarketPhoto.js'
import AdminEditProductPhotos from './AdminEditProductPhotos.js' 
import UploadManufacturerLogo from '../ProductAdd/UploadManufacturerLogo'

export default class AdminEditImages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {	
		
		return (
			<div className = "container" id = "admin_edit_product">


				{/* <div className = "row" id = "add_logo">
					<UploadManufacturerLogo product = {this.props.product}/>
				</div> */}
				
				
				<div className = "row" id = "image_edit">
					<UploadMarketPhoto getProductInformation = {this.props.getProductInformation} 
					 product = {this.props.product}/>
					<AdminEditProductPhotos getProductInformation = {this.props.getProductInformation} 
						product = {this.props.product}/>
				</div>
			</div>
		)
	}
}