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

class EditFormDancer extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    let user = props.location.state;
    this.state = {
      //user schema attributes
      name: user.name,
      email: user.email,
      city: user.city,
      picture: user.picture,
      //dancer schema attributes
      gender: user.gender,
      height: user.height,
      yearOfBirth: user.yearOfBirth,
      listOfDanceStyles: user.listOfDanceStyles,
      proficiencyLevel: user.proficiencyLevel,
      prefAgeMin: user.prefAgeMin,
      prefAgeMax: user.prefAgeMax,
      prefGender: user.prefGender,
      //image upload progress
      uploadProgress: null,
      hiddenProgress: true,
      //error Handler
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

  onChangeCheckbox = (event) => {
    var checkboxName = event.target.name;
    var elements = document.getElementsByName(checkboxName);
    var checked = [];
    //console.log(elements);
    for (var x = 0; x < elements.length; x++) {
      if (elements[x].checked) {
        /*
        console.log("checked");
        console.log(elements[x].value);
        console.log(elements[x].name);
        */
        checked.push(elements[x].value);
      }
      else {
        /*
        console.log("unchecked");
        console.log(elements[x].value);
        */
      }
    }
    /*
    console.log(this.state);
    console.log(checked.length);
    console.log(checked);
    console.log(checkboxName);
    */
    if (checked.length < 1) {
      //store empty if nothing
      this.setState({ [checkboxName]: "" });
      //console.log(this.state);
    }
    else if (checked.length == 1) {
      //store as a string if only 1 preference
      this.setState({ [checkboxName]: checked[0] });
      //console.log(this.state);
    }
    else if (checked.length > 1) {
      //store as an array if multiple preferences
      this.setState({ [checkboxName]: checked });
      //console.log(this.state);
    }

  };



  capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  formCleaning = async () => {
    //form inputs we want to upload
    let keys = ["name", "email", "password", "city", "picture", "gender", "height", "yearOfBirth", "listOfDanceStyles", "proficiencyLevel", "prefAgeMin", "prefAgeMax", "prefGender"];
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
    return output;
  };

  registerUser =  async (event) => {
    //prevent default behavior
    event.preventDefault();

    //if no email or pwd on the form, return
    if (!this.state.email || !this.state.password) return;

    //saving the current component context
    var context = this;

    //deleting null values
    let form = await this.formCleaning();
    console.log("register user");
    console.log(form);
    //post to dancer's registration api

    fetch('/update/dancer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + window.sessionStorage.secret_token
      },
      body: JSON.stringify(form),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    }
)
    .then(function(res){
      console.log(res);
      alert("Successfully signed up!");
      document.getElementById("RegistrationFormDancer").reset();
      context.setState({
        //user schema attributes
        name: null,
        email: null,
        password: null,
        city: null,
        picture: null,
        //dancer schema attributes
        gender: null,
        height: null,
        yearOfBirth: null,
        listOfDanceStyles: null,
        proficiencyLevel: null,
        prefAgeMin: null,
        prefAgeMax: null,
        prefGender: null,
        progressBar: null,
        hiddenProgress: true
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

      //call the app component and login the user
      //console.log(context);
      //console.log(context.props);
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

      <form className="form-group" id="RegistrationFormDancer" onSubmit={this.registerUser}>

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

      <div className="form-group">
        <label className="label-bold" htmlFor="name">Name</label>
        <input type="text" className="form-control border-red" id="name" name="name" placeholder="Your Name (required)" onChange={this.onChangeInput} value={this.state.name} required />
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="email">Email</label>
        <input type="email" className="form-control border-red" id="email" name="email" onChange={this.onChangeInput} placeholder="your@email.com (required)" value={this.state.email} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="yearOfBirth">Year of Birth</label>
        <input type="number" className="form-control border-red" id="yearOfBirth" placeholder="1994 (required)" name="yearOfBirth" onChange={this.onChangeInput} value={this.state.yearOfBirth} required/>
      </div>

      <div className="form-group">
        <label className="radio-inline mr-2 label-bold" for="gender">Gender</label>

        <input className="mr-1" type="radio" name="gender" id="gender" value="male" onChange={this.onChangeCheckbox} checked={this.state.gender ? this.state.gender.includes("male") : null} />
        <label className="radio-inline mr-2" for="inlineRadio1">Male</label>

        <input className="mr-1" type="radio" name="gender" id="gender" value="female" onChange={this.onChangeCheckbox} checked={this.state.gender ? this.state.gender.includes("female") : null} />
        <label className="radio-inline mr-2" for="inlineRadio2">Female</label>

        <input className="mr-1" type="radio" name="gender" id="gender" value="other" onChange={this.onChangeCheckbox} checked={this.state.gender ? this.state.gender.includes("other") : null}  />
        <label className="radio-inline mr-2" for="inlineRadio3">Other</label>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="city">City</label>
        <input type="text" className="form-control border-red" id="city" placeholder="Munich (required)" name="city" onChange={this.onChangeInput} value={this.state.city} required/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="height">Height</label>
        <input type="number" className="form-control" id="height" placeholder="183 (cm)" name="height" onChange={this.onChangeInput} value={this.state.height}/>
      </div>

      <div className="form-group">
        <label className="mr-2 label-bold" htmlFor="listOfDanceStyles">Preferred Dance Styles</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="latin" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("latin") : null} />
          <label class="checkbox-inline mr-2">Latin</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="cha-cha-cha" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("cha-cha-cha") : null}  />
          <label class="checkbox-inline mr-2">Cha-cha-cha</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="samba" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("samba") : null}  />
          <label class="checkbox-inline mr-2">Samba</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="jive" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("jive") : null}  />
          <label class="checkbox-inline mr-2">Jive</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="paso doble" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("paso doble") : null }  />
          <label class="checkbox-inline mr-2">Paso Doble</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="boldero" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("boldero") : null}  />
          <label class="checkbox-inline mr-2">Boldero</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="rumba" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("rumba") : null}  />
          <label class="checkbox-inline mr-2">Rumba</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="east coast swing" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("east coast swing") : null}  />
          <label class="checkbox-inline mr-2">East Coast Swing</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="standard" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("standard") : null} />
          <label class="checkbox-inline mr-2">Standard</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="waltz" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("waltz") : null}  />
          <label class="checkbox-inline mr-2">Waltz</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="viennese waltz" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("viennese waltz") : null}  />
          <label class="checkbox-inline mr-2">Viennese Waltz</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="tango" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("tango") : null}  />
          <label class="checkbox-inline mr-2">Tango</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="foxtrot" onChange={this.onChangeCheckbox} cchecked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("foxtrot") : null}  />
          <label class="checkbox-inline mr-2">Foxtrot</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="quickstep" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("quickstep") : null}  />
          <label class="checkbox-inline mr-2">Quickstep</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="hustle" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("hustle") : null}  />
          <label class="checkbox-inline mr-2">Hustle</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="west coast swing" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("west coast swing") : null}  />
          <label class="checkbox-inline mr-2">West Coast Swing</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="salsa" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("salsa") : null}  />
          <label class="checkbox-inline mr-2">Salsa</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="bachata" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("bachata") : null}  />
          <label class="checkbox-inline mr-2">Bachata</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="various" onChange={this.onChangeCheckbox} checked={this.state.listOfDanceStyles ? this.state.listOfDanceStyles.includes("various") : null}  />
          <label class="checkbox-inline mr-2">Various</label>

      </div>

      <div className="form-group">
        <label className="mr-2 label-bold" htmlFor="proficiencyLevel">Dance Proficiency Level</label>

          <input className="mr-1" type="radio" id="proficiencyLevel" name="proficiencyLevel" onChange={this.onChangeCheckbox} value="beginner" checked={this.state.proficiencyLevel ? this.state.proficiencyLevel.includes("beginner") : null} />
          <label class="radio-inline mr-2">Beginner</label>

          <input className="mr-1" type="radio" id="proficiencyLevel" name="proficiencyLevel" onChange={this.onChangeCheckbox} value="intermediate" checked={this.state.proficiencyLevel ? this.state.proficiencyLevel.includes("intermediate") : null} />
          <label class="radio-inline mr-2">Intermediate</label>

          <input className="mr-1" type="radio" id="proficiencyLevel" name="proficiencyLevel" onChange={this.onChangeCheckbox} value="advanced" checked={this.state.proficiencyLevel ? this.state.proficiencyLevel.includes("advanced") : null} />
          <label class="radio-inline mr-2">Advanced</label>

      </div>

      <div className="form-group">
      <div className="input-group form-row">
        <div className="input-group-prepend">
        <div class="input-group-text">
        Preferred Age of Dancers
        </div>
        </div>
        <input type="number" aria-label="Min Age" placeholder="Min age (years)" className="form-control col" name="prefAgeMin" onChange={this.onChangeInput} value={this.state.prefAgeMin} />
        <input type="number" aria-label="Max Age" placeholder="Max age (years)" className="form-control col" name="prefAgeMax" onChange={this.onChangeInput} value={this.state.prefAgeMax} />
      </div>
      </div>

      <div className="form-group">
        <label className="radio-inline mr-2 label-bold" for="prefGender">Preferred Gender of Dancers</label>

        <input className="mr-1" type="radio" name="prefGender" id="prefGender" value="male" onChange={this.onChangeCheckbox} checked={this.state.prefGender ? this.state.prefGender.includes("male") : null} />
        <label className="radio-inline mr-2" for="inlineRadio1">Male</label>

        <input className="mr-1" type="radio" name="prefGender" id="prefGender" value="female" onChange={this.onChangeCheckbox} checked={this.state.prefGender ? this.state.prefGender.includes("female") : null} />
        <label className="radio-inline mr-2" for="inlineRadio2">Female</label>

        <input className="mr-1" type="radio" name="prefGender" id="prefGender" value="other" onChange={this.onChangeCheckbox} checked={this.state.prefGender ? this.state.prefGender.includes("other") : null} />
        <label className="radio-inline mr-2" for="inlineRadio3">Other</label>
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

export default RouteAuthentication(EditFormDancer);
