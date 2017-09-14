var React = require('react')
var ReactDOM = require('react-dom')

export default class AdminTextInput extends React.Component {
	constructor(props) {
		super(props)
	}

	handleChange(event) {
		this.props.onTextInputChange(this.props.field, event.target.value)
	}

	render() {
		var input_type = this.props.input_type ? this.props.input_type : 'text'
		var input_div = (
			<div className = "col-md-8 col-lg-8">
				<input placeholder="" id= {this.props.field} type = {input_type} tabindex = {this.props.index}
						 className="form-control" value = {this.props.value}    onChange = {this.handleChange.bind(this)}
						 onKeyPress = {this.props.onKeyPress && this.props.onKeyPress}
				/>
			</div>
		)
		if (input_type == 'textarea'){
			input_div = (
				<div className="col-sm-12">
					<textarea placeholder="" value = {this.props.value} id="name" rows = "12" className="form-control" onChange = {this.handleChange.bind(this)} />
				</div>
			)
		}

		// var class_name = this.props.required ? "form-group required" : "form-group"
		return (
			<div className="form-group row">
				<label className="col-md-2 col-lg-2 col-form-label">
					{this.props.label} 
				</label>
				{input_div}
			</div>
		)
	}
}