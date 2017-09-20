var React = require('react')
var ReactDOM = require('react-dom')
var Link = require('react-router').Link
var browserHistory = require('react-router').browserHistory
import ReactDOMServer from 'react-dom/server'

import AppStore from '../../../../stores/AppStore.js'
import {AlertMessages} from '../../../Misc/AlertMessages'
import {toTitleCase} from '../../../Input/Util'
import {Popover} from 'react-bootstrap'
import {OverlayTrigger} from 'react-bootstrap'

export default class CardPreview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}

	componentDidMount(){
		
	}

	deleteCardPress(){
		this.props.deleteCardPress(this.props.card)
	}

	setDefaultCard(){
		this.props.setLoading(true)
		var data = {}
		data['jwt'] = localStorage.jwt
		data['card_id'] = this.props.card.id
		var form_data = JSON.stringify(data)
		$.ajax({
			type: 'POST',
			url: '/setDefaultCard',
			data: form_data,
			success: function(data) {
				if (!data.success) {
					this.props.setFadingText(data.error.title)
				}
				else {
					this.props.setFadingText(AlertMessages.DEFAULT_CARD_SET_SUCCESS.title)
					this.props.refreshSettings()
				}
				this.props.setLoading(false)
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'setDefaultCard',
					eventLabel: AppStore.getCurrentUser().email
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	getDefaultButton(){
		if (this.props.card.id == AppStore.getCurrentUser().default_card) {
			return (
				<button className = "btn btn-default btn-sm" disable = {true}>
					Default card
				</button>
			)
		}
		else{
			return (
				<button className = "btn btn-default btn-sm" onClick = {this.setDefaultCard.bind(this)}>
					Set as default 
				</button>
			)

		} 
	}


	getPopoverContent(card){
		return (
			<Popover id="popover-trigger-click" title="Billing Address">
				<span className = "account-page-text block-span"> {toTitleCase(card.metadata.address_name)}  </span>
				<span className = "account-page-text block-span"> {toTitleCase(card.address_line1)}  </span>
				<span className = "account-page-text block-span"> {toTitleCase(card.address_line2)}  </span>
				<span className = "account-page-text block-span"> {toTitleCase(card.address_city)}, {card.address_state}</span>
				<span className = "account-page-text block-span"> {card.address_zip}</span>
			</Popover>
		)


	}

	render() {
		var card = this.props.card
		var default_button = this.getDefaultButton.bind(this)()
		var billing_address_popover_content = this.getPopoverContent(card)
		return (
			<div className = "col-sm-4 col-md-4 col-lg-4 settings-preview-column grey-solid-border">
				<div className = "row ">
					<div className = "col-sm-6">
						<span className = "account-page-text block-span"> {card.name} </span>
						<span className = "account-page-text block-span"><b>{card.brand}</b> ending in {card.last4}  </span> 
						<span className = "account-page-text block-span"> Exp. {card.exp_month} / {card.exp_year}  </span>
						<span className = "account-page-text block-span"> <div className = "small-buffer"/> </span>
					</div>
					<div className = "col-sm-6">
						<OverlayTrigger rootClose ={true} trigger = "click" placement = "top" 
							overlay = {billing_address_popover_content}>
							<span style = {{fontSize : '14px'}}
								className = "edgar-link"> 
								Show Billing Address 
							</span>
						</OverlayTrigger>
						
					</div>
				</div>
				<div className = "row">
					<div className = "col-xs-12">
						<span className = "block-span"> 
							{default_button}
							<button style = {{'margin-left' : '8px'}} className = "btn btn-default btn-sm" onClick = {this.deleteCardPress.bind(this)}>
								Delete 
							</button>
						</span>
					</div>
				</div>
			</div>

		)
	}
}

