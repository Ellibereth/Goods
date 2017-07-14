var React = require('react');
var ReactDOM = require('react-dom');
import ProductTopRow from './ProductTopRow'
import ProductMiddleRow from './ProductMiddleRow'

export default class ProductTemplate2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {

		return (

				<div className="fabBlock newProductpgDesign">
					<div className="fab-row">
						<ProductTopRow product = {this.props.product} />
						<div className="horizontal-line-wrap fab-col-xs-60 no-padding"><hr className="bottom-margin-xs"/></div>
						<ProductMiddleRow product = {this.props.product} />
					</div>
				</div>								
		);
	}
}