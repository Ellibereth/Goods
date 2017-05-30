var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AddressPreview from './AddressPreview'
import EditAddressModal from './EditAddressModal.js'
import AddAddressButton from './AddAddressButton'

export default class ShippingPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal_show : false,
			modal_address : null
		}
	}

	toggleModal(address) {
		this.setState({
			modal_show : !this.state.modal_show,
			modal_address : address
		})
	}

	deleteAddress(address){
		var data = {}
		data["jwt"] = localStorage.jwt
		data["account_id"] = AppStore.getCurrentUser().account_id
		data["address_id"] = address.id
		var form_data = JSON.stringify(data)
		this.props.setLoading(true)
		$.ajax({
			type: "POST",
			url: "/deleteUserAddress",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal("Sorry", "It seems there was an error deleting your address. " + data.error 
						+ ". Please try again", "warning")
				}
				else {
					// AppActions.addCurrentUser(data.user_info)
					swal({
							title: "Thank you", 
							text : "Your changes have been made",
							type: "success"
						})
					this.props.refreshSettings()
				}
				this.props.setLoading(false)
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}



	render() {
		var current_user = AppStore.getCurrentUser()
		var addresses = this.props.addresses
		var address_columns = []
		addresses.map((address,index) =>  {
			if (address.id == current_user.default_address)
				address_columns.unshift(
					<AddressPreview 
					setLoading = {this.props.setLoading}
					address = {address} 
					toggleModal = {this.toggleModal.bind(this)}
					deleteAddress = {this.deleteAddress.bind(this)}
					refreshSettings = {this.props.refreshSettings}/>
				)
			else {
				address_columns.push(
					<AddressPreview address = {address} 
					setLoading = {this.props.setLoading}
					toggleModal = {this.toggleModal.bind(this)}
					deleteAddress = {this.deleteAddress.bind(this)}
					refreshSettings = {this.props.refreshSettings}/>
				)
			}
		})

		address_columns.unshift(
				<AddAddressButton />
			)

		if (this.props.is_loading){
			address_columns = []
		}

		var col_per_row = 3;

		var address_rows = []
		var num_rows = Math.floor((address_columns.length - 1) / col_per_row + 1)
		for (var i = 0; i < num_rows; i++){
			var this_row = []
			for (var j = i * col_per_row; j < (i + 1) * col_per_row; j++){
				if (j < address_columns.length){
					this_row.push(address_columns[j])	
				}
				else {
					this_row.push(
							<div className = "col-sm-4 col-md-4 col-lg-4 settings-preview-column no-border"/>
						)
				}
				
			}
			address_rows.push(
				<div className = "row row-eq-height settings-preview-row">
					{this_row}
				</div>
			)
		}



		





		return (
				<div className = "container-fluid">
					<EditAddressModal show = {this.state.modal_show} address = {this.state.modal_address} 
					refreshSettings = {this.props.refreshSettings}
					toggleModal = {this.toggleModal.bind(this)}
					setLoading = {this.props.setLoading}/>

					<div className="panel panel-default">
						<div className = "panel-heading">
							<div className = "account-page-text"> Shipping Address </div>
						</div>
						<div className="panel-body">
							<div className = "container-fluid">
								{address_rows}
							</div>
						</div>
					</div>
				</div>
		)
	}
}

