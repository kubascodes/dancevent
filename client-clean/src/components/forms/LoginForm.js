import React from "react";
import { Redirect } from "react-router-dom";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: null,
      password: null,
      token: null,
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
  };

  userLogin = (event) => {
    event.preventDefault();
    if (!this.state.email || !this.state.password) return;
    /*
    fetch('/login', { email: 'test@test.com', password: 'testing' }) //create a get request which is a Promise
    .then(function(data){
      console.log(data)
    }).catch(err => console.log(err))
    */

    var component_scope = this;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }) //create a get request which is a Promise
      .then((res) => res.json(res))
      .then(function (res) {
        //store the token in the browser's session storage
        window.sessionStorage.setItem("secret_token", res.token);

        //console.log(res.token);
        //this.setState({ secret_token: res.token});
        //var token = res.token;
        //setting the app's token to secret_token
        //component_scope.props.auth_token(token);
        //component_scope.setState({token: token});
        //alert("Data uploaded!");
        //console.log(res);
        document.getElementById("loginForm").reset();
        component_scope.setState({
          password: null,
          email: null,
        });
        var data = {
          token: res.token,
          email: res.email,
          login: true,
        };
        component_scope.props.logIn(data);
        //component_scope.setState({isLoggedIn: true});
        //this.forceUpdate();
      })
      .catch((err) => alert(err));
  };

  /*
  handleLoginClick = (event) => {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick = (event) => {
    this.setState({isLoggedIn: false});
  }

  LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

   LogoutButton(props) {
    return (
      <button onClick={props.onClick}>
        Logout
      </button>
    );
  }
*/
  render() {
    /*Logged In*/
    if (window.sessionStorage.secret_token != null) {
      return <Redirect to="/" />;
    } else {
      /*Not Logged In*/
      return (
        <div className="container loginForm" className="loginForm">
          <div id="img-homepage"></div>
          <form className="form-group" id="loginForm" onSubmit={this.userLogin}>
            <div className="form-group">
              <label htmlFor="rating">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                onChange={this.onChange}
                value={this.email}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={this.onChange}
                value={this.password}
              />
            </div>

            <div className="form-group col-sm-12 center">
              <input
                type="submit"
                className="btn btn-outline-dark"
                value="Submit"
              />
            </div>
          </form>
        </div>
      );
    }
  }
}

export default LoginForm;
