import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';

//common registration form for dancer and organizer

class Form extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: null,
      password: null,
      token: null,
      first_name: null,
      last_name: null
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
        email: this.state.email,
        password: this.state.password,
        first_name: this.state.first_name,
        last_name: this.state.last_name
      }),
    }) //create a get request which is a Promise
    .then(res => res.json(res))
    .then(function(res){
      console.log(res);
      document.getElementById("RegistrationForm").reset();
      component_scope.setState({
        password: null,
        email: null,
        first_name: null,
        last_name: null
      });
    })
    .catch(err => alert(err));
  }

  dataToParent (data) {
    console.log(data);
    this.props.auth(data);
  }


  render() {

    if (!window.sessionStorage.secret_token) {

    return (
      <form class="form-group" id="RegistrationForm" onSubmit={this.userRegistration}>
      {props.children}
      <div class="form-group col-sm-12 center">
        <input type="submit" class="btn btn-outline-dark" value="Submit"/>
      </div>
    </form>
    )

  }
  else {
    return(
      <LoginForm />
    )
  }

  }

}

export default Form
