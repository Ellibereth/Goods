var React = require('react');
var ReactDOM = require('react-dom');

var real_url = "https://whereisitmade.herokuapp.com"
var test_url = "http://0.0.0.0:5000"
const inputs = ['product_name', 'url_link','location','manufacturer_name','contact_information','origin', 'barcode_upc','additional_info']
import ProductSubmissionTextInput from './ProductSubmissionTextInput'


export default class SubmissionForm extends React.Component {
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
	onTextInputChange(key, value){
		this.setState({key, value})
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
				  	var formData = JSON.stringify({
				  		"product_name" : product_name,
				  		"url_link" : url_link,
				  		"location" : location,
				  		"manufacturer_name" : manufacturer_name ,
				  		"contact_information" : contact_information,
				  		"images" : image_list,
				  		"origin" : origin,
				  		"barcode_upc" : barcode_upc,
				  		"additional_info" : additional_info

				  	})
				  	$.ajax({
					  type: "POST",
					  url: real_url  + "/userSubmitProductInformation",
					  data: formData,
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
			var formData = JSON.stringify({
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
					  url: real_url + "/browserSubmitInformation",
					  data: formData,
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
	render() {
		return (
			<div> 
				<a href = "/adminLogin">  Click here for admin login </a>
				<div id = "form">
						<ProductSubmissionTextInput value = {this.state["product_name"]} key = "product_name" label = "Product Name"/>
						Manufacturer Name:  <input type="text" id = "manufacturer_name"/><br/>
						Location:  <input type="text" id = "location"/><br/>
						Url Link:  <input type="text" id = "url_link"/><br/>
						Contact Information:  <input type="text" id = "contact_information"/><br/>
						Origin:  <input type="text" id = "origin"/><br/>
						Additional Info:  <input type="text" id = "additional_info"/><br/>
						Barcode UPC:  <input type="text" id = "barcode_upc"/><br/>
						Image:  <input type="file" accept = "image/*" id = "image"/> <br/>
						<button type="submit" id = "submit_button"> Submit </button>
				</div>
			</div>
			)
		}
	}

