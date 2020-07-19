import React, { useEffect } from "react";
import ProcessImage from "../../services/imageProcessing";
import RouteRedirect from "../../services/RouteRedirect";
import ProgressBar from "react-bootstrap/ProgressBar";
import { CriticalAlert } from "../helpers/Alert";

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
      prefGender: null,
      //image upload progress
      uploadProgress: null,
      hiddenProgress: true,
      //error Handler
      showAltert: false,
      errorMessage: "",
    };
    this.setUploadProgress = this.setUploadProgress.bind(this);
  }

  hideAlert = () => {
    this.setState({ showAltert: !this.state.showAltert });
  };

  onChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    //console.log(this.state);
  };

  setUploadProgress = (progress) => {
    this.setState({ uploadProgress: progress });
    /*
    if (this.state.uploadProgress >= 100) {
      setTimeout(this.setState({hiddenProgress: true}), 3000);
    }
    */
  };

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
          let image = await ProcessImage(
            file,
            fileUrl,
            "profilePicture",
            context
          );
          context.setState({ picture: image });
        } catch (error) {
          alert(error);
        }
      }
      //displaying progress bar
      this.setState({ hiddenProgress: false });
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
      } else {
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
    } else if (checked.length == 1) {
      //store as a string if only 1 preference
      this.setState({ [checkboxName]: checked[0] });
      //console.log(this.state);
    } else if (checked.length > 1) {
      //store as an array if multiple preferences
      this.setState({ [checkboxName]: checked });
      //console.log(this.state);
    }
  };

  formCleaning = async () => {
    //form inputs we want to upload
    let keys = [
      "name",
      "email",
      "password",
      "city",
      "picture",
      "gender",
      "height",
      "yearOfBirth",
      "listOfDanceStyles",
      "proficiencyLevel",
      "prefAgeMin",
      "prefAgeMax",
      "prefGender",
    ];
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

  registerUser = async (event) => {
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

    fetch("/register/dancer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(function (res) {
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
          hiddenProgress: true,
        });

        //populate login data
        let data = {
          login: true,
          name: res.name,
          email: res.email,
          profilePicture: res.picture,
          userType: res.userType,
          secret_token: res.token,
        };

        //call the app component and login the user
        //console.log(context);
        //console.log(context.props);
        context.props.logIn(data);
      })
      .catch((err) => {
        this.setState({
          showAltert: true,
          errorMessage:
            "Error occured while sending to server. Request might not have been updated.",
        });
        console.log(err);
      });
  };

  render() {
    return (
      <form
        className="form-group"
        id="RegistrationFormDancer"
        onSubmit={this.registerUser}
      >
        <CriticalAlert
          show={this.state.showAltert}
          change={this.hideAlert}
          text={this.state.errorMessage}
        />
        <div className="form-group">
          <label className="label-bold" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="form-control border-red"
            id="name"
            name="name"
            placeholder="Your Name (required)"
            onChange={this.onChangeInput}
            value={this.name}
            required
          />
        </div>

        <div className="form-group">
          <label className="label-bold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            className="form-control border-red"
            id="email"
            name="email"
            onChange={this.onChangeInput}
            placeholder="your@email.com (required)"
            value={this.email}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control border-red"
            id="password"
            minlength="6"
            name="password"
            onChange={this.onChangeInput}
            placeholder="Pwd (required)"
            value={this.password}
            required
          />
        </div>

        <div className="form-group">
          <label className="label-bold" htmlFor="yearOfBirth">
            Year of Birth
          </label>
          <input
            type="number"
            className="form-control border-red"
            id="yearOfBirth"
            placeholder="1994 (required)"
            name="yearOfBirth"
            onChange={this.onChangeInput}
            value={this.yearOfBirth}
            required
          />
        </div>

        <div className="form-group">
          <label className="radio-inline mr-2 label-bold" for="gender">
            Gender
          </label>

          <input
            className="mr-1"
            type="radio"
            name="gender"
            id="gender"
            value="male"
            onChange={this.onChangeCheckbox}
          />
          <label className="radio-inline mr-2" for="inlineRadio1">
            Male
          </label>

          <input
            className="mr-1"
            type="radio"
            name="gender"
            id="gender"
            value="female"
            onChange={this.onChangeCheckbox}
          />
          <label className="radio-inline mr-2" for="inlineRadio2">
            Female
          </label>

          <input
            className="mr-1"
            type="radio"
            name="gender"
            id="gender"
            value="other"
            onChange={this.onChangeCheckbox}
          />
          <label className="radio-inline mr-2" for="inlineRadio3">
            Other
          </label>
        </div>

        <div className="form-group">
          <label className="label-bold" htmlFor="city">
            City
          </label>
          <input
            type="text"
            className="form-control border-red"
            id="city"
            placeholder="Munich (required)"
            name="city"
            onChange={this.onChangeInput}
            value={this.city}
            required
          />
        </div>

        <div className="form-group">
          <label className="label-bold" htmlFor="height">
            Height
          </label>
          <input
            type="number"
            className="form-control"
            id="height"
            placeholder="183 (cm)"
            min="100"
            max="250"
            step="1"
            name="height"
            onChange={this.onChangeInput}
            value={this.height}
          />
        </div>

        <div className="form-group">
          <label className="mr-2 label-bold" htmlFor="listOfDanceStyles">
            Preferred Dance Styles
          </label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="latin"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Latin</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="cha-cha-cha"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Cha-cha-cha</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="samba"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Samba</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="jive"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Jive</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="paso doble"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Paso Doble</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="boldero"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Boldero</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="rumba"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Rumba</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="east coast swing"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">East Coast Swing</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="standard"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Standard</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="waltz"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Waltz</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="viennese waltz"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Viennese Waltz</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="tango"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Tango</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="foxtrot"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Foxtrot</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="quickstep"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Quickstep</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="hustle"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Hustle</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="west coast swing"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">West Coast Swing</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="salsa"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Salsa</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="bachata"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Bachata</label>

          <input
            className="mr-1"
            type="checkbox"
            id="listOfDanceStyles"
            name="listOfDanceStyles"
            value="various"
            onChange={this.onChangeCheckbox}
          />
          <label class="checkbox-inline mr-2">Various</label>
        </div>

        <div className="form-group">
          <label className="mr-2 label-bold" htmlFor="proficiencyLevel">
            Dance Proficiency Level
          </label>

          <input
            className="mr-1"
            type="radio"
            id="proficiencyLevel"
            name="proficiencyLevel"
            onChange={this.onChangeCheckbox}
            value="beginner"
          />
          <label class="radio-inline mr-2">Beginner</label>

          <input
            className="mr-1"
            type="radio"
            id="proficiencyLevel"
            name="proficiencyLevel"
            onChange={this.onChangeCheckbox}
            value="intermediate"
          />
          <label class="radio-inline mr-2">Intermediate</label>

          <input
            className="mr-1"
            type="radio"
            id="proficiencyLevel"
            name="proficiencyLevel"
            onChange={this.onChangeCheckbox}
            value="advanced"
          />
          <label class="radio-inline mr-2">Advanced</label>
        </div>

        <div className="form-group">
          <div className="input-group form-row">
            <div className="input-group-prepend">
              <div class="input-group-text">Preferred Age of Dancers</div>
            </div>
            <input
              type="number"
              aria-label="Min Age"
              placeholder="Min age (years)"
              className="form-control col"
              min="10"
              max="100"
              step="5"
              name="prefAgeMin"
              onChange={this.onChangeInput}
              value={this.prefAgeMin}
            />
            <input
              type="number"
              aria-label="Max Age"
              placeholder="Max age (years)"
              className="form-control col"
              min="10"
              max="120"
              step="5"
              name="prefAgeMax"
              onChange={this.onChangeInput}
              value={this.prefAgeMax}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="radio-inline mr-2 label-bold" for="prefGender">
            Preferred Gender of Dancers
          </label>

          <input
            className="mr-1"
            type="radio"
            name="prefGender"
            id="prefGender"
            value="male"
            onChange={this.onChangeCheckbox}
          />
          <label className="radio-inline mr-2" for="inlineRadio1">
            Male
          </label>

          <input
            className="mr-1"
            type="radio"
            name="prefGender"
            id="prefGender"
            value="female"
            onChange={this.onChangeCheckbox}
          />
          <label className="radio-inline mr-2" for="inlineRadio2">
            Female
          </label>

          <input
            className="mr-1"
            type="radio"
            name="prefGender"
            id="prefGender"
            value="other"
            onChange={this.onChangeCheckbox}
          />
          <label className="radio-inline mr-2" for="inlineRadio3">
            Other
          </label>
        </div>

        <div class="form-group">
          <div class="custom-file">
            <input
              type="file"
              accept="image/*"
              class="custom-file-input"
              name="picture"
              onChange={this.onChangeFile}
              id="customFile"
            />
            <label class="custom-file-label" for="customFile">
              Upload your profile picture
            </label>
          </div>
        </div>

        <div class="form-group">
          <ProgressBar
            animated={true}
            min={0}
            max={100}
            striped={true}
            now={this.state.uploadProgress}
            label={"Uploading " + this.state.uploadProgress + " %"}
            hidden={this.state.hiddenProgress}
          />
        </div>

        <p className="text-muted">
          <b>Note:</b> All fields in pink are required.
        </p>

        <div className="form-group">
          <input type="submit" className="btn button-pink" value="Submit" />
        </div>
      </form>
    );
  }
}

export default RouteRedirect(RegistrationFormDancer);
