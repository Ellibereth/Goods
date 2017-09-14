var React = require('react')
var ReactDOM = require('react-dom')
import PageContainer from './PageContainer'

export default class PageNotFound extends React.Component {
  	constructor(props) {
		super(props)
		this.state = {
		}
  	}

	render() {

		return (
			<PageContainer> 
				<h3>
					What a prank! You tried to go to a bad page! <br/>
					Click <a className = "edgar-link" href ="/">here</a> to return to the home page.
				</h3>
			</PageContainer>
		)
	}
}