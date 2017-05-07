var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

export default class AddAddressButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	onAddAddressClick(){
		browserHistory.push('/shipping')
	}

	render() {

		return (
			<div className = "col-sm-4 col-md-4 col-lg-4 hcenter add-settings-row">
				<div onClick = {this.onAddAddressClick} >
					<span className = "glyphicon glyphicon-plus add-setting-icon block-span" />
					<span className = "block-span add-settings-text"> Add an address </span>
				</div>
			</div>
		)
	}
}

