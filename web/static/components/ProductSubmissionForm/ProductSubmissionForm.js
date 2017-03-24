var React = require('react');
var ReactDOM = require('react-dom');
import ProductSubmissionTextInput from './ProductSubmissionTextInput.js'

var Config = require('Config')
var url = Config.serverUrl
const form_inputs = ['product_name', 'url_link','location','manufacturer_name','contact_information','origin', 'barcode_upc','additional_info']
const form_labels = ['Product Name', "Url Link", "Location", "Manufacturer", "Contact Information", "Origin", "Barcode Number", "Additional Information"]


export default class ProductSubmissionForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product_name : "",
			url_link : "",
			location : "",
			manufacturer_name: "",
			contact_information: "",
			origin: "",
			barcode_upc: "",
			additional_info: ""			
		}
	}


	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
	    obj[field] = value
	    this.setState(obj)
	}

	//handle the image uploads

	onSubmitPress(){
		// check if an image is submitted
		var image_div = document.getElementById('image')
		if (image_div.files.length > 0) {
			var image_file = image_div.files[0]
			var reader = new FileReader()
			reader.readAsDataURL(image_file)
			reader.onloadend = function( ){
    			var data = reader.result
    			var trim_image_data = data.split(',')[1]
    			var image_list = []
    			image_list.push(trim_image_data)
				  	var form_data = JSON.stringify({
				  		"product_name" : this.state.product_name,
				  		"url_link" : this.state.url_link,
				  		"location" : this.state.location,
				  		"manufacturer_name" : this.state.manufacturer_name ,
				  		"contact_information" : this.state.contact_information,
				  		"images" : this.state.image_list,
				  		"origin" : this.state.origin,
				  		"barcode_upc" : this.state.barcode_upc,
				  		"additional_info" : this.state.additional_info
				  	})
				  	$.ajax({
					  type: "POST",
					  url: url  + "/submitProductInformation",
					  data: form_data,
					  success: function() {
					  		window.location.reload();
					  },
					  error : function(){
					  	console.log("error")
					  },
					  dataType: "json",
					  contentType : "application/json; charset=utf-8"
					});
				}
			}

		// otherwise we submit if there is no photo
		else {
			var form_data = JSON.stringify({
				  		"product_name" : product_name,
				  		"url_link" : url_link,
				  		"location" : location,
				  		"manufacturer_name" : manufacturer_name ,
				  		"contact_information" : contact_information,
				  		"origin" : origin,
				  		"barcode_upc" : barcode_upc,
				  		"additional_info" : additional_info
				  	})
			$.ajax({
					  type: "POST",
					  url: url + "/browserSubmitInformation",
					  data: form_data,
					  success: function() {
					  		window.location.reload();
					  },
					  error : function(){
					  	console.log("error")
					  },
					  dataType: "json",
					  contentType : "application/json; charset=utf-8"
				});
		}
	}

	getTextInputs(){
		var text_inputs = []
		for (var i = 0; i < form_inputs.length; i++){
			var this_input = form_inputs[i]
			text_inputs.push(
					<ProductSubmissionTextInput
					onTextInputChange = {this.onTextInputChange.bind(this)}
					 value = {this.state[this_input]} field = {this_input} label = {form_labels[i]}/>
				)
		}
		return text_inputs
	}

	render() {
		var text_inputs = this.getTextInputs.bind(this)()

		return (
			<div> 
				<div id = "form">
						{text_inputs}
						Image:  <input type="file" accept = "image/*" id = "image"/> <br/>
						<button type="submit" id = "submit_button" onClick = {this.onSubmitPress.bind(this)}> Submit </button>
				</div>
			</div>
			)
		}
	}

