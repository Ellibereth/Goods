var React = require('react');
var ReactDOM = require('react-dom');


import AdminTextInput from '../Input/AdminTextInput'
import Button from 'react-bootstrap/lib/Button'

const base_url = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/"
import {AlertMessages} from '../Misc/AlertMessages'

export default class HomeImageDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image_text : "",
			live : false

		}
	}

	componentDidMount(){
		this.setState({
			image_text : this.props.home_image.image_text,
			live : this.props.home_image.live
		})
	}

	onInputChange(field, value){
		var obj = this.state
		obj[field] = value
		this.setState(obj)
	}

	onUpdatePress(){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
			function (isConfirm) {
				if(isConfirm){
					this.updateHomeImage.bind(this)()
				}
		}.bind(this))
	}

	updateHomeImage() {
		var data = {
			"jwt" : localStorage.jwt,
			"image_id" : this.props.home_image.image_id,
			"image_text" : this.state.image_text,
			"live" : this.state.live
		}
		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/updateHomeImage",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					location.reload()
				}
				else {
					location.reload()
				}
			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'updateHomeImage',
					});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	// 1. Show the image
	// 2 allow us to edit the image
	// 		a. Set live or not live
	// 		b. Edit the text

	render() {
		return (
			<div className = "panel panel-default">
				<div className = "top-buffer"/>
				
				<img src = {base_url + this.props.home_image.image_id}
					style = {{"width" : "100px", "height" : "100px"}}/>

				<hr/>

				<AdminTextInput onTextInputChange = {this.onInputChange.bind(this)}
				field = {"image_text"}
				value = {this.state.image_text} 
				label = {"Image Text"}
				input_type = "textarea"
				/>

				<hr/>

				<div className="form-group row">
					<label className="col-md-2 col-lg-2 col-form-label">
						Would you like this image to show up on the home page?
					</label>
					<div className = "col-md-6 col-lg-6">
					 	<select className="form-control" id="sel1" 
					 	value = {this.state.live ? this.state.live : false}
					 	onChange = {(event) => this.onInputChange("live", event.target.value)}>
					 		<option value = {true}> Live </option>
    						<option value = {false}> Not Live </option>
					 	</select>
					</div>
				</div>

				<hr/>

				<div className = "row">
					<Button onClick = {this.onUpdatePress.bind(this)}> Update </Button>
				</div>		

			</div>
		)
	}
}

