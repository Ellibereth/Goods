var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import AppStore from '../../../../stores/AppStore'
import styles from './story_template.css'



export default class StoryTemplate1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}




	render() {

		var src_story_base = "https://s3-us-west-2.amazonaws.com/storyphotos/"
		var STORY_PHOTO_SRC = src_story_base +  this.props.product.story_image_id
		var story_style = {
			backgroundImage : "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(" + STORY_PHOTO_SRC + ")",
			maxHeight : "700px",
			height : "700px",
			backgroundRepeat: "no-repeat",
			backgroundSize: "100% 100%"
		}
		
		return (
			<div className = "row" 
			//className = "story-image"
			 style = {story_style} id = "image_story">
				<div className ="col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-2 story-overlay-container">
					<div className = "panel panel-default story-panel">
						<div> 
							{this.props.product.story_text} 
						</div>
					</div>
				</div>
			</div>
		)
	}
}