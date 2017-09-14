var React = require('react')
var ReactDOM = require('react-dom')
import PageContainer from './PageContainer'


export default class TermsOfServicePage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		return (
			<PageContainer>
				<div className = "container">
					<h2> Terms of Service </h2>
					<h5> Lorem Ipsum </h5>
				</div>
			</PageContainer>
		)
	}
}