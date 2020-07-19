import React, {useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ProcessImage from '../../services/imageProcessing';
import RouteAuthentication from '../../services/RouteAuthentication';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { CriticalAlert } from "../helpers/Alert";
import { createAvatarComponent, SrcSource, IconSource } from "react-avatar";
const Avatar = createAvatarComponent({ sources: [SrcSource, IconSource] });

class PasswordChange extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    let user = props.location.state;
    this.state = {
      //user schema attributes
      oldPassword: null,
      newPassword1: null,
      newPassword2: null,
      showAltert : false,
      errorMessage: "",
    };
  }


  hideAlert = () => { this.setState({ showAltert: !this.state.showAltert }) }

  onChangeInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
  };


  formCleaning = async () => {
    //form inputs we want to upload
    let keys = ["oldPassword", "newPassword1", "newPassword2"];
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
    //console.log("Output form cleaning");
    //console.log(output);
    console.log(output);
    return output;
  };

  changePassword =  async (event) => {
    //prevent default behavior
    event.preventDefault();
    let context = this;
    //if no email or pwd on the form, return
    if (this.state.newPassword1 != this.state.newPassword2) {
      alert("The passwords do not match!");
      return;
    }

    let form = await this.formCleaning();
    console.log(form);
 
    fetch('/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(form),
    })
    .then(res => {
      console.log(res);
    }
    )
    .then(function(res){
      document.getElementById("PasswordForm").reset();
      context.setState({
        oldPassword: null,
        newPassword1: null,
        newPassword2: null,
      });
    })

  };


  render() {


    return (
      <div>
      <h4 className="text-center">Change Password</h4>
      <form className="form-group" id="PasswordForm" onSubmit={this.changePassword}>

      <CriticalAlert show={this.state.showAltert} change={this.hideAlert} text={this.state.errorMessage}/>



      <div className="form-group">
        <label htmlFor="password">Old Password</label>
        <input type="password" className="form-control border-red" id="oldPassword" name="oldPassword" onChange={this.onChangeInput} placeholder="Pwd (required)" value={this.state.oldPassword} required/>
      </div>

      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <input type="password" className="form-control border-red" id="newPassword1" minlength="6" name="newPassword1" onChange={this.onChangeInput} placeholder="Pwd (required)" value={this.state.newPassword1} required/>
      </div>

      <div className="form-group">
        <label htmlFor="password">Repeat New Password</label>
        <input type="password" className="form-control border-red" id="newPassword2" minlength="6" name="newPassword2" onChange={this.onChangeInput} placeholder="Pwd (required)" value={this.state.newPassword2} required/>
      </div>


      <div className="form-group">
        <input type="submit" className="btn button-pink" value="Submit"/>
      </div>


    </form>
    </div>

      )

  }

}

export default PasswordChange;
