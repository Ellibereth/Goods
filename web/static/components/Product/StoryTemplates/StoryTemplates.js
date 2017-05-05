var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {Button} from 'react-bootstrap';
import StoryTemplate1 from './StoryTemplate1/StoryTemplate1'

export default class StoryTemplates extends React.Component {
	// takes props template number
	// product, is_loading, 
	constructor(props) {
		super(props);
		this.getTemplate = this.getTemplate.bind(this)
	}


	getTemplate(product){
		var template = product.story_template;
		console.log(product)
		switch (template){
			case 1:
				console.log("case 1")
				return <StoryTemplate1 
						product = {this.props.product}
						is_loading = {this.props.is_loading}
						invalid_product = {this.props.invalid_product}
					/>
				break;
			default:
				return <div/>;
		}
	}

	render(){
		if (this.props.product){
			var this_template = this.getTemplate.bind(this)(this.props.product)
		}
		else {
			var this_template = <div/>
		}

		return (
			<div>
				{this_template}
			</div>
		)

	}
}