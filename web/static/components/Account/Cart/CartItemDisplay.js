var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import {Button} from 'react-bootstrap'


export default class UserAddressDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	handleQuantityChange(event){
		var new_num_items = event.target.value

		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt,
				"new_num_items" : new_num_items,
				"product_id" : this.props.item.product_id

			})
			$.ajax({
				type: "POST",
				url: url  + "/updateCartQuantity",
				data: form_data,
				success: function(data) {
					if (data.success){
						swal("Success!")	
					}
					else {
						swal("Sorry", "Something went wrong." + data.error, "error")
					}
					
				}.bind(this),
				error : function(){
					swal("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		this.props.refreshProductInfo()
	}




	render() {
		// will be updating this to have a better display in the near future
		var item = this.props.item

		var max_items = 10
		var num_items_options = []
		for (var i = 1; i <= 10; i++){
			if (this.props.item.num_items == i){
				num_items_options.push(<option selected value = {i}> {i} </option>)
			}
			else {
				num_items_options.push(<option value = {i}> {i} </option>)
			}
		}	
		return (
			<div className = "row">
				<div>
					<p> Name : {item.name} </p>
					<form>
						<div class="form-group">
						  <label> Quantity </label>
						  <select onChange = {this.handleQuantityChange.bind(this)} class="form-control">
						    {num_items_options}
						    <option value = {0}> Delete </option>
						   
						  </select>
						</div>
					</form>
				</div>	
				
			</div>
		)
	}
}

