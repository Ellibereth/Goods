var React = require('react');
var ReactDOM = require('react-dom');

export default class FadingText extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		}
	}


	render() {
		var class_name = this.props.show ? " fading-text-shown " : " fading-text-hidden "
		return (
			<div className = {class_name}>
				{this.props.children}
			</div>
		);
	}
}