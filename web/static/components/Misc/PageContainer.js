var React = require('react');
var ReactDOM = require('react-dom');
import Footer from '../Nav/Footer'
import Navbar from '../Nav/Navbar'





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
					<div className = "page-top-row">
						<div className = "page-wrapper">
							<div className = "top-row-inner">
								<span className = "top-row-text"> Free Shipping. Free Returns. Smiles Guaranteed.</span>
								<span className = "top-row-text float-right"> 
									<span className = "glyphicon glyphicon-envelope top-row-envelope-icon"/>
								 	<span>Email Us</span>
								</span>
							</div>
						</div>
					</div>
					<div className = "page-wrapper">
						<Navbar />
						<div className = "content-wrapper"> 
							{this.props.component}
						</div>
					</div>
					<div className = "top-buffer"/>
					<Footer />
					<div className = "top-buffer"/>
				</div>
		);
	}
}