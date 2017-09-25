var React = require('react')
var ReactDOM = require('react-dom')

const BACKSPACE_KEY = 'Backspace'
const ENTER_KEY = 'Enter'

function isAlphaNumeric(str) {
	var code, i, len

	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i)
		if (!(code > 47 && code < 58) && // numeric (0-9)
								!(code > 64 && code < 91) && // upper alpha (A-Z)
								!(code > 96 && code < 123)) { // lower alpha (a-z)
			return false
		}
	}
	return true
}

function removeNonNumeric(str){
	return str.replace(/\D/g,'');
}

// joins the CC number with dashes
function addDashToCardNumber(str, n) {
    var ret = [];
    var i;
    var len;

    for(i = 0, len = str.length; i < len; i += n) {
       ret.push(str.substr(i, n))
    }
    return ret.join("-")
};


export default class CreditCardInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name_error : true,
			number_error: true,
			expiry_error : true,
			cvc_error: true
		}
		this.checkError = this.checkError.bind(this)
		this.checkNameError = this.checkNameError.bind(this)
		this.checkNumberError = this.checkNumberError.bind(this)
		this.checkExpiryError = this.checkExpiryError.bind(this)
		this.checkCvcError = this.checkCvcError.bind(this)
	}

	

	checkError(name, value) {
		switch (name) {
		case 'name':
			var new_value = this.checkNameError(value)
			break
		case 'number':
			var new_value = this.checkNumberError(value)
			break
		case 'expiry':
			var new_value = this.checkExpiryError(value)
			break
		case 'cvc':
			var new_value = this.checkCvcError(value)
			break
		}
		this.props.onTextInputChange(name, new_value)
	}

	checkNameError(value){
		if (value.length == 0){
			this.setState({
				name_error : 'Name can\'t be blank'
			})
		}
		else {
			this.setState({name_error : false})
		}
		return value
		
	}


	checkNumberError(value){
		var stripped_value = removeNonNumeric(value)

		var new_value = addDashToCardNumber(stripped_value, 4)
		
		if (new_value.length != 19){
			this.setState({
				number_error : 'Card number must be 16 digits'
			})
		} else {
			this.setState({number_error : false})
		}
		return new_value
	}

	checkExpiryError(value){

		var new_value = removeNonNumeric(value)
		if (new_value.length >= 3) {
			new_value = new_value.substring(0,2) + "/" + new_value.substring(2,4)
		}


		if (new_value.length != 5){
			this.setState({
				expiry_error : 'Expiration must be MM/YY format'
			})
		} else {
			this.setState({expiry_error : false})
		}
		return new_value
	}

	checkCvcError(value){

		if (value.length != 3){
			this.setState({
				cvc_error : 'CVC must be 3 digits'
			})
		} else{
			this.setState({cvc_error : false})
		}
		return value
	}


	componentDidMount(){
		
	}

	onKeyPress(e){
		if (e.key == ENTER_KEY){
			if (this.props.onSubmit){
				this.props.onSubmit(e)
			}
		}
		else {
			this.checkError(e.target.name, e.target.value)
		}
	}

	render() {
		var card_icon_base = 'https://s3-us-west-2.amazonaws.com/edgarusapublicicons/cardicons/'

		// VISA, Mastercard, Discover, AMEX
		var card_types = ['light/1.png', 'light/2.png', 'light/14.png', 'light/22.png']
		var card_icons = card_types.map((type, index) => 
			<img className = "card-icon-md "
				src = {card_icon_base + type} />
		)
		return (

			<form onSubmit = {this.props.onSubmit} id = "address_form" className="form-horizontal">
			

				{this.props.header && 
				<div className = "row">
					<div className="form-group">
						<label className="col-md-10 col-lg-10 control-label text-left" for="Name">
							<span className = "form-heading">  {this.props.header} </span>
							<span className = "pull-right modal-header-right"> 
								<span className = "red-text"> * </span>
								<span className = "vcenter"> Required  </span>
							</span>
						</label>    
					</div>
				</div>
				}	
				<div className = "row">
					<div className = "form-group">
						<label className = "control-label col-sm-10 col-md-10 col-lg-10 text-left">
						We accept 
							{card_icons} 
						</label>
					</div>
				</div>
				<div className = "row">
					<div className= {this.state.name_error ? 'form-group required' : 'form-group required has-success'}>
				  <label className="col-md-2 control-label text-left" for="State">Name on Card</label>  
				  <div className="col-md-6">

				  <input 
				  value = {this.props.name}
				  onChange  = {(event) => this.checkError(event.target.name, event.target.value)}
				  tabindex= {1} id = "card_name_input" 
					className= {this.state.name_error ? 'form-control input-md' : 'form-control form-control-success input-md'} 
					  field = "name" placeholder="Full name" type="text" name="name" />
				  </div>
					</div>
				</div>


				<div className = "row">
					<div className= {this.state.number_error ? 'form-group required' : 'form-group required has-success'}>
				  <label className="col-md-2 control-label text-left">Card Number</label>  
				  <div className="col-md-6">
				  <input 
				  value = {this.props.number}
				  onChange  = {(event) => this.checkError(event.target.name, event.target.value)}
				  tabindex= {2} id = "card_input" 
				  className= {this.state.number_error ? 'form-control input-md' : 'form-control form-control-success input-md'} 
				   maxLength = "19"
					  field = "number" placeholder="Card number" type="text" name="number" />
				  </div>
					</div>
				</div>

				<div className = "row">
					<div className = {this.state.expiry_error ? 'form-group required' : 'form-group required has-success'} >
				  <label className="col-md-2 control-label text-left" for="State">Expiration</label>  
				  <div className="col-md-2">
				  <input onChange  = {(event) => this.checkError(event.target.name, event.target.value)}
				  id = "expiry_input" tabindex= {3} 
				  className= {this.state.expiry_error ? 'form-control input-md' : 'form-control form-control-success input-md'} 
				  maxLength = "5"
				  value = {this.props.expiry}
					 field = "expiry" placeholder="MM/YY" type="text" name="expiry" />
				  </div>
					</div>
				</div>

				<div className = "row">
					<div className = {this.state.cvc_error ? 'form-group required' : 'form-group required has-success'}>
				  <label className="col-md-2 control-label text-left" for="State">CVC</label>  
				  <div className="col-md-2">
					<input
					value = {this.props.cvc}
					onChange  = {(event) => this.checkError(event.target.name, event.target.value)}
					tabindex= {4} 
					className = {this.state.cvc_error ? 'form-control input-md' : 'form-control form-control-success input-md '}
					maxLength = "3"
					
					 field = "cvc" placeholder="CVC" type="text" name="cvc" />
							{/*
						this.state.cvc_error &&
						 <div className="form-control-feedback has-danger"> {this.state.cvc_error} </div>
					*/}
				  </div>
					</div>
				</div>
			</form>
			

		)
	}
}