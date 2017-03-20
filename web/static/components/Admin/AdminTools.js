var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap'
const request_variables = ['submission_id', 'name', 'email', 'product_description', 'price_range', 'confirmed', 'completed', 'time_stamp']
const headers = ['Delete', 'Submission Id', 'Name', 'Email', 'Product Description', 'Price Range', 'Confirmed', 'Completed', 'Time Stamp']
var Config = require('Config')
var url = Config.serverUrl
export default class AdminTools extends React.Component {
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

	shortenText(text){
		var maxLength = 40
		if (text.length < maxLength) {
			return text
		}
		else {
			return text.substring(0,maxLength - 4) + "..."
		}
	}

	// hides if the text is less than 40
	// otherwise shows all
	toggleText(s_id, index, attr){
		var id = s_id + "_" + attr
		var product_requests = this.state.product_requests
		if ($("#" + id).text().length > 40) {
			$("#" + id).text(this.shortenText($("#" + id).text()))
		}
		else {
			$("#" + id).text(product_requests[index][attr])
		}
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
			this.submitData.bind(this)(s_id)
		}.bind(this))
	}

	submitData(s_id){
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

	render() {
		var product_requests = this.state.product_requests
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)
		var table_entries = product_requests.map((request, index) => 
				{	
					var rows = request_variables.map((attr) => {

						var this_entry = request[attr]
						if (this_entry == null) this_entry = ""
						return	(<td className = "admin-table-cell" id = {request['submission_id'] + "_" + attr} s_id = {request['submission_id']}
							attr = {attr} index = {index}
							onClick = {() => this.toggleText.bind(this)(request['submission_id'], index, attr)}> 
							{this.shortenText(this_entry.toString())} </td> 
						)
					})
					rows.unshift(
							<td className = "admin-table-cell" id = {request['submission_id'] + "_delete"} s_id = {request['submission_id']}
							attr = "delete" index = {index}> 
								<Button onClick = {() => this.onDeleteClick.bind(this)(request['submission_id'], index)}>
									Delete!
								</Button>
							 </td> 
						)
					return (
						<tr>
							{rows}
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

