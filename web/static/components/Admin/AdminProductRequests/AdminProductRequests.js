var React = require('react');
var ReactDOM = require('react-dom');

const request_variables = ['request_id', 'name', 'email', 'description', 'price_range', 'confirmed', 'completed', 'date_created', 'date_completed']
const headers = ['Delete', 'Request Id', 'Name', 'Email', 'Description', 'Price Range', 'Confirmed', 'Completed', 'Date Created', 'Date Completed']

export default class AdminProductRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product_requests : []
		}
	}

	componentDidMount(){	
			var product_requests = []
			var form_data = JSON.stringify({
				"jwt" : localStorage.jwt
			})
			$.ajax({
			  type: "POST",
			  url: "/getProductRequests",
			  data : form_data,
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
	onDeleteClick(r_id, index){
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
			this.softDeleteRequest.bind(this)(r_id)
		}.bind(this))
	}

	softDeleteRequest(r_id){
			var form_data = JSON.stringify({"request_id": r_id})
			$.ajax({
				type: "POST",
				url: "/softDeleteProductRequestByRequestId",
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
						if (this_entry == null) {
							this_entry = ""
						}
						console.log(attr, this_entry)
						var id = request['submission_id'] + "_" + attr
						return	(<td className = "admin-table-cell-short" id = {id} s_id = {request['submission_id']}
							attr = {attr} index = {index}
							onClick = {this.toggleClass.bind(this, id)}> {this_entry.toString()} </td> 
						)
					})
					row.unshift(
							<td className = "admin-table-cell-short" id = {request['submission_id'] + "_delete"} s_id = {request['submission_id']}
							attr = "delete" index = {index}> 
								<button type = "button" className = "btn btn-default" onClick = {() => this.onDeleteClick.bind(this)(request['request_id'], index)}>
									Delete!
								</button>
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

