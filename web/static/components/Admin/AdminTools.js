var React = require('react');
var ReactDOM = require('react-dom');
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

export default class AdminTools extends React.Component {
	constructor(props) {
		super(props);
	}

	getProductRequests(){
			var real_url = "https://whereisitmade.herokuapp.com"
			var test_url = "http://127.0.0.1:5000"	
			var product_requests = []
		  	$.ajax({
			  type: "POST",
			  url: test_url + "/getProductRequests",
			  success: function(data) {
			  	product_requests = data
			  },
			  error : function(){
			  	console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
		  }

  render() {
  	var product_requests = this.getProductRequests()
    return (
        <BootstrapTable data={ product_requests } striped hover condensed>
          <TableHeaderColumn dataField='submission_id' isKey> Submission Id</TableHeaderColumn>
          <TableHeaderColumn dataField='name'> Name</TableHeaderColumn>
          <TableHeaderColumn dataField='email'> Email </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

