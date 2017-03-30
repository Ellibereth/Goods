var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Button} from 'react-bootstrap'
const request_variables = ['submission_id', 'name', 'email', 'product_description', 'price_range', 'confirmed', 'completed', 'time_stamp']
const headers = ['Delete', 'Submission Id', 'Name', 'Email', 'Product Description', 'Price Range', 'Confirmed', 'Completed', 'Time Stamp']

export default class AdminProductRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product_requests : []
		}
	}

	componentDidMount(){	
			var product_requests = []
			$.ajax({
			  type: "POST",
			  url: url + "/getProductRequests",
			  success: function(data) {
				this.setState({product_requests: data})
			  }.bind(this),
			  error : function(){
				console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
	}



	// index isn't used right now, but might be used later
	onDeleteClick(s_id, index){
		swal({
		  title: "Ready?",
		  text: "Are you sure you want to delete this?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			var temp = this.state.product_requests
			temp.splice(index, 1)
			this.setState({product_requests : temp})
			this.softDeleteRequest.bind(this)(s_id)
		}.bind(this))
	}

	softDeleteRequest(s_id){
			var form_data = JSON.stringify({"submission_id": s_id})
			$.ajax({
				type: "POST",
				url: url  + "/softDeleteProductRequestBySubmissionId",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "We weren't able to delete it!", "warning")
					}
					else {
						swal("Thank you!", "You have deleted this request!", "success")
					}

				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	toggleClass(id){
		$("#" + id).toggleClass("admin-table-cell-short")
	}

	render() {
		var product_requests = this.state.product_requests
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)
		var table_entries = product_requests.map((request, index) => 
				{	
					var row = request_variables.map((attr) => {
						var this_entry = request[attr]
						if (this_entry == null) this_entry = ""
						var id = request['submission_id'] + "_" + attr
						return	(<td className = "admin-table-cell-short" id = {id} s_id = {request['submission_id']}
							attr = {attr} index = {index}
							onClick = {this.toggleClass.bind(this, id)}> {request[attr]} </td> 
						)
					})
					row.unshift(
							<td className = "admin-table-cell-short" id = {request['submission_id'] + "_delete"} s_id = {request['submission_id']}
							attr = "delete" index = {index}> 
								<Button onClick = {() => this.onDeleteClick.bind(this)(request['submission_id'], index)}>
									Delete!
								</Button>
							 </td> 
						)
					return (
						<tr>
							{row}
						</tr>
					)
			})
		return (
			<div className = "container">
				<div className="col-md-12">
					<table className ="table table-bordered">
						<thead>
							<tr>
								{table_headers}
							</tr>
						</thead>
						<tbody>
							{table_entries}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

