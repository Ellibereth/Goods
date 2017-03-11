var React = require('react');
var ReactDOM = require('react-dom');

export default class ProducSubmissionTextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onTextInputChange(this.props.key, event.value)
  }

  render() {
    return (
        <label id = {this.props.label}>
          {this.props.label} :
           <input type="text" value={this.props.value} onChange={this.handleChange.bind(this)} />
        </label>
    );
  }
}