var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Nav, NavItem} from 'react-bootstrap'

export default class AdminTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){	
			
	}

	handleSelect(selectedKey) {
		this.props.switchTabs(selectedKey)
	}	

	render() {

		return (
			<Nav bsStyle="pills" activeKey={this.props.selectedTab} onSelect={this.handleSelect.bind(this)}>
			    <NavItem eventKey="requests"> Requests </NavItem>
			    <NavItem eventKey="market_products"> Market Product</NavItem>	
			  </Nav>
		)
	}
}

