
import React from 'react';
import {Component} from 'react'
import {StyleSheet, View} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {Actions} from 'react-native-router-flux';

import StepIndicator from 'react-native-step-indicator'
const CART_INDEX = 0
const CHECKOUT_INDEX = 1
const ORDER_CONFIRMED_INDEX = 2
export default class CheckoutStepIndicator extends Component {
	constructor(props) {
		super(props)
		this.state = {	
		}
	}
	
	getCurrentStep(){
		var current_scene = Actions.currentScene
		if (current_scene == "cart") {
			return CART_INDEX
		}
		else if (current_scene == "checkout") {
			return CHECKOUT_INDEX
		}
		else if (current_scene == "order_confirmed") {
			return ORDER_CONFIRMED_INDEX
		}
	}
	
	render() {
		var current_step = this.getCurrentStep()
		return (
			<View style={styles.stepIndicator}>
			  <StepIndicator 
			  stepCount = {3}
			  customStyles={secondIndicatorStyles} 
			  currentPosition={current_step} 
			  labels={["Cart","Checkout","Order Placed"]} />
			</View>
		
	);
  }

}



const secondIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}




const styles = StyleSheet.create({
  
  stepIndicator: {
	marginVertical:4,
  },
});
			






