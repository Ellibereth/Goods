var React = require('react');
var ReactDOM = require('react-dom');



var base_url = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/"
const image_names = ["1.jpg","2.jpg","3.jpg"]

export default class HomePageImageCarousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			images  : []
		}
	}



	componentDidMount(){
		$.ajax({
			type: "POST",
			url: "/getPublicHomeImages",
			success: function(data) {
				if (data.success) {
					this.setState({images : data.images})
				}
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	generateImageText(image_text) {
		var splits = image_text.split('\n')
		var rows = splits.map((line) =>
				<span className = "block-span"> {line} </span>
			)
		return <h3> {rows} </h3>
	}



	render() {
		var images = this.state.images
		var image_display = images.map((image, index) =>
				<div className= {index == 0 ? "item active" : "item"}>
					<img className = "home-images center-block" src= {base_url + image.image_id} index = {index}/>
					<div className="home-carousel-text-container">
						<div className="carousel-caption">
							{this.generateImageText(image.image_text)}
						</div>
					</div>
				</div>
			)

		return (
				<div id="myCarousel" className="carousel slide home-image-carousel" data-ride="carousel">
					<ol className="carousel-indicators">
						<li data-target="#myCarousel" data-slide-to="0" className="active"></li>
						<li data-target="#myCarousel" data-slide-to="1"></li>
						<li data-target="#myCarousel" data-slide-to="2"></li>
					</ol>

					<div className="carousel-inner">
						{image_display}
					</div>

					<a className="left carousel-control" href="#myCarousel" data-slide="prev">
						<span className="glyphicon glyphicon-chevron-left"></span>
						<span className="sr-only">Previous</span>
					</a>
					<a className="right carousel-control" href="#myCarousel" data-slide="next">
						<span className="glyphicon glyphicon-chevron-right"></span>
						<span className="sr-only">Next</span>
					</a>
				</div>
		);
	}
}