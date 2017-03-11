var React = require('react');
var ReactDOM = require('react-dom');

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onTextInputChange(this.props.key, event.value)
  }

  render() {
    return (
        <div id = "nav-bar">
            <nav class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a class="navbar-brand" href="#">Remaura</a>
                </div>
                <ul class="nav navbar-nav">
                  <li><a href="/">Product Submission Form</a></li>
                  <li><a href="/requestForm">Product Request Form</a></li>
                  <li><a href="#"> Admin Tools </a></li>
                </ul>
              </div>
            </nav>
        </div>
    );
  }
}