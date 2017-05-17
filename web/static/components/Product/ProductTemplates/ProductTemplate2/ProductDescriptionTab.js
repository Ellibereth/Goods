var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {} from 'react-bootstrap';
import AppStore from '../../../../stores/AppStore'
import styles from '..//product_styles.css'
import {formatPrice} from '../../../Input/Util'


export default class ProuctDescriptionTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_tab : 0
		}
	}

	componentDidMount(){


	}

	selectTab(index){
		this.setState({selected_tab : index})
	}



	render() {
		var product = this.props.product

		

		var description = (
				<div 
					className = { this.state.selected_tab == 0 ?
					"product-info-tab product_template_2_tabs"
					 :
					"product-info-tab product_template_2_tabs display-none"} >
					<ul className = "features-list">
					{this.props.product.description.split("\n").map(i => {
						return <li>{i}</li>;
					})}
						<li> Manufactured by {this.props.product.manufacturer}        </li>
						<li> Category: {this.props.product.category} </li>
						<li> Manufactured by {this.props.product.manufacturer}        </li>
						<li> Category: {this.props.product.category} </li>
						<li> Manufactured by {this.props.product.manufacturer}        </li>
						<li> Category: {this.props.product.category} </li>
						<li> Category: {this.props.product.category} </li>
						<li> Category: {this.props.product.category} </li>
						<li> Category: {this.props.product.category} </li>
						<li> Category: {this.props.product.category} </li>
						<li> Category: {this.props.product.category} </li>
					</ul>
				</div>
		)

		var maker = (
				<div className = { this.state.selected_tab == 1 ?
					"product-info-tab product_template_2_tabs"
					 :
					"product-info-tab product_template_2_tabs display-none"}>
					<span className = "block-span"> MEET YOUR MAKER </span>
					<span className = "block-span"> MEET YOUR MAKER </span>
					<span className = "block-span"> MEET YOUR MAKER </span>
					<span className = "block-span"> MEET YOUR MAKER </span>
				</div> 
			)
	
		
		return (
			<div className = "row">	
				<span className = "block-span">
					<ul className="list-inline product-page-tabs" >
						<li className= {this.state.selected_tab == 0 && "active"}>
							<a onClick = {this.selectTab.bind(this, 0)}> Features </a>
						</li>
						<li className = {this.state.selected_tab == 1 && "active"}> 
							<a onClick = {this.selectTab.bind(this, 1)}> Maker </a>
						</li>
					</ul>
					<div className = "small-buffer"/>
					<div className = "product_template_2_tab_container">
						{description}
						{maker}
					</div>
				</span>
			</div>	
		)
	}
}