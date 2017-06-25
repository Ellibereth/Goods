var React = require('react');
var ReactDOM = require('react-dom');
import TopNavBar from '../Nav/TopNavBar'
import Footer from '../Nav/Footer'
import MobileNavBar from '../Nav/MobileNavBar'
// import BottomNavBar from '../Nav/BottomNavBar'




export default class PageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		
	}




	render() {

		return (
				<div>
					<div className = "body-container hidden-xs">
						<div>
							<TopNavBar/>
								<div id="content">
									{this.props.component}
								</div>
							<Footer/>
						</div>
					</div>
					<div className = "hidden-sm hidden-md hidden-lg">
						<div>
							<MobileNavBar/>
								<div id="content">
									{this.props.component}
								</div>
							<Footer/>
						</div>
					</div>
				</div>
		);
	}
}