import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

class RegistrationFormOrganizer extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
  }



  render() {

    if (!window.sessionStorage.secret_token) {

    return (


      <div class="container" className="RegistrationForm">

      <form class="form-group" id="RegistrationForm" onSubmit={this.userRegistration}>

      <div class="form-group">
        <label for="rating">Email</label>
        <input type="email" class="form-control" id="email" name="email" onChange={this.onChange} placeholder="Required" value={this.email}/>
      </div>

      <div class="form-group">
        <label for="rating">Password</label>
        <input type="password" class="form-control" id="password" name="password" onChange={this.onChange} placeholder="Required" value={this.password}/>
      </div>

      <div class="form-group">
        <label for="first_name">First name</label>
        <input type="text" class="form-control" id="first_name" name="first_name" onChange={this.onChange} value={this.first_name}/>
      </div>

      <div class="form-group">
        <label for="last_name">Last name</label>
        <input type="text" class="form-control" id="last_name" name="last_name" onChange={this.onChange} value={this.last_name}/>
      </div>

      <div class="form-group">
        <label for="last_name">Company</label>
        <input type="text" class="form-control" id="company" name="company" onChange={this.onChange} value={this.company}/>
      </div>

      <div class="form-group col-sm-12 center">
        <input type="submit" class="btn btn-outline-dark" value="Submit"/>
      </div>
    </form>
    </div>
    )

  }
  else {
    return(
      <LoginForm />
    )
  }

  }

}

export default RegistrationFormOrganizer
