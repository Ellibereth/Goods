var React = require('react');
var ReactDOM = require('react-dom');
var base_url = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/"


// temporary hard coded image
const img_src = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/banner.png"



export default class HomePageImageCarousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	render() {
		return  (
			<img onClick = {() => window.location = '/sales'}
			 className = "home-single-image center-block"
			 src = {img_src}/>
		)
		
	}
}