var React = require('react');
var ReactDOM = require('react-dom');

import {Col, FormGroup, FormControl} from 'react-bootstrap'

export default class ProductRequestFormTextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onTextInputChange(this.props.field, event.target.value)
  }

  render() {
    var input_div = (
                    <div className ="col-sm-10">
                      <input placeholder="" id="name" className="form-control"  onChange = {this.handleChange.bind(this)} />
                    </div>
                    )
    if (this.props.field == "product_description"){
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