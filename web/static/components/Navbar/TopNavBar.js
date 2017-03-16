var React = require('react');
var ReactDOM = require('react-dom');
import { Navbar, Nav, NavItem} from 'react-bootstrap';
var Link = require('react-router').Link;

export default class TopNavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.props.onTextInputChange(this.props.key, event.value)
  }

  render() {
    return (
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Remaura</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem eventKey={1}> <Link to="/">Sign In</Link> </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
    );
  }
}