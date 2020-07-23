import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ProcessImage from '../../services/imageProcessing';
import RouteAuthentication from '../../services/RouteAuthentication';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { CriticalAlert } from "../helpers/Alert";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { createAvatarComponent, SrcSource, IconSource } from "react-avatar";
const Avatar = createAvatarComponent({ sources: [SrcSource, IconSource] });

class EditFormOrganizer extends React.Component {

  //TODO:
  //Telephone input: change to type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    let user = props.location.state;
    this.state = {
      name: user.name,
      email: user.email,
      city: user.city,
      picture: user.picture,
      //organizer schema attributes
      street: user.street,
      description: user.description,
      publicEmail: user.publicEmail,
      phone: user.phone,

      uploadProgress: 0,
      hiddenProgress: true,

      showAltert : false,
      errorMessage: "",

    };
    this.setUploadProgress = this.setUploadProgress.bind(this);
  }

  hideAlert = () => { this.setState({ showAltert: !this.state.showAltert }) }

  onChangeInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        //console.log(this.state);
  };

  componentDidMount() {

  }
  setUploadProgress = (progress) => {
    this.setState({uploadProgress: progress});
    /*
    if (this.state.uploadProgress >= 100) {
      setTimeout(this.setState({hiddenProgress: true}), 3000);
    }
    */
  }

  onChangeFile = (event) => {
    //setting the file to the input
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileUrl = URL.createObjectURL(file);
      let context = this;
      //defining the function
      async function processImage(file, fileUrl, context) {
        //console.log(file);
        try {
          let image = await ProcessImage(file, fileUrl, "profilePicture", context);
          context.setState({ picture: image });
          //console.log(context.state);
        }
        catch (error) {
          alert(error);
        }
      };

      //displaying progress bar
      this.setState({hiddenProgress:false});
      //calling the process function
      processImage(file, fileUrl, context);
    }

  };

  formCleaning = async () => {
    //form inputs we want to upload
    let keys = ["name", "email", "password", "city", "picture", "gender", "street", "description", "publicEmail", "phone"];
    //output object
    let output = {};
    //loop over the inputs
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      //checking if the input is null, empty, undefined, NaN, false, 0
      if (this.state[key]) {
        //if it's not empty, then save the non-null property to output object
        output[key] = this.state[key];
      }
    }
    //return non-null values
    return output;
  };

  registerUser = async (event) => {
    //prevent default behavior
    event.preventDefault();

    //if no email or pwd on the form, return
    if (!this.state.email) return;

    //saving the component scope
    var context = this;

    //deleting null values
    let form = await this.formCleaning();

    //post to organizer's registration api
    fetch('/update/organizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + window.sessionStorage.secret_token
      },
      body: JSON.stringify(form),
    }) //create a get request which is a Promise
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    })
    .then(function(res){
      //console.log("Logging Response");
      //console.log(res);
      document.getElementById("RegistrationFormOrganizer").reset();
      context.setState({
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

      //populate login data
      let data = {
        login: true,
        name: res.name,
        email: res.email,
        profilePicture: res.picture,
        userType: res.userType,
        secret_token: res.token
      };
      console.log(data);

      //call the app component and login the user
      context.props.logIn(data);

    })
    .catch(err => {
      this.setState({
        showAltert: true,
        errorMessage: "Error occured while sending to server. Request might not have been updated."
      })
      console.log(err)
  });
  };


  render() {

    return (
      <form className="form-group" id="RegistrationFormOrganizer" onSubmit={this.registerUser}>

      <CriticalAlert show={this.state.showAltert} change={this.hideAlert} text={this.state.errorMessage}/>

      <div className="row justify-content-start align-items-center ml-0 mr-0">
      <Avatar
        round="50%"
        size="150"
        src={this.state.picture}
        name={this.state.name}
        className="img-fluid mr-2 mt-1 mb-1"
      />
      <div class="form-group mb-0 mt-1 ml-1 mr-1">
        <div class="custom-file">
          <input type="file" accept="image/*" class="custom-file-input" name="picture" onChange={this.onChangeFile} id="customFile" />
          <label class="custom-file-label" for="customFile">Change your profile picture</label>
        </div>
      </div>

      <Link to={{ pathname: '/password' }} style={{textDecoration: "none"}} className="ml-1 mr-1 mt-1">
      <Button variant="outline-dark" className="">Change Password
      </Button>
      </Link>
      </div>

      <div class="form-group">
        <ProgressBar animated={true} min={0} max={100} striped={true} now={this.state.uploadProgress} label={this.state.uploadProgress} hidden={this.state.hiddenProgress} />
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="name">Organization Name</label>
        <input type="text" className="form-control border-red" id="name" name="name" onChange={this.onChangeInput} value={this.state.name} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="email">Private Email</label>
        <input type="email" className="form-control border-red" id="email" name="email" onChange={this.onChangeInput} placeholder="private@email.com (required)" value={this.state.email} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="publicEmail">Public Email</label>
        <input type="email" className="form-control border-red" id="publicEmail" name="publicEmail" onChange={this.onChangeInput} placeholder="public@email.com (required)" value={this.state.publicEmail} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="phone">Phone</label>
        <input type="number" className="form-control border-red" id="phone" name="phone" onChange={this.onChangeInput} placeholder="Your phone (required)" value={this.state.phone} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="street">Street</label>
        <input type="text" className="form-control border-red" id="street" placeholder="Gisselstraße 4 (required)" name="street" onChange={this.onChangeInput} value={this.state.street} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="city">City</label>
        <input type="text" className="form-control border-red" id="city" placeholder="Munich (required)" name="city" onChange={this.onChangeInput} value={this.state.city} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="description">Description</label>
        <textarea className="form-control" placeholder="Description of your business" name="description" onChange={this.onChangeInput} value={this.state.description}/>
      </div>

      <p className="text-muted"><b>Note:</b> All fields in pink are required.</p>

      <div className="row justify-content-center">
      <Link to={{ pathname: '/profile' }} style={{textDecoration: "none"}} className="mr-1">
      <Button variant="outline-dark" className="d-flex ml-auto">Cancel
      </Button>
      </Link>
      <div className="form-group ml-1">
        <input type="submit" className="btn button-pink" value="Submit"/>
      </div>
      </div>

    </form>

    )

  }

}

export default RouteAuthentication(EditFormOrganizer);
