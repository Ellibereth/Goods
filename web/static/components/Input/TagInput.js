var React = require('react');
var ReactDOM = require('react-dom');

import TagsInput from 'react-tagsinput'

export default class TextInput extends React.Component {
	constructor(props) {
		super(props);
	}

	handleChange(event) {
		var value = $("#tag_input").tagsinput('items')['itemsArray']
		this.props.onTagInputChange(this.props.field, value)
	}

	render() {
		return (
			<div className="form-group">
				<div className="col-sm-10">
					{this.props.label}
				</div>
				<div className ="col-sm-10">
					<TagsInput value={this.state.tags} onChange={this.handleChange.bind(this)}/>
				</div>
			</div>
		);
	}
}