var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

export default class AddCardButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	onAddCardClick(){
		browserHistory.push('/billing')
	}

	render() {

		return (
			<div className = "col-sm-4 col-md-4 col-lg-4 hcenter add-settings-row">
				<div onClick = {this.onAddCardClick} >
					<span className = "glyphicon glyphicon-plus add-setting-icon block-span" />
					<span className = "block-span add-settings-text"> Add a card </span>
				</div>
			</div>
		)
	}
}

