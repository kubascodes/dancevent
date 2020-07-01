import React from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ProcessImage from '../../services/imageProcessing';

//TODO we'd want to use composition to define forms
//1. Form Component
//2. Input Component
//3. Submit Btn Component

class RegistrationFormDancer extends React.Component {

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
      //dancer schema attributes
      gender: null,
      height: null,
      yearOfBirth: null,
      listOfDanceStyles: null,
      proficiencyLevel: null,
      prefAgeMin: null,
      prefAgeMax: null,
      prefGender: null
    };
  }

  onChangeInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        //console.log(this.state);
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
    if (checked.length == 1) {
      //store as a string if only 1 preference
      this.setState({ [checkboxName]: checked[0] });
      console.log(this.state);
    }
    else if (checked.length > 1) {
      //store as an array if multiple preferences
      this.setState({ [checkboxName]: checked });
      console.log(this.state);
    }

  };

  registerUser = (event) => {
    //prevent default behavior
    event.preventDefault();

    //if no email or pwd on the form, return
    if (!this.state.email || !this.state.password) return;

    //saving the component scope
    var component_scope = this;

    //post to dancer's registration api
    fetch('/register/dancer', {
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
        //dancer schema attributes
        gender: this.state.gender,
        height: this.state.height,
        yearOfBirth: this.state.yearOfBirth,
        listOfDanceStyles: this.state.listOfDanceStyles,
        proficiencyLevel: this.state.proficiencyLevel,
        prefAgeMin: this.state.prefAgeMin,
        prefAgeMax: this.state.prefAgeMax,
        prefGender: this.state.prefGender,
      }),
    })
    .then(res => res.json(res))
    .then(function(res){
      //console.log("Logging Response");
      console.log(res);
      document.getElementById("RegistrationFormDancer").reset();
      component_scope.setState({
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
        prefGender: null
      });
    })
    .catch(err => alert(err));
  };

  dataToParent (data) {
    console.log(data);
    this.props.auth(data);
  }


  render() {


    return (

      <form className="form-group" id="RegistrationFormDancer" onSubmit={this.registerUser}>

      <div className="form-group">
        <label className="label-bold" htmlFor="name">Name</label>
        <input type="text" className="form-control" id="name" name="name" placeholder="Your Name" onChange={this.onChangeInput} value={this.name}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="email">Email</label>
        <input type="email" className="form-control" id="email" name="email" onChange={this.onChangeInput} placeholder="Required your@email.com" value={this.email}/>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" className="form-control" id="password" name="password" onChange={this.onChangeInput} placeholder="Required" value={this.password}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="yearOfBirth">Year of Birth</label>
        <input type="text" className="form-control" id="yearOfBirth" placeholder="1994" name="yearOfBirth" onChange={this.onChangeInput} value={this.yearOfBirth}/>
      </div>

      <div className="form-group">
        <label className="radio-inline mr-2" for="gender">Gender</label>

        <input className="" type="radio" name="gender" id="gender" value="male" onChange={this.onChangeCheckbox} />
        <label className="radio-inline mr-2" for="inlineRadio1">Male</label>

        <input className="" type="radio" name="gender" id="gender" value="female" onChange={this.onChangeCheckbox} />
        <label className="radio-inline mr-2" for="inlineRadio2">Female</label>

        <input className="" type="radio" name="gender" id="gender" value="other" onChange={this.onChangeCheckbox} />
        <label className="radio-inline mr-2" for="inlineRadio3">Other</label>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="city">City</label>
        <input type="text" className="form-control" id="city" placeholder="Munich" name="city" onChange={this.onChangeInput} value={this.city}/>
      </div>

      <div className="form-group">
        <label className="label-bold" htmlFor="height">Height</label>
        <input type="number" className="form-control" id="height" placeholder="183 (cm)" name="height" onChange={this.onChangeInput} value={this.height}/>
      </div>

      <div className="form-group">
        <label className="mr-2 label-bold" htmlFor="listOfDanceStyles">Preferred Dance Styles</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="latin" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Latin</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="cha-cha-cha" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Cha-cha-cha</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="samba" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Samba</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="jive" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Jive</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="paso doble" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Paso Doble</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="boldero" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Boldero</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="rumba" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Rumba</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="east coast swing" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">East Coast Swing</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="standard" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Standard</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="waltz" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Waltz</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="viennese waltz" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Viennese Waltz</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="tango" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Tango</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="foxtrot" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Foxtrot</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="quickstep" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Quickstep</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="hustle" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Hustle</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="west coast swing" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">West Coast Swing</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="salsa" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Salsa</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="bachata" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Bachata</label>

          <input className="mr-1" type="checkbox" id="listOfDanceStyles" name="listOfDanceStyles" value="various" onChange={this.onChangeCheckbox} />
          <label class="checkbox-inline mr-2">Various</label>

      </div>

      <div className="form-group">
        <label className="mr-2 label-bold" htmlFor="proficiencyLevel">Dance Proficiency Level</label>

          <input className="mr-1" type="radio" id="proficiencyLevel" name="proficiencyLevel" onChange={this.onChangeCheckbox} value="beginner" />
          <label class="radio-inline mr-2">Beginner</label>

          <input className="mr-1" type="radio" id="proficiencyLevel" name="proficiencyLevel" onChange={this.onChangeCheckbox} value="intermediate" />
          <label class="radio-inline mr-2">Intermediate</label>

          <input className="mr-1" type="radio" id="proficiencyLevel" name="proficiencyLevel" onChange={this.onChangeCheckbox} value="advanced" />
          <label class="radio-inline mr-2">Advanced</label>

      </div>

      <div className="form-group">
      <div className="input-group form-row">
        <div className="input-group-prepend">
        <div class="input-group-text">
        Preferred Age of Dancers
        </div>
        </div>
        <input type="number" aria-label="Min Age" placeholder="Min age (years)" className="form-control col" name="prefAgeMin" onChange={this.onChangeInput} value={this.prefAgeMin} />
        <input type="number" aria-label="Max Age" placeholder="Max age (years)" className="form-control col" name="prefAgeMax" onChange={this.onChangeInput} value={this.prefAgeMax} />
      </div>
      </div>

      <div className="form-group">
        <label className="radio-inline mr-2" for="prefGender">Preferred Gender of Dancers</label>

        <input className="" type="radio" name="prefGender" id="prefGender" value="male" onChange={this.onChangeCheckbox} />
        <label className="radio-inline mr-2" for="inlineRadio1">Male</label>

        <input className="" type="radio" name="prefGender" id="prefGender" value="female" onChange={this.onChangeCheckbox} />
        <label className="radio-inline mr-2" for="inlineRadio2">Female</label>

        <input className="" type="radio" name="prefGender" id="prefGender" value="other" onChange={this.onChangeCheckbox} />
        <label className="radio-inline mr-2" for="inlineRadio3">Other</label>
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

export default RegistrationFormDancer
