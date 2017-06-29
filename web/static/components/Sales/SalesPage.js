var React = require('react');
var ReactDOM = require('react-dom');


import PageContainer from '../Misc/PageContainer'
import Spinner from '../Misc/Spinner'



export default class SalesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {
		var component = <div className = "container">
							<h1>
								This will be the sales page.
							</h1>

						</div>



		return (
				<PageContainer component ={component}/>
		);
	}
}
