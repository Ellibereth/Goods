var React = require('react');
var ReactDOM = require('react-dom');
import ProductRequestTextInput from './ProductRequestFormTextInput.js'
import Navbar from '../Navbar/Navbar.js'

var real_url = "https://whereisitmade.herokuapp.com"
var test_url = "http://0.0.0.0:5000"
const form_labels = ['Product Description', "Price Minimum", "Price Maximum", "Contact Information"]
const form_inputs = ["product_description", "price_min", "price_max", "contact_information"]


export default class ProductRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_description : "",
      price_min : "",
      price_max: "",
      contact_information: "",     
    }
  }


  // handle the text input changes
  onTextInputChange(field, value){
    var obj = {}
    obj[field] = value
    this.setState(obj)
  }

  //handle the image uploads

  onSubmitPress(){
            var form_data = JSON.stringify({
              "product_description" : this.state.product_description,
              "price_min" : this.state.price_min,
              "price_max" : this.state.price_max,
              "contact_information" : this.state.contact_information
            })

            $.ajax({
              type: "POST",
              url: test_url  + "/addProductRequest",
              data: form_data,
              success: function() {
                  window.location.reload();
              },
              error : function(){
                console.log("error")
              },
              dataType: "json",
              contentType : "application/json; charset=utf-8"
          });
        }

  getTextInputs(){
    var text_inputs = []
    for (var i = 0; i < form_inputs.length; i++){
      var this_input = form_inputs[i]
      text_inputs.push(
          <ProductRequestTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
          value = {this.state[this_input]} field = {this_input} label = {form_labels[i]}/>
        )
    }
    return text_inputs
  }

  render() {
    var text_inputs = this.getTextInputs.bind(this)()

    return (
      <div> 
        <Navbar/>
        <div id = "form">
            {text_inputs}
            <button type="submit" id = "submit_button" onClick = {this.onSubmitPress.bind(this)}> Submit </button>
        </div>
      </div>
      )
    }
  }

