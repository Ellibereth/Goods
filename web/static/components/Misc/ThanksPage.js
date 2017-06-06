var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import PageContainer from './PageContainer'

export default class ThanksPage extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	}
  }




  render() {
  	var component = (
  			<div className = "container">
				<h1>
					Thanks for signing up!
				</h1>
			</div>
		)
  	
	return (
		<PageContainer component = {component}/>
	);
  }
}