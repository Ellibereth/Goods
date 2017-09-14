var React = require('react')
var ReactDOM = require('react-dom')

var browserHistory = require('react-router').browserHistory
import PageContainer from '../Misc/PageContainer'

import {AlertMessages} from '../Misc/AlertMessages'

export default class FaqPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}


	render() {

		return (
			<PageContainer>
				<div className = "container">
					<h1> Request a Product Page </h1>
				</div>
			</PageContainer>
		)
	}
}