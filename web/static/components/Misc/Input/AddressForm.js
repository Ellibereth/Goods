var React = require('react');
var ReactDOM = require('react-dom');
import {Form, FormGroup, ControlLabel} from 'react-bootstrap'

export default class CreditCardInput extends React.Component {
	constructor(props) {
		super(props);
	}

	handleChange(event) {
		this.props.onTextInputChange(event.target.name, event.target.value)
	}

	componentDidMount(){
		this.props.onTextInputChange("address_state", "AL")
	}

	isNumberKey(evt){
	    var charCode = (evt.which) ? evt.which : event.keyCode
	    if (charCode > 31 && (charCode < 48 || charCode > 57))
	        return false;
	    return true;
	}

	render() {
		var tab_index_start = this.props.tab_index ? this.props.tab_index : 0
		return (

		<form id = "address_form" className="form-horizontal">
			<fieldset>

			<div className="form-group">
			    <label tabindex= {1 + tab_index_start} className="col-md-2 control-label" for="Name">Name </label>    
			    <div className="col-md-6">
			    <input  field = "address_name" onChange = {this.handleChange.bind(this)}
			     id="Name" name="address_name" type="text" placeholder="Name on Address" className="form-control input-md" required=""/>
			    </div>
			</div>

			{
				this.props.has_description &&
				<div className="form-group">
				    <label className="col-md-2 control-label" for="Description"> Description </label>    
				    <div className="col-md-6">
				    <input tabindex= {tab_index_start + 2} field = "description" onChange = {this.handleChange.bind(this)}
				     id="Name" name="description" type="text" placeholder="Describe this address" className="form-control input-md" required=""/>
				    </div>
				</div>
			}


			<div className="form-group">
			    <label className="col-md-2 control-label" for="Country">Country</label>
			    <div className="col-md-5">
				<select tabindex= {tab_index_start + 3} field = "address_country"    onChange = {this.handleChange.bind(this)}
				id="Country" name="address_country" className="form-control" disabled = {true}>
				    <option selected value="US">United States</option>
				</select>
				<span className="help-block"> We only ship to the US for now! </span>    
			    </div>
			</div>

			<div className="form-group">
			    <label className="col-md-2 control-label" for="State">State</label>    
			    <div className="col-md-6">

			    <select tabindex= {tab_index_start + 4} field = "address_state"    onChange = {this.handleChange.bind(this)}
				id="State" name="address_state" className="form-control">
				    	<option value="AL">Alabama</option>
					<option value="AK">Alaska</option>
					<option value="AZ">Arizona</option>
					<option value="AR">Arkansas</option>
					<option value="CA">California</option>
					<option value="CO">Colorado</option>
					<option value="CT">Connecticut</option>
					<option value="DE">Delaware</option>
					<option value="DC">District of Columbia</option>
					<option value="FL">Florida</option>
					<option value="GA">Georgia</option>
					<option value="HI">Hawaii</option>
					<option value="ID">Idaho</option>
					<option value="IL">Illinois</option>
					<option value="IN">Indiana</option>
					<option value="IA">Iowa</option>
					<option value="KS">Kansas</option>
					<option value="KY">Kentucky</option>
					<option value="LA">Louisiana</option>
					<option value="ME">Maine</option>
					<option value="MD">Maryland</option>
					<option value="MA">Massachusetts</option>
					<option value="MI">Michigan</option>
					<option value="MN">Minnesota</option>
					<option value="MS">Mississippi</option>
					<option value="MO">Missouri</option>
					<option value="MT">Montana</option>
					<option value="NE">Nebraska</option>
					<option value="NV">Nevada</option>
					<option value="NH">New Hampshire</option>
					<option value="NJ">New Jersey</option>
					<option value="NM">New Mexico</option>
					<option value="NY">New York</option>
					<option value="NC">North Carolina</option>
					<option value="ND">North Dakota</option>
					<option value="OH">Ohio</option>
					<option value="OK">Oklahoma</option>
					<option value="OR">Oregon</option>
					<option value="PA">Pennsylvania</option>
					<option value="RI">Rhode Island</option>
					<option value="SC">South Carolina</option>
					<option value="SD">South Dakota</option>
					<option value="TN">Tennessee</option>
					<option value="TX">Texas</option>
					<option value="UT">Utah</option>
					<option value="VT">Vermont</option>
					<option value="VA">Virginia</option>
					<option value="WA">Washington</option>
					<option value="WV">West Virginia</option>
					<option value="WI">Wisconsin</option>
					<option value="WY">Wyoming</option>
				</select>

			    
			     {/* <span className="help-block">Enter State</span> */}

			    </div>
			</div>

			<div className="form-group">
			    <label className="col-md-2 control-label" for="city">City/Town</label>    
			    <div className="col-md-6">
			    <input tabindex= {tab_index_start + 5} field = "address_city" onChange = {this.handleChange.bind(this)}
			    id="city" name="address_city" type="text" placeholder="city or town" className="form-control input-md" required=""/>
				
			    </div>
			</div>

			<div className="form-group">
			    <label className="col-md-2 control-label" for="address1">Address Line 1</label>    
			    <div className="col-md-8">
			    <input tabindex= {tab_index_start + 6} field = "address_line1" onChange = {this.handleChange.bind(this)}
			     id="address1" name="address_line1" type="text" placeholder="" className="form-control input-md"/>
			    <span className="help-block">Street address, P.O. box, company name, c/o</span>    
			    </div>
			</div>

			<div className="form-group">
			    <label className="col-md-2 control-label" for="Address2">Address Line 2</label>    
			    <div className="col-md-8">
			    <input  tabindex= {tab_index_start + 7} field = "address_line2" onChange = {this.handleChange.bind(this)}
			    id="Address2" name="address_line2" type="text" placeholder="" className="form-control input-md"/>
			    <span className="help-block">Apartment, suite, unit, building, floor, etc.</span>    
			    </div>
			</div>

			<div className="form-group">
			    <label className="col-md-2 control-label" for="zip">Zip/Postal code</label>    
			    <div className="col-md-4">
			    <input tabindex= {tab_index_start + 8}
			    maxLength = {5} 
			    onkeyenter = {this.isNumberKey}
			    field = "address_zip" onChange = {this.handleChange.bind(this)}
			    id="zip" name="address_zip" type="text" placeholder="zip or postal code" className="form-control input-md" required=""/>
				
			    </div>
			</div>

			</fieldset>
			</form>

		)
	}
}