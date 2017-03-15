var React = require('react');
var ReactDOM = require('react-dom');

export default class AdminLoginTextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onTextInputChange(this.props.field, event.target.value)
  }

  render() {
    return (
        <div id = {this.props.label}>
          <label >
            {this.props.label} :
             <input value={this.props.value} onChange={this.handleChange.bind(this)} type = {this.props.type} />
          </label>
          <br/>
        </div>
    );
  }
}