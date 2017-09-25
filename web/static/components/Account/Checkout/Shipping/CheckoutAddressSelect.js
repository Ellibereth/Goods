var React = require('react')
import AppStore from '../../../../stores/AppStore.js'
import CheckoutAddressPreview from './CheckoutAddressPreview'
import CheckoutAddAddressModal from './CheckoutAddAddressModal'

export default class CheckoutAddressSelect extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			selected_address : -1,
		}
	}

	componentDidMount(){
	}

	componentWillUnmount() {
	}

	setAddress(){	
		this.props.openEditable(this.props.BILLING_INDEX)	
	}

	onAddressChange(index){
		this.props.setAddress(index)
		this.setState({selected_address : index})
	}

	render() {
		var addresses = this.props.addresses
		var address_display = []
		addresses.map((address, index) => {
			var address_item = (<div className = "row">
				<div className = "top-buffer"/>
				<hr/>
				<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 text-right vcenter">
					<input type="radio"
						checked = {index == this.props.selected_address_index}
						onClick = {this.onAddressChange.bind(this, index)}
						value= {index} name="gender"/>
				</div>
				<div className = "col-xs-11 col-sm-11 col-md-11 col-lg-11 vcenter">
					<span className = "checkout-card-details">  {this.props.addressToString(address)} </span>
				</div>
			</div>)
			if (address.id == AppStore.getCurrentUser().default_address){
				address_display.unshift(address_item)
			}
			else {
				address_display.push(address_item)
			}
		}
		)

		if (address_display.length == 0){
			address_display = (
				<div className = "row">
					<div className = "top-buffer"/>
					<hr/>
					<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1">

					</div>
					<div className = "col-xs-11 col-sm-11 col-md-11 col-lg-11 vcenter">
						You have no addresses right now!
					</div>
				</div>
			)
		}
		


		return (
			<div className="well">
				<CheckoutAddAddressModal 
					onAddingNewShippingAddress = {this.props.onAddingNewShippingAddress}
					show = {this.props.address_modal_open} 
					toggleModal = {this.props.toggleModal}
					refreshCheckoutInformation = {this.props.refreshCheckoutInformation}
					setLoading = {this.props.setLoading}
				/>
				{this.props.can_edit ? 
					<div>
						<div className = "row">
							<div className = "col-xs-6 col-sm-6 col-md-6 col-lg-6 ">
								<span className = "checkout-select-title"> <b> 1. Select a shipping address </b> </span>
							</div>
						</div>
						<form >
							{address_display}
						</form>
						<hr/>

						<div className = "row row-eq-height">
							<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 text-right">
								<span className = "gylphicon glyphicon-plus btn-lg add-field-icon" onClick = {this.props.toggleModal} />
							</div>
							<div className = "col-xs-4 col-sm-4 col-md-4 col-lg-4 ">
								<span onClick = {this.props.toggleModal} className = "clickable-text add-field-text"> Add Address </span>
							</div>
						</div>
						<hr/>
						{
							this.props.addresses.length > 0 && 
							<div className = "row">
								<div className = "col-xs-4 col-sm-4 col-md-4 col-lg-4 ">
									<button className = "btn btn-default" onClick = {this.setAddress.bind(this)}>
										Use this address
									</button>
								</div>
							</div>	
						}
						
					</div>
					:
					<CheckoutAddressPreview 
						ADDRESS_INDEX = {this.props.ADDRESS_INDEX}
						openEditable = {this.props.openEditable}
						address = {this.props.address}
					/>
				}
			</div>
			
		)
	}
}

