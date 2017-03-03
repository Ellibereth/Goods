import React, { Component } from 'react';

export default class SubmissionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_name : "",
      origin: "",
      photo : "",
      contact_information : "",
      url_link : "",
      manufacturer: ""
    }
  } 

  handleNameChange(event){
    this.setState({product_name: event.target.value})
  }

  handleOriginChange(event){
    this.setState({origin: event.target.value})
  }

  handleContactInformationChange(event){
    this.setState({contact_information : event.target.value})
  }

  handleUrlLinkChange(event){
    this.setState({url_link : event.target.value})
  }

  handleManufacturerChange(event){
    this.setState({manufacturer : event.target.value})
  }
  // here we have a form that will return all of these 
  // name,origin, where you found, attach a photo, contact information, link to a url, manufacturer 


  render() {
    return (
      <div className="SubmissionForm">
      <form>
        <div className="form-group">
                <label> Product Name </label>
                <input type="text" placeholder="Enter Product Name" onChange={this.handleNameChange.bind(this)}/>
        </div>
        <div className="form-group">
                <label> Origin </label>
                <input type="text" placeholder="Enter Origin" onChange={this.handleOriginChange.bind(this)}/>
        </div>
          
        <div className="form-group">
                <label> Contact Information (Email or Phone) </label>
                <input type="text" placeholder="Enter Contact"onChange={this.handleContactInformationChange.bind(this)}/>
        </div>

        <div className="form-group">
                <label> Link to URL </label>
                <input type="text" placeholder="Enter Product URL "onChange={this.handleUrlLinkChange.bind(this)}/>
        </div>

        <div className="form-group">
                <label> Manufacturere Name </label>
                <input type="text" placeholder="Enter Manufacturer"onChange={this.handleManufacturerChange.bind(this)}/>
        </div>

     
      </form>
           <p>
            {this.state.product_name}
          </p>
      </div>
    );
  }
}

