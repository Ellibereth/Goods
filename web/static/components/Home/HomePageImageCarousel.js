var React = require('react');
var ReactDOM = require('react-dom');



var base_url = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/"
const image_names = ["1.jpg","2.jpg","3.jpg"]

export default class HomePageImageCarousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {
		var images = image_names.map((image_name, index) =>
				<div className= {index == 0 ? "item active" : "item"}>
		            <img src= {base_url + image_name} index = {index}/>
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
				        {images}
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