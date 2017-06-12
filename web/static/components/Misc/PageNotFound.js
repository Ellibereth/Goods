var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from './PageContainer'

export default class PageNotFound extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	}
  }




  render() {
  	var component = (
  			<div className = "container">
				<h1>
					What a prank! You tried to go to a bad page! <br/>
					Click <a href ="/"> here </a> to return to the home page.
				</h1>
			</div>
		)
  	
	return (
		<PageContainer component = {component}/>
	);
  }
}