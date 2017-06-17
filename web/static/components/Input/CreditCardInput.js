var React = require('react');
var ReactDOM = require('react-dom');

export default class CreditCardInput extends React.Component {
	constructor(props) {
		super(props);
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

	handleChange(event) {
		this.checkError(event.target.name, event.target.value)
		this.props.onTextInputChange(event.target.name, event.target.value)
	}

	checkError(name, value) {
		switch (name) {
			case "name":
				this.checkNameError(value)
				break;
			case "number":
				this.checkNumberError(value)
				break;
			case "expiry":
				this.checkExpiryError(value)
				break;
			case "cvc":
				this.checkCvcError(value)
				break;
		}
	}

	checkNameError(value){
		if (value.length == 0){
			this.setState({
				name_error : "Name can't be blank"
			})
		}
		else {
			this.setState({name_error : false})
		}
	}

	checkNumberError(value){
		if (value.length == 4 || value.length == 9 || value.length == 14){
			$("#card_input").val(value + " ")
		}

		if (value.length == 15 || value.length == 10 || value.length == 5){
			$("#card_input").val(value.substring(0, value.length - 1))
		}

		if (value.length != 19){
			this.setState({
				number_error : "Card number must be 16 digits"
			})
		} else {
			this.setState({number_error : false})
		}
	}

	checkExpiryError(value){
		if (value.length == 2){
			$("#expiry_input").val(value + " / ")
		}

		if (value.length == 4){
			$("#expiry_input").val(value.substring(0,2))	
		}


		if (value.length != 7){
			this.setState({
				expiry_error : "Expiration must be MM / YY format"
			})
		} else {
			this.setState({expiry_error : false})
		}
	}

	checkCvcError(value){
		if (value.length != 3){
			this.setState({
				cvc_error : "CVC must be 3 digits"
			})
		} else{
			this.setState({cvc_error : false})
		}
	}


	componentDidMount(){
		
	}

	onKeyPress(e){
		if (e.key == "Enter"){
			if (this.props.onSubmit){
				this.props.onSubmit(e)
			}
		}
	}

	render() {
		
		var card_icon_base = "https://s3-us-west-2.amazonaws.com/edgarusapublicicons/cardicons/"

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
				<div className= {this.state.name_error ? "form-group required" : "form-group required has-success"}>
				  <label className="col-md-2 control-label text-left" for="State">Card Name</label>  
				  <div className="col-md-6">
				  <input 
				  onKeyPress = {this.onKeyPress.bind(this)}
				  tabindex= {1} id = "card_name_input" 
				  	className= {this.state.name_error ? "form-control input-md" : "form-control form-control-success input-md"} 
					 onChange = {this.handleChange.bind(this)} field = "name" placeholder="Full name" type="text" name="name" />
				  </div>
				</div>
			</div>


			<div className = "row">
				<div className= {this.state.number_error ? "form-group required" : "form-group required has-success"}>
				  <label className="col-md-2 control-label text-left">Card Number</label>  
				  <div className="col-md-6">
				  <input 
				  onKeyPress = {this.onKeyPress.bind(this)}
				  tabindex= {2} id = "card_input" 
				  className= {this.state.number_error ? "form-control input-md" : "form-control form-control-success input-md"} 
				   maxLength = "19"
					onChange = {this.handleChange.bind(this)}  field = "number" placeholder="Card number" type="text" name="number" />
				  </div>
				</div>
			</div>

			<div className = "row">
				<div className = {this.state.expiry_error ? "form-group required" : "form-group required has-success"} >
				  <label className="col-md-2 control-label text-left" for="State">Expiration</label>  
				  <div className="col-md-2">
				  <input onKeyPress = {this.onKeyPress.bind(this)}
				  id = "expiry_input" tabindex= {3} 
				  className= {this.state.expiry_error ? "form-control input-md" : "form-control form-control-success input-md"} 
				  maxLength = "7"
					onChange = {this.handleChange.bind(this)} field = "expiry" placeholder="MM/YY" type="text" name="expiry" />
				  </div>
				</div>
			</div>

			<div className = "row">
				<div className = {this.state.cvc_error ? "form-group required" : "form-group required has-success"}>
				  <label className="col-md-2 control-label text-left" for="State">CVC</label>  
				  <div className="col-md-2">
				  	<input
				  	onKeyPress = {this.onKeyPress.bind(this)}
				  	tabindex= {4} 
				  	className = {this.state.cvc_error ? "form-control input-md" : "form-control form-control-success input-md "}
				  	maxLength = "3"
					onChange = {this.handleChange.bind(this)}
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