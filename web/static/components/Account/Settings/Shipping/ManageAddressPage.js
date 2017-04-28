var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import TopNavBar from '../../../Misc/TopNavBar'
import ManageAddressDisplay from './ManageAddressDisplay.js'
import EditAddressModal from './EditAddressModal.js'
var browserHistory = require('react-router').browserHistory;

export default class ManageAddressPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses : [],
			modal_show : false,
			modal_address : null
		}
	}

	componentDidMount() {
		// first check the password
		var form_data = JSON.stringify({
			"account_id" : AppStore.getCurrentUser().account_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
				type: "POST",
				url: "/getUserAddress",
				data: form_data,
				success: function(data) {
					if (data) {
						this.setState({addresses : data.addresses})
						console.log(data)	
					}
					
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});

	}

	toggleEditModal(address) {
		this.setState({
			modal_show : !this.state.modal_show,
			modal_address : address
		})
	}

	render() {
		var address_display = this.state.addresses.map((address, index) => 
					<ManageAddressDisplay address = {address} toggleModal = {this.toggleEditModal.bind(this)}/>
				)

		return (
			<div>

				<TopNavBar />
				<div className = "container">
					<div className = "row">
						<span> <b> Youre Address Book </b> </span>
					</div>
					{address_display}
					
				</div>
				<EditAddressModal show = {this.state.modal_show} address = {this.state.modal_address} 
					toggleModal = {this.toggleEditModal.bind(this)}/>
			</div>	
		)
	}
}

