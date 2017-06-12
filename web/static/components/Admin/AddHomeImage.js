var React = require('react');
var ReactDOM = require('react-dom');


export default class AddHomeImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			home_image_data : ""
		}
	}


	onSubmitPress(callback){
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
			callback()
		}.bind(this))
	}

	handleImageChange() {
		var input_id = "upload_home_image_input"
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
			this.setState({home_image_data : trim_image_data})
		}.bind(this)
		//fr.readAsText(file);
		fr.readAsDataURL(file);
	}

	uploadImage(){
		var data = {
			"image_data" : this.state.home_image_data,
			"jwt" : localStorage.jwt
		}
		
		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/uploadHomeImage",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal("Sorry!", "Something went wrong", "warning")
				}
				else {
					swal("Thank you!", "Image uploaded!"
						, "success")

					setTimeout(function () {location.reload()}, 500)

				}
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}	

	render() {
		return (
			<form className = "form-horizontal">
				<div className="col-sm-4">
			  		Upload New Home Image!
		  		</div>
				<input type = "file" placeholder="Image" id= "upload_home_image_input"
				 className="form-control"
				accept="image/*" 
				onChange = {() => this.handleImageChange.bind(this)()} />
				<div className = "form-group">
				<div className = "col-sm-10 col-md-10">>
					<button type = "button" className = "btn btn-default" onClick = {this.onSubmitPress.bind(this, this.uploadImage.bind(this))}>
						Submit!
					</button>
				</div>
				</div>
			</form>
		)
	}
}

