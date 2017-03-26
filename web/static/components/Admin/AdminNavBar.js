var React = require('react');
var ReactDOM = require('react-dom');
import {Nav, NavItem} from 'react-bootstrap'
var Config = require('Config')
var url = Config.serverUrl
export default class AdminNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active_key : 1
		}
	}

	componentDidMount(){	
			
	}

	handleSelect(selectedKey) {
		this.setState({active_key : selectedKey})
		if (selectedKey == 1){
			var tab = "requests"
			this.props.switchTabs(tab)	
		}
		else if (selectedKey == 2){
			var tab = "market_products"
			this.props.switchTabs(tab)
		}
	}	

	render() {

		return (
			<Nav bsStyle="pills" activeKey={this.state.active_key} onSelect={this.handleSelect.bind(this)}>
			    <NavItem eventKey={1}> Requests </NavItem>
			    <NavItem eventKey={2}> Market Product</NavItem>	
			  </Nav>
		)
	}
}

