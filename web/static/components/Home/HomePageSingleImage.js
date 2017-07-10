var React = require('react');
var ReactDOM = require('react-dom');
var base_url = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/"


// temporary hard coded image
const img_src = "https://web.archive.org/web/20140702093505im_/http://dnok91peocsw3.cloudfront.net/promotions/p1/3236-778x546-1403879303.png"

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
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'getPublicHomeImages',
				});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		var images = this.state.images
		if (images[0]) {
			return  <img onClick = {() => window.location = '/sales'}
			 className = "home-single-image center-block"
			 // src= {base_url + images[0].image_id}
			 src = {img_src}/>
		}
		else {
			return <div/>
		}

		return (
			<div/>
		);
	}
}