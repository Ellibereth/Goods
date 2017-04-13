var React = require('react');
var ReactDOM = require('react-dom');

import {Col, FormGroup, FormControl} from 'react-bootstrap'

export default class TextInput extends React.Component {
  constructor(props) {
	super(props);
  }

  handleChange(event) {
	this.props.onTextInputChange(this.props.field, event.target.value)
  }

  render() {
  	var colSize = this.props.colSize ? this.props.colSize : "8"
	var input_type = this.props.input_type ? this.props.input_type : "text"
	console.log(input_type)
	var input_div = (
					<div className = {"col-sm-" + colSize}>
					  <input placeholder="" id="name" type = {input_type}
					   className="form-control" value = {this.props.value}  onChange = {this.handleChange.bind(this)} />
					</div>
					)
	if (input_type == "textarea"){
		input_div = (
		  <div className="col-sm-12">
			  <textarea placeholder="" id="name" rows = "12" className="form-control" onChange = {this.handleChange.bind(this)} />
		  </div>
		  )
	}
	return (
	  <div className="form-group">
		  <div className="col-sm-10">
			  {this.props.label}
		  </div>
		  {input_div}
	  </div>
	);
  }
}