var React = require('react')
var ReactDOM = require('react-dom')
import AdminEditManufacturerInfo from './AdminEditManufacturerInfo'
import PageContainer from '../../../Misc/PageContainer.js'




export default class AdminManufacturerPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			manufacturer : {},
			invalid_manufacturer : true,
			is_loading : true,
		}
	}

	getManufacturerInformation(){
		var form_data = JSON.stringify({
			'manufacturer_id' : this.props.params.manufacturer_id,
			'jwt' : localStorage.jwt
		})
		$.ajax({
		  type: 'POST',
		  url: '/getAdminManufacturerInfo',
		  data: form_data,
		  success: function(data) {
				if (!data.success){
					this.setState({invalid_manufacturer : true})
				}
				else {
					this.setState({
						invalid_manufacturer : false,
						manufacturer: data.manufacturer,
						is_loading : false
					})
				}
			
		  }.bind(this),
		  error : function(){

		  },
		  dataType: 'json',
		  contentType : 'application/json; charset=utf-8'
		})
	}

	previewManufacturer(manufacturer){
		this.setState({manufacturer : manufacturer})
	}

	componentDidMount(){
		var form_data = JSON.stringify({'jwt' : localStorage.jwt})
		$.ajax({
			type: 'POST',
			url: '/checkAdminJwt',
			data: form_data,
			success: function(data) {
				if (!data.success){
					window.location = '/'
				}
				else {
					this.getManufacturerInformation.bind(this)()
				}
			}.bind(this),
			error : function(){
				replace('/')
		  	},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
		
	}

	render() {
		return (
			<PageContainer>
				<div>
					<div className = "container">
						<div className = "row">
							<button onClick = {() => window.location = '/yevgeniypoker555'}
								type = "button" className = "btn btn-default">
								Return to Admin Home
							</button>
						</div>

						<div className = "top-buffer"/>

						<div className = "row">
							{!this.state.is_loading && <h1> {this.state.manufacturer.name + ' by ' + this.state.manufacturer.manufacturer}</h1>}
						</div>

						<div className = "top-buffer"/>

						<hr/>


						<div className = "row">
							<AdminEditManufacturerInfo
								getManufacturerInformation = {this.getManufacturerInformation.bind(this)}
								manufacturer = {this.state.manufacturer}/>
						</div>

					</div>
				</div>
			</PageContainer>
		)
	}
}