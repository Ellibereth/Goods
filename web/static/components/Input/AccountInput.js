var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../stores/AppStore'


export default class AccountInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {

		var popover_template = '<div class="popover register-popover" role="tooltip"> \
									<div class="arrow"> </div> \
									<div class="popover-content"> </div> \
								</div>'

		return (
			<div className="form-group row">
				<div className="col-lg-12 col-md-12 col-sm-12">
					<input 
						tabindex = {this.props.index}
						onKeyPress = {this.props.onKeyPress}
						field = {this.props.field}
						name = {this.props.name}
						className="form-control input-lg" 
						type= {this.props.type}
						onChange = {this.props.onChange}
						value = {this.props.value} 
						placeholder = {this.props.label}
						data-content = {this.props.popover_text}
						data-toggle = {this.props.popover_text && "popover"}
						data-trigger = {this.props.popover_text && "focus"}
						data-animation = {true}
						data-template = {this.props.popover_text &&
							popover_template}
						/>
				</div>
			</div>
		)
	}
}

