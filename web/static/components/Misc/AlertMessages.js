
export const AlertMessages = {
	 MUST_SELECT_VARIANT  : function (variant_type_description) {
	 	return {
	 		title : 'You must select a ' + variant_type_description + '.',
	 		type : 'error'
	 	}
	 },
	 INTERNAL_SERVER_ERROR : {title : 'Something went wrong, try again',type : 'error'},
	 ITEM_ADDED_TO_CART : {
		title: 'This item is now in your cart.',
		type: 'success',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'View Cart',
		cancelButtonText: 'Continue Shopping',
		closeOnConfirm: true,
		closeOnCancel: true
	},

	 NON_USER_ADD_TO_CART_ATTEMPT : {title: 'Sign up before adding items to cart',
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Register Now',
		showCloseButton: true,
		closeOnConfirm: true,
		allowOutsideClick: true
	},

	NON_USER_ADD_TO_CART : {
	 			title: 'Added to cart',
	 			title : 'You will still have to use an account to complete checkout',
	 			type : 'success',

		closeOnConfirm: true,
		allowOutsideClick: true
	},

	 CONFIRMATION_EMAIL_SENT : function (email) {
		return {
			title : 'Confirmation email resent to ' + email,
			text : 'Check your email again',
			type : 'success'
		}
	},

	 ITEMS_IN_CART_HAVE_BEEN_MODIFIED (message) {
		return {
			title: 'Some items in your cart have been modified',
			text: message,
			type : 'info',
			showCancelButton: false,
			confirmButtonText: 'View Changes',
			cancelButtonText: 'Keep Shopping',
			closeOnConfirm: true,
			closeOnCancel: true
		}
	},

	 SUCCESFUL_FEEDBACK_COMPLETION : {
		title : 'Your feedback is appreciated', 
		text : 'Redirecting you to the homepage shorlty', 
		type : 'success',
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Ok',
		closeOnConfirm: true
	},

	 LIVE_CHANGES_WILL_BE_MADE : {
			  title: 'ARE YOU SURE?',
			  text: 'ONCE YOU HIT OKAY, THIS CHANGE WILL BE SEEN LIVE',
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#DD6B55',
			  confirmButtonText: 'Yes',
			  cancelButtonText: 'No!',
			  closeOnConfirm: true,
			  closeOnCancel: true
	},

	 CHANGE_WAS_SUCCESSFUL : {
		title : 'Success!', 
		text : 'Your change was succesful', 
		type : 'success'
	},

	 ARE_YOU_SURE_YOU_WANT_TO_DELETE : function (input) {
	 		return {
			  title: 'Ready?',
			  text: 'Are you sure you want to delete ' + input + '?',
			  showCancelButton: true,
			  confirmButtonColor: '#DD6B55',
			  confirmButtonText: 'Yes',
			  cancelButtonText: 'No!',
			  closeOnConfirm: true,
			  closeOnCancel: true
		}
	},

	 DELETE_SUCCESS : {
		title : 'Thank you!', 
		text : 'You have deleted this request!', 
		type : 'success'
	},

	 DELETE_FAILURE : {
		title : 'Sorry!',
		text:  'We weren\'t able to delete it!', 
		type : 'error'
	},

	 NICE_TRY_MAN : {
		title : 'nice try!'
	},

	YOU_WILL_LOSE_SAVED_INFORMATION : {
		title: 'Are you sure?',
		text: 'Typed information will not be saved',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Close',
		cancelButtonText: 'No',
		closeOnConfirm: true,
		closeOnCancel: true
	},

	IS_ALL_YOUR_INFORMATION_CORRECT : {
			  title: 'Ready?',
			  text: 'Is all your information correct?',
			  showCancelButton: true,
			  confirmButtonColor: '#DD6B55',
			  confirmButtonText: 'Yes',
			  cancelButtonText: 'No!',
			  closeOnConfirm: true,
			  closeOnCancel: true
	},
	DEFAULT_ADDRESS_SET_SUCCESS : {
		title: 'Default address set',
		type: 'success'
	},
	DEFAULT_CARD_SET_SUCCESS :{
		title: 'Default card set',
		type: 'success'
	},
	INVALID_CREDENTIALS : {
		title : 'Sorry!',
		text : 'Your password was incorrect. Please try again!', 
		type : 'warning'
	},
	ARE_YOU_SURE_DELETE_ACCOUNT : {
		  title: 'You sure?',
		  text: 'It will be very difficult to undo this if you change your mind later?',
		  type : 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#DD6B55',
		  confirmButtonText: 'Yes',
		  cancelButtonText: 'No!',
		  closeOnConfirm: false,
		  closeOnCancel: true
	},
	ACCOUNT_DELETE_SUCCESS : {
	  title: 'Thank you!',
	  text: 'Your account has been deleted. You will be redirected to home page shortly...',
	  type: 'success',
	  confirmButtonText: 'Ok!',
	  closeOnConfirm: true,
	},
	ARE_YOU_SURE_CHANGE_PASSWORD : {
		  title: 'Ready?',
		  text: 'Are you sure you want to change your password?',
		  showCancelButton: true,
		  confirmButtonColor: '#DD6B55',
		  confirmButtonText: 'Yes',
		  cancelButtonText: 'No!',
		  closeOnConfirm: false,
		  closeOnCancel: true
	},

	ARE_YOU_SURE_REMOVE_ITEM_FROM_CART : {
		  title: 'You sure?',
		  text: 'Are you sure you want to remove this item from your cart?',
		  showCancelButton: true,
		  confirmButtonColor: '#DD6B55',
		  confirmButtonText: 'Yes',
		  cancelButtonText: 'No!',
		  closeOnConfirm: true,
		  closeOnCancel: true
	},
	CHECKOUT_SUCCESSFUL : { 
		title : 'Thank you!', 
		text : 'You will receive a confirmation email for this purchase. \
			You will be redirected to a confirmation page shortly.',
		type : 'success'
	},
	CONTACT_CUSTOMER_SERVICE : {
		title : 'We\'re sorry!',
		text : 'Please contact customer service to discuss what you tried to do.',
		type: 'error'
	},
	NEW_PASSWORD_HAS_BEEN_SET : {
		title: 'Password has been set',
		// text: "You will not be able to recover this imaginary file!",
		type: 'success',
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Return to home page to login',
		closeOnConfirm: true
	},

	RECOVERY_PIN_SENT : function (email)  {	
		return {
			title : 'A recovery email has been sent to ' + email,
			type: 'success',
			confirmButtonColor: '#DD6B55',
			confirmButtonText: 'Ok',
			closeOnConfirm: true
		}
	},
				

	RECOVERY_PIN_NOT_SENT : function (email)  {	
		return {
			title :  email + ' is not associated with an account',
			type: 'error',
			confirmButtonColor: '#DD6B55',
			confirmButtonText: 'Try Again',
			closeOnConfirm: true
		}
	},



	ACCOUNT_REGISTRATION_SUCCESS : {
		title: 'Thank you', 
		text : 'Your account has been created. You should receive a confirmation email shortly',
		type: 'success'
	},
			
	DELETE_CARD_ENDING_IN : function(last4) {
		return  {
		  title: 'Ready?',
		  text : 'Are you sure you want to delete card ending in ' + last4 + '?',
		  showCancelButton: true,
		  confirmButtonColor: '#DD6B55',
		  confirmButtonText: 'Yes',
		  cancelButtonText: 'No',
		  closeOnConfirm: true,
		  closeOnCancel: true
		}
	},

	CHECKOUT_CONFIRM : function (text) {
		return {
			title: 'Confirm',
			text: text,
			showCancelButton: true,
			confirmButtonColor: '#DD6B55',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			closeOnConfirm: true,
			closeOnCancel: true
		}
	}


}