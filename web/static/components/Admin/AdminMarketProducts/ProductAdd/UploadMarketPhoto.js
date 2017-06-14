var React = require('react');
var ReactDOM = require('react-dom');


export default class UploadMarketPhoto extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image_data : ""
		}
	}


	onSubmitPress(){
		swal({
		  title: "ARE YOU SURE?",
		  text: "ONCE YOU HIT OKAY, THIS CHANGE WILL BE SEEN LIVE",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.uploadImage.bind(this)()
		}.bind(this))
	}
	handleImageChange(product_id) {
		var input_id = product_id + "_upload"
		// tried jquery but got a little messed up
		// also couldn't figure out how to use states to do it
		// with event.target.value just got the URL and couldn't get image data from it
		var file = document.getElementById(input_id).files[0];
		var fr = new FileReader();
		fr.onload = function(e){
			var data = e.target.result
			// we trim this to get just the image data
			// not the headers 
    		var trim_image_data = data.split(',')[1]
			this.setState({image_data : trim_image_data})
		}.bind(this)
		//fr.readAsText(file);
		fr.readAsDataURL(file);
	}

	uploadImage(){
			var data = {
				"image_data" : this.state.image_data,
				"product_id" : this.props.product.product_id,
				"jwt" : localStorage.jwt
			}
			
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/uploadMarketProductImage",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong", "warning")
					}
					else {
						swal("Thank you!", "Image uploaded!"
							, "success")
					}
				}.bind(this),
				error : function(){
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	render() {
		var product = this.props.product
		return (
			<form className = "form-horizontal">
				<div className="col-sm-4">
			  		Upload a product photo!
		  		</div>
				<input type = "file" placeholder="Image" id= {product.product_id + "_upload"} className="form-control"
				accept="image/*" 
				onChange = {() => this.handleImageChange.bind(this)(product.product_id)} />
				<div className = "form-group">
				<div className = "col-sm-10 col-md-10">
					<button type = "button" className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
						Submit!
					</button>
				</div>
				</div>
			</form>
		)
	}
}

