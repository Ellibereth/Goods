var React = require('react');
var ReactDOM = require('react-dom');

export default class AdminTools extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product_requests : []
		}
	}

	componentDidMount(){
			var real_url = "https://whereisitmade.herokuapp.com"
			var test_url = "http://127.0.0.1:5000"	
			var product_requests = []
			var that = this
			$.ajax({
			  type: "POST",
			  url: real_url + "/getProductRequests",
			  success: function(data) {
				console.log(data)
				that.setState({product_requests: data})
			  },
			  error : function(){
				console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
			return product_requests
	}


	render() {
		var product_requests = this.state.product_requests
		console.log(product_requests[0])
		var request_variables = ['submission_id', 'name', 'email', 'product_description', 'price_range', 'confirmed', 'completed']
		var headers = ['Submission Id', 'Name', 'Email', 'Product Description', 'Price Range', 'Confirmed', 'Completed']
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)
		var table_entries = product_requests.map((request) => 
				{	
					var rows = request_variables.map((attr) =>
							<td> {request[attr].toString()} </td> 
						)
					return (
						<tr>
							{rows}
						</tr>
					)
			})
		return (
			<div className = "container">
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
		);
	}
}

