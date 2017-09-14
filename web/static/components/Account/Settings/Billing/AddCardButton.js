var React = require('react')
var ReactDOM = require('react-dom')
var Link = require('react-router').Link
var browserHistory = require('react-router').browserHistory

export default class AddCardButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}

	onAddCardClick(){
		window.location.href = '/billing'
	}

	render() {

		return (

			<div onClick = {this.onAddCardClick} className = "col-sm-4 col-md-4 col-lg-4 hcenter vcenter 
			grey-dashed-border settings-preview-column add-settings-button">
				<span className = "glyphicon glyphicon-plus add-setting-icon" /> <br/>
				<span className = "add-settings-text"> Add new </span> <br/>
				<span className = "add-settings-text"> payment method </span> 
			</div>

			
		)
	}
}

