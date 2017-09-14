var React = require('react')
var ReactDOM = require('react-dom')
var Link = require('react-router').Link
var browserHistory = require('react-router').browserHistory

export default class AddAddressButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}

	onAddAddressClick(){
		window.location.href = '/shipping'
	}

	render() {

		return (
			<div onClick = {this.onAddAddressClick} className = "col-sm-4 col-md-4 col-lg-4 hcenter vcenter 
			grey-dashed-border settings-preview-column add-settings-button">
				<span className = "glyphicon glyphicon-plus add-setting-icon" /> <br/>
				<span className = "add-settings-text"> Add new </span> <br/>
				<span className = "add-settings-text"> shipping address </span> 
			</div>
		)
	}
}

