import React from "react";
import RouteRedirect from "../../services/RouteRedirect";
import { Link } from "react-router-dom";
import { CriticalAlert } from "../helpers/Alert";



class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secret_token: null,
      login: false,
      email: null,
      password: null,

      showAltert : false,
      errorMessage: "",
    };
    //binding events to the component context
    this.userLogin = this.userLogin.bind(this);
    this.onChange = this.onChange.bind(this);
  };

  hideAlert = () => { this.setState({ showAltert: !this.state.showAltert }) }

  onChange (event) {
    /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state);
  };

  userLogin (event) {
    event.preventDefault();
    if (!this.state.email || !this.state.password) return;

    //saving the current component context
    let context = this;
    console.log(context);

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
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
      })
      .then(function (res) {
        //store the token in the browser's session storage
        if (res.token) {
          window.sessionStorage.setItem("secret_token", res.token);
          context.setState({
            password: null,
            email: res.email,
            login: true,
            secret_token: res.token
          });
        }
        //reset the login form -> TODO: Maybe a react unmount?
        document.getElementById("loginForm").reset();


        //populate login data
        let data = {
          login: true,
          name: res.name,
          email: res.email,
          profilePicture: res.picture,
          userType: res.userType,
        };
        if (res.token) {
          data.secret_token = res.token;
        }

        //call the app component and login the user
        console.log(context);
        console.log(context.props);
        context.props.logIn(data);

        //context.setState({isLoggedIn: true});
        //this.forceUpdate();
      })
      .catch(err => {
        this.setState({
          showAltert: true,
          errorMessage: "Login failed."
        })
        console.log(err)
    });
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
      return (
        <div className="container loginForm" className="loginForm">
          <CriticalAlert show={this.state.showAltert} change={this.hideAlert} text={this.state.errorMessage}/>
          <div id="img-homepage"></div>
          <form className="form-group" id="loginForm" onSubmit={this.userLogin}>
            <div className="form-group">
              <label className="label-bold" htmlFor="rating">Email</label>
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
              <label className="label-bold" htmlFor="rating">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={this.onChange}
                value={this.password}
              />
            </div>

            <div className="form-group">
              <input
                type="submit"
                className="btn button-pink"
                value="Submit"
              />
            </div>
          </form>
          <div className="text-center">
          <li className="list-unstyled mb-1">Don't have an account with us?</li>
            <li className="list-unstyled mb-1">
            <Link
              className="font-weight-bolder text-body text-decoration-none"
              to="/register/dancer"
            >Register as a Dancer </Link>
            to find dance partners and events.</li>
            <li className="list-unstyled mb-1">
            <Link
              className="font-weight-bolder text-body text-decoration-none"
              to="/register/organizer"
            >Register as an Organizer </Link>
            to post events with us.</li>
            </div>
        </div>

      );
    }
  }

//TODO: Check the context binding on -> export default RouteRedirect(LoginForm);
//export default LoginForm;
export default RouteRedirect(LoginForm);
