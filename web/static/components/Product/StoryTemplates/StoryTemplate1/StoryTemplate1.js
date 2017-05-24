var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import AppStore from '../../../../stores/AppStore'



export default class StoryTemplate1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			height : 0,
			width : 0

		}
	}

	componentWillReceiveProps(nextProps){
		var that = this;
		var img = new Image();
		img.onload = function() {
			that.setState({
				height: this.height,
				width: this.width
			})
		}
		var STORY_PHOTO_SRC = src_story_base +  nextProps.product.story_image_id
		img.src = STORY_PHOTO_SRC;

	}

	componentDidMount(){
		var that = this;
		var img = new Image();
		img.onload = function() {
			that.setState({
				height: this.height,
				width: this.width
			})
		}
		var src_story_base = "https://s3-us-west-2.amazonaws.com/storyphotos/"
		var STORY_PHOTO_SRC = src_story_base +  this.props.product.story_image_id
		img.src = STORY_PHOTO_SRC;
	}




	render() {
		var height = this.state.height
		var width = this.state.width
		// console.log(this.state.height)
		if (height != 0) {
			var ratio = height / width
			var story_text = (
					<div className = "panel panel-default story-panel">
						<div> 
							{this.props.product.story_text} 
						</div>
					</div>
				)
		}
		else {
			var ratio = 0
			var story_text = <div/>
		}
		var row_width = $("#image_story").width()
		var row_height = Math.floor(row_width * ratio)
		var src_story_base = "https://s3-us-west-2.amazonaws.com/storyphotos/"
		var STORY_PHOTO_SRC = src_story_base +  this.props.product.story_image_id
		var story_style = {
			backgroundImage : "url(" + STORY_PHOTO_SRC + ")",
			backgroundRepeat: "no-repeat",
			backgroundSize: "100% 100%",
			height: "700px"
		}
		
		

		return (
			<div className = "row story-image" 
			//className = "story-image"
			 style = {story_style} id = "image_story">
				<div className ="col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-2 story-overlay-container">
					{story_text}
				</div>
			</div>
		)
	}
}