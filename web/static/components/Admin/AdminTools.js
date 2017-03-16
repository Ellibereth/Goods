var React = require('react');
var ReactDOM = require('react-dom');


const request_variables = ['submission_id', 'name', 'email', 'product_description', 'price_range', 'confirmed', 'completed', 'time_stamp']
const headers = ['Submission Id', 'Name', 'Email', 'Product Description', 'Price Range', 'Confirmed', 'Completed', 'Time Stamp']
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
			$.ajax({
			  type: "POST",
			  url: real_url + "/getProductRequests",
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

	render() {
		var product_requests = this.state.product_requests
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)

		var table_entries = product_requests.map((request) => 
				{	
					var rows = request_variables.map((attr, index) =>
							<td className = "admin-table-cell" id = {request['submission_id'] + "_" + attr} s_id = {request['submission_id']}
							attr = {attr} index = {index}
							onClick = {() => this.toggleText.bind(this)(request['submission_id'], index, attr)}> 
							{this.shortenText(request[attr].toString())} </td> 
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

