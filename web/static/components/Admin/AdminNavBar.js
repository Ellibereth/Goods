var React = require('react');
var ReactDOM = require('react-dom');
import {Nav, NavItem} from 'react-bootstrap'
var Config = require('Config')
var url = Config.serverUrl
export default class AdminNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active_key : "requests"
		}
	}

	componentDidMount(){	
			
	}

	handleSelect(selectedKey) {
		this.setState({active_key : selectedKey})
		this.props.switchTabs(selectedKey)
	}	

	render() {

		return (
			<Nav bsStyle="pills" activeKey={this.state.active_key} onSelect={this.handleSelect.bind(this)}>
			    <NavItem eventKey="requests"> Requests </NavItem>
			    <NavItem eventKey="market_products"> Market Product</NavItem>	
			  </Nav>
		)
	}
}

