var React = require('react');
var ReactDOM = require('react-dom');
import {Grid, Row, Col} from 'react-bootstrap';
import TopNavBar from '../Navbar/TopNavBar.js'
import HomeMiddleRow from './HomeMiddleRow.js'
import HomePageTopRow from './HomePageTopRow'
import HomeThirdRow from './HomeThirdRow'

export default class HomePageMainContainer extends React.Component {
	constructor(props) {
	super(props);
	this.state = {

		}
	}


	render() {


		return (
			<Grid>
				<HomePageTopRow toggleRequestFormModal = {this.props.toggleRequestFormModal}/>
				<hr/>
				<HomeMiddleRow/>
				<hr/>
				<HomeThirdRow toggleFeedbackModal = {this.props.toggleFeedbackModal} />
				
			</Grid>
		);
	}
}