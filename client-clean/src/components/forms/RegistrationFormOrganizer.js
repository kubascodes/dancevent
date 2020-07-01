import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ProcessImage from '../../services/imageProcessing';

class RegistrationFormOrganizer extends React.Component {

  //TODO:
  //Telephone input: change to type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    this.state = {
      //user schema attributes
      name: null,
      email: null,
      password: null,
      city: null,
      picture: null,
      //organizer schema attributes
      street: null,
      description: null,
      publicEmail: null,
      phone: null
    };
  }

  onChangeInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state);
  };

  onChangeFile = (event) => {
    //setting the file to the input
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileUrl = URL.createObjectURL(file);
      let component_scope = this;
      //defining the function
      async function processImage(file, fileUrl, component_scope) {
        console.log(file);
        try {
          let image = await ProcessImage(file, fileUrl);
          component_scope.setState({ picture: image });
          console.log(component_scope.state);
        }
        catch (error) {
          alert(error);
        }
      };

      //calling the function
      processImage(file, fileUrl, component_scope);
    }

  };

  registerUser = (event) => {
    //prevent default behavior
    event.preventDefault();

    //if no email or pwd on the form, return
    if (!this.state.email || !this.state.password) return;

    //saving the component scope
    var component_scope = this;

    //post to organizer's registration api
    fetch('/register/organizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        //user schema attributes
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        city: this.state.city,
        picture: this.state.picture,
        //organizer schema attributes
        street: this.state.street,
        description: this.state.description,
        publicEmail: this.state.publicEmail,
        phone: this.state.phone
      },
      ),
    }) //create a get request which is a Promise
    .then(res => res.json(res))
    .then(function(res){
      //console.log("Logging Response");
      console.log(res);
      document.getElementById("RegistrationFormOrganizer").reset();
      component_scope.setState({
        //user schema attributes
        name: null,
        email: null,
        password: null,
        city: null,
        picture: null,
        //organizer schema attributes
        street: null,
        description: null,
        publicEmail: null,
        phone: null
      });
    })
    .catch(err => alert(err));
  };

  dataToParent (data) {
    //console.log(data);
    this.props.auth(data);
  }


  render() {

    return (
      <form className="form-group" id="RegistrationFormOrganizer" onSubmit={this.registerUser}>

      <div className="form-group">
        <label className="label-bold" htmlFor="name">Organization Name</label>
        <input type="text" className="form-control" id="name" name="name" placeholder="Your Name" onChange={this.onChangeInput} value={this.name}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="email">Private Email</label>
        <input type="email" className="form-control" id="email" name="email" onChange={this.onChangeInput} placeholder="Required private@email.com" value={this.email}/>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" className="form-control" id="password" name="password" onChange={this.onChangeInput} placeholder="Required" value={this.password}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="publicEmail">Public Email</label>
        <input type="email" className="form-control" id="publicEmail" name="publicEmail" onChange={this.onChangeInput} placeholder="Required public@email.com" value={this.publicEmail}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="phone">Phone</label>
        <input type="number" className="form-control" id="phone" name="phone" onChange={this.onChangeInput} placeholder="Your phone" value={this.phone}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="street">Street</label>
        <input type="text" className="form-control" id="street" placeholder="Gisselstraße 4" name="street" onChange={this.onChangeInput} value={this.street}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="city">City</label>
        <input type="text" className="form-control" id="city" placeholder="Munich" name="city" onChange={this.onChangeInput} value={this.city}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="description">Description</label>
        <textarea className="form-control" placeholder="Description of your business" name="description" onChange={this.onChangeInput} value={this.description}/>
      </div>

      <div class="form-group">
        <div class="custom-file">
          <input type="file" accept="image/*" class="custom-file-input" name="picture" onChange={this.onChangeFile} id="customFile" />
          <label class="custom-file-label" for="customFile">Upload your profile picture</label>
        </div>
      </div>

      <div className="form-group">
        <input type="submit" className="btn btn-outline-dark" value="Submit"/>
      </div>
    </form>

    )

  }

}

export default RegistrationFormOrganizer
