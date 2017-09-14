var React = require('react')
var ReactDOM = require('react-dom')
var browserHistory = require('react-router').browserHistory
import AppActions from '../../actions/AppActions'
import AddHomeImage from './AddHomeImage'
import HomeImageDisplay from './HomeImageDisplay'
import Button from 'react-bootstrap/lib/Button'

import {AlertMessages} from '../Misc/AlertMessages'

export default class AdminLoginPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			home_images: []	
		}
	}


	componentDidMount() {
		this.getHomeImages.bind(this)()		
	}

	getHomeImages (){
		var data = {
			'jwt' : localStorage.jwt
		}
		
		var form_data = JSON.stringify(data)
		$.ajax({
			type: 'POST',
			url: '/getHomeImages',
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal(AlertMessages.INTERNAL_SERVER_ERROR)
				}
				else {
					this.setState({home_images : data.images})
				}
			}.bind(this),
			error : function(){
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	render() {
		var home_images = this.state.home_images
		var home_images_display = home_images.map((home_image, index) => 
			<HomeImageDisplay home_image = {home_image}/>
		)

		return (
			<div> 
				<div> Home Page Tab..This is a WIP just needs styling</div>
				<div className = "top-buffer"/>
				<AddHomeImage />

				<hr/>

				{home_images_display}

			</div>
		)
	}
}