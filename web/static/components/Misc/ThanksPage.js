var React = require('react')
var ReactDOM = require('react-dom')
import PageContainer from './PageContainer'

export default class ThanksPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}




	render() {    	
		return (
			<PageContainer>
				<div className = "container">
					<h1>
						Thanks for signing up! Click <a href = "/">here</a> to start shopping now!
					</h1>
				</div>
			</PageContainer>
		)
	}
}