import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';

//TODO we'd want to use composition to define forms

class RegistrationForm extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      token: null,
      name: null,
      email: null,
      password: null,
      yearOfBirth: null,
      gender: null,
      city: null
    };
  }
  onChange = (event) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state);

  }

  userRegistration = (event) => {
    event.preventDefault();
    if (!this.state.email || !this.state.password) return;
    /*
    fetch('/login', { email: 'test@test.com', password: 'testing' }) //create a get request which is a Promise
    .then(function(data){
      console.log(data)
    }).catch(err => console.log(err))
    */

    var component_scope = this;
    var secret_token = window.sessionStorage.secret_token;
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + secret_token
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        yearOfBirth: this.state.yearOfBirth,
        gender: this.state.gender,
        city: this.state.city
      }),
    }) //create a get request which is a Promise
    .then(res => res.json(res))
    .then(function(res){
      console.log(res);
      document.getElementById("RegistrationForm").reset();
      component_scope.setState({
        name: null,
        email: null,
        password: null,
        yearOfBirth: null,
        gender: null,
        city: null
      });
    })
    .catch(err => alert(err));
  }

  dataToParent (data) {
    console.log(data);
    this.props.auth(data);
  }


  render() {

    return (


      <div className="container" className="RegistrationForm">

      <form className="form-group" id="RegistrationForm" onSubmit={this.userRegistration}>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" className="form-control" id="name" name="name" onChange={this.onChange} value={this.name}/>
      </div>

      <div className="form-group">
        <label htmlFor="rating">Email</label>
        <input type="email" className="form-control" id="email" name="email" onChange={this.onChange} placeholder="Required" value={this.email}/>
      </div>

      <div className="form-group">
        <label htmlFor="rating">Password</label>
        <input type="password" className="form-control" id="password" name="password" onChange={this.onChange} placeholder="Required" value={this.password}/>
      </div>

      <div className="form-group">
        <label htmlFor="city">Year of Birth</label>
        <input type="text" className="form-control" id="yearOfBirth" name="yearOfBirth" onChange={this.onChange} value={this.yearOfBirth}/>
      </div>

      <div className="form-group">
        <label htmlFor="city">Gender</label>
        <input type="text" className="form-control" id="gender" name="gender" onChange={this.onChange} value={this.gender}/>
      </div>

      <div className="form-group">
        <label htmlFor="city">City</label>
        <input type="text" className="form-control" id="city" name="city" onChange={this.onChange} value={this.city}/>
      </div>


      <div className="form-group col-sm-12 center">
        <input type="submit" className="btn btn-outline-dark" value="Submit"/>
      </div>
    </form>
    </div>
    )

  }

}

export default RegistrationForm
