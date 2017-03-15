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
		var request_variables = ['submission_id', 'name', 'email', 'product_description', 'price_range', 'confirmed', 'completed']
		var headers = ['Submission Id', 'Name', 'Email', 'Product Description', 'Price Range', 'Confirmed', 'Completed']
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)
		
		const td_styles = {
			"word-wrap" : "break-word",
			"min-width" : "160px",
			"max-width" : "160px"
		}

		var table_entries = product_requests.map((request) => 
				{	
					var rows = request_variables.map((attr, index) =>
							<td id = {request['submission_id'] + "_" + attr} s_id = {request['submission_id']}
							attr = {attr} style = {td_styles} index = {index}
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

