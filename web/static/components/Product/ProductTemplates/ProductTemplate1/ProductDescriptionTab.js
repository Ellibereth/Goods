var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
import AppStore from '../../../../stores/AppStore'
import {formatPrice} from '../../../Input/Util'


export default class ProuctDescriptionTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_tab : 0
		}
	}

	componentDidMount(){
		$(document).ready(function() {
			$('#myTab a:first').tab('show')
		})
	}

	selectTab(index){
		this.setState({selected_tab : index})
	}



	render() {
		var product = this.props.product

		var description = (
				<div className = "product-info-tab">
					<ul className = "features-list">
						{this.props.product.description.split("\n").map(i => {
							return <li>{i}</li>;
						})}
					</ul>
				</div>
		)

		var maker = (
				<div className = "product-info-tab">
					<ul className = "features-list">
						{this.props.product.second_tab_text.split("\n").map(i => {
							return <li>{i}</li>;
						})}
					</ul>
				</div> 
			)
	
		
		return (
			<div className = "row">	
				<span className = "block-span">
					<ul className="list-inline product-page-tabs">
						<li className= {this.state.selected_tab == 0 && "active"}>
							<a onClick = {this.selectTab.bind(this, 0)}> Features </a>
						</li>
						{this.props.product.second_tab_name &&
							<li className = {this.state.selected_tab == 1 && "active"}> 
								<a onClick = {this.selectTab.bind(this, 1)}> {this.props.product.second_tab_name} </a>
							</li>
						}
					</ul>
					<div className = "small-buffer"/>
					{ this.state.selected_tab == 0 && description}
					{ this.state.selected_tab == 1 && maker}
				</span>
			</div>	
		)
	}
}