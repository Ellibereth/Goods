var React = require('react');
var ReactDOM = require('react-dom');


var Link = require('react-router').Link;
import AdminManufacturerRow from './AdminManufacturerRow'
const headers = ['Go To This manufacturer', 'Id', 'Name', 'Description', 'Notes']
const manufacturer_variables = ['manufacturer_id', 'name', 'description', 'notes']

export default class AdminMarketManufacturers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_modal : false
		}
	}


	componentDidMount(){

	}

	render() {
		var manufacturers = this.props.manufacturers

		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)


		var table_entries = manufacturers.map((manufacturer, index) => 
				<AdminManufacturerRow 
				manufacturer_variables = {manufacturer_variables}
				manufacturer = {manufacturer} index = {index}/>
			)


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

