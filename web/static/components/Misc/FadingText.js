var React = require('react');
var ReactDOM = require('react-dom');

export default class FadingText extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		}
	}


	// add props for color, and speed of transitions

	render() {
		var show_class_name = this.props.show ? " fading-text-shown " : " fading-text-hidden "
		var height_transition_class = this.props.height_transition ? " height-transition " : " "
		return (
			<div className = {show_class_name + height_transition_class}>
				{this.props.children}
			</div>
		);
	}
}