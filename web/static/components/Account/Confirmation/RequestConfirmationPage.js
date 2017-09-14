var React = require('react')
var ReactDOM = require('react-dom')

import PageContainer from '../../Misc/PageContainer.js'

export default class EmailConfirmationPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			confirmation_id : this.props.params.confirmation_id,
			display : 'failure'
		}
	}
	
	componentDidMount(){	
		var form_data = JSON.stringify({
			'confirmation_id' : this.props.params.confirmation_id
		})

		$.ajax({
			type: 'POST',
			url: '/confirmProductRequest',
			data: form_data,
			success: function(data) {
				if (data.success){
					// maybe do something to display if not confirmed
					this.setState({display : 'confirmed'})
				}
				// redirect if something is wrong 
			},
			error: function(){
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	render() {

		return (
			<PageContainer>
				<h3>
							Thank you for sending us a request! <br/>
							We'll get back to you as soon as possible with suggestions or further questions! <br/>
							Click <a href ="/"> here </a> to return to the home page.
				</h3>
			</PageContainer>
		)
	}
}