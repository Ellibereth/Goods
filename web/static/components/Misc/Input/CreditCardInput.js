var React = require('react');
var ReactDOM = require('react-dom');
import CardReactFormContainer from 'card-react';

export default class CreditCardInput extends React.Component {
	constructor(props) {
		super(props);
	}

	handleChange(event) {
		this.props.onTextInputChange(event.target.name, event.target.value)
	}

	componentDidMount(){

	}

	render() {
		return (

			<div>
				<div style = {{display: 'none'}} className = "card-wrapper" id="card-wrapper"> </div> 
				

				<CardReactFormContainer

				// the id of the container element where you want to render the card element.
				// the card component can be rendered anywhere (doesn't have to be in ReactCardFormContainer).
				container="card-wrapper" // required

				// an object contain the form inputs names.
				// every input must have a unique name prop.
				formInputsNames={
					{
						number: 'number', // optional — default "number"
						expiry: 'expiry',// optional — default "expiry"
						cvc: 'cvc', // optional — default "cvc"
						name: 'name' // optional - default "name"
					}
				}

				// the class name attribute to add to the input field and the corresponding part of the card element,
				// when the input is valid/invalid.
				classes={
					{
						valid: 'valid-input', // optional — default 'jp-card-valid'
						invalid: 'invalid-input' // optional — default 'jp-card-invalid'
					}
				}

				// specify whether you want to format the form inputs or not
				formatting={true} // optional - default true
			>

			<div className = "row">
				<div className="form-group">
				  <label className="col-md-2 control-label" for="State">Name on Card </label>  
				  <div className="col-md-6">
				  <input tabindex= {1} id = "card_name_input" className="form-control input-md"
					 onChange = {this.handleChange.bind(this)} field = "name" placeholder="Full name" type="text" name="name" />
				  </div>
				</div>
			</div>


			<div className = "row">
				<div className="form-group">
				  <label className="col-md-2 control-label" > Card Number </label>  
				  <div className="col-md-6">
				  <input tabindex= {2} id = "card_input" className="form-control input-md" maxLength = "20"
					onChange = {this.handleChange.bind(this)}  field = "number" placeholder="Card number" type="text" name="number" />
				  </div>
				</div>
			</div>

			<div className = "row">
				<div className="form-group">
				  <label className="col-md-2 control-label" for="State"> Expiration </label>  
				  <div className="col-md-2">
				  <input tabindex= {3}  className="form-control input-md" maxLength = "7"
					onChange = {this.handleChange.bind(this)} field = "expiry" placeholder="MM/YY" type="text" name="expiry" />
				  </div>
				  <label className="col-md-2 control-label" for="State"> CVC  </label>  
				  <div className="col-md-2">
				  	<input tabindex= {4}  className="form-control input-md" maxLength = "3"
					onChange = {this.handleChange.bind(this)}  field = "cvc" placeholder="CVC" type="text" name="cvc" />
				  </div>
				</div>
			</div>

			</CardReactFormContainer>

			
			</div>
			

		)
	}
}