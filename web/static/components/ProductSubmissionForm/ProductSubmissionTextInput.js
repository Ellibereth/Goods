var React = require('react');
var ReactDOM = require('react-dom');

export default class ProductRequestFormTextInput extends React.Component {
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
             <input value={this.props.value} onChange={this.handleChange.bind(this)} />
          </label>
          <br/>
        </div>
    );
  }
}