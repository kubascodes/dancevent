import React from 'react';
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import cities from './cities'
import ProgressBar from 'react-bootstrap/ProgressBar'
import "react-datepicker/dist/react-datepicker.css";
import { Typeahead, TypeaheadInputSingle } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import ProcessImage from '../../services/imageProcessing';

import {CriticalAlert} from "../helpers/Alert";


/*
*   This Component is for Creating and Updating Events
*   if props.update is set Component will prefill Fields
*/
class EventCreationForm extends React.Component {
  /*TODO:
    -only allow access when logedin as organizer and update only if owner
    -restructuring (design)

    Update functionality:
      -city, Checkboxes, photo(?)
  */



  constructor(props) {
    console.log(props)
    super(props);
    this.state = {
      //Event attributes
      title: null,
      type: "course",
      description: "",
      startDate: new Date(),
      //Current date + 20 days
      endDate: new Date().setDate((new Date()).getDate()+10),
      city: "Munich",
      location: null,
      listOfDanceStyles: [],
      listOfProficiencyLevels: null,
      price: null,
      promoCode: null,
      picture: null,

      //attributes used for Class
      pictureChange: false,
      danceCategory: 'latin',
      danceStyle: [],


      showAltert : false,
      errorMessage: "",

      redirect : null,
      //upload
      uploadProgress: 0,
      hiddenProgress: true,
    };
  }

  //When update: fetch event from backend
  componentDidMount(){
    if(this.props.update){
      //to get the param ID specified in the URL
      const {
        match: { params },
      } = this.props;

      const component_scope = this;

      fetch(`/events/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          var dancstyles = [];
          var danceCategory = null;
          var style;
          for(style of data.listOfDanceStyles){
            console.log(style);
            if(!["latin","standard", "various"].includes(style)){
              dancstyles.push({ value: style, label: style});
            }else{
              danceCategory = style;
            }
          }

          //Set the loaded data to state
          component_scope.setState({
            title: data.title,
            type: data.type,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.startDate),
            city: data.city,
            location: data.location,
            listOfDanceStyles: data.listOfDanceStyles,
            listOfProficiencyLevels: data.listOfProficiencyLevels,
            price: data.price,
            promoCode: data.promoCode,
            picture: data.picture,

            danceCategory: danceCategory,
            danceStyle: dancstyles,


          })

        })
        .catch(err => {
          component_scope.setState({showAltert: true,
                        errorMessage: "Existing data could not be loaded" })
          console.log(err)});
    }
  }

  hideAlert = () => {this.setState({showAltert : !this.state.showAltert})}

  //Changes the state for text inputs and selects
  onChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state);
  };

  //upload progress bar
  setUploadProgress = (progress) => {
    this.setState({uploadProgress: progress});
  }

  //Changes the state for checkboxes
  onChangeCheckbox = (event) => {
    //get the state attribute's name
    var checkboxName = event.target.name;

    //Get the boxes which are checked
    var elements = document.getElementsByName(checkboxName);
    var checked = [];

    for (var x = 0; x < elements.length; x++) {
      if (elements[x].checked) {
        checked.push(elements[x].value);
      }
      else {
        /*
        console.log("unchecked");
        console.log(elements[x].value);
        */
      }
    }

    //store in state
    this.setState({ [checkboxName]: checked });

  };

  handleSelect = (selectedOption, action) => {
    /* this function handles the interaction of the selection component that is like a drop down */
    console.log("new event")
    console.log(selectedOption)
    console.log(action)
    this.setState({
        [action.name]: selectedOption ? selectedOption.value : ""
    });
    /*if (action.name == 'danceCategory') {
        this.setState({danceStyle: ''});
    };*/
    console.log(this.state)
}

handleMultiSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    console.log("new event")
    console.log(danceStyle)
    this.setState({danceStyle});
    console.log(this.state)
}

  //Changes the state for multiple selects inputs
  //the user can select more than one choice
  onChangeMultipleSelect = (event) => {

    var opts = [];
    //the selected options (its a list but not in js format)
    //elements in options have boolean selected and value (the name)
    var options = event.target.options
    var length = options.length;
    //iterate through the selected options
    for (var i = 0; i < length; i++) {
      let op = options[i]
      if (op.selected) {
        opts.push(op.value)
      }
    }
    //store in state
    this.setState({ [event.target.name]: opts });
  }

  //Changes the state for calendar inputs
  //type should specify if it is a start- or endDate
  onChangeCalendar = (date, type) => {
    console.log(this)
    this.setState({ [type]: date });
  };

  //Changes the state for Img imputs
  onChangeFile = (event) => {
    //setting the file to the input
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileUrl = URL.createObjectURL(file);
      let context = this;
      //defining the function
      async function processImage(file, fileUrl, context) {
        console.log(file);
        try {
          let image = await ProcessImage(file, fileUrl, "eventPicture", context);
          context.setState({
            picture: image,
            pictureChange: true });
          console.log(context.state);
        }
        catch (error) {
          alert(error);
        }
      };
      //displaying progress bar
      this.setState({hiddenProgress:false});
      //calling the function
      processImage(file, fileUrl, context);
    }

  };



  //Changes the state for REACT-SELECT inputs
  onChangeAuto = (event) => {
    console.log(event)
    this.setState({city : event.value})
  }



  //This method posts/puts the state to the REST backend
  pushEvent = (event) => {


    //prevent default behavior
    event.preventDefault();

    //check again if user is locked in
    if (window.sessionStorage.secret_token != null) {

      //saving the component scope
      var component_scope = this;

      //saving the auth token
      const token = window.sessionStorage.secret_token

      var danceStyles;
      //listOfProficiencyLevels
      if(this.state.danceStyle.length == 0){
        danceStyles = [this.state.danceStyleCategory]
      }else{


        danceStyles = this.state.danceStyle.map(style => style.value)

        var  latinStyles = ['jive', 'rumba', 'cha-cha-cha', 'samba', 'paso doble', 'bolero', 'mambo', 'east coast swing'];
        var standardStyles = ['waltz', 'viennese waltz', 'tango', 'foxtrot', 'qickstep'];
        var variousStyles = [ 'salsa', 'bachata', 'west coast swing', 'hustle'];
        // Check if intersection is not empty
        // => the user has a chosen a danceStyle of this parentclass
        //include it so it is easier to filter in later cases
        if(danceStyles.some(r=> latinStyles.includes(r))){
          danceStyles.push('latin')
        }
        if(danceStyles.some(r=> standardStyles.includes(r))){
          danceStyles.push('standard')
        }
        if(danceStyles.some(r=> variousStyles.includes(r))){
          danceStyles.push('various')
        }
      }
      console.log(danceStyles)

      //standard address
      var address = "/events/"


      //saving state to body of HTML
      var body = {

        title: this.state.title,
        type: this.state.type,
        description: this.state.description,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        city: this.state.city,
        location: this.state.location,
        listOfDanceStyles: danceStyles,
        listOfProficiencyLevels: this.state.listOfProficiencyLevels,
        price: this.state.price,
        promoCode: this.state.promoCode,
      }
      if(this.state.pictureChange){
        body['picture'] = this.state.picture
      }

      //specify HTML Method (put/post)
      if(this.props.update){
        //Get URL Parameter (Event ID) to add to address
        const { match: { params }} = this.props;
        address = address + params.id

        var method = 'Put'
      }else{
        var method = 'POST'
      }

      var component_scope = this;

      //post/put to organizer's registration api
      fetch(address, {
        method: method,
        headers: {
          'Authorization': "Bearer " + token,
          'Content-Type': 'application/json; charset=utf-8'
        },
        //body must be stringify to be readable by backend
        body: JSON.stringify(body)
      }) //create a post request which is a Promise
        .then(res => {
          if(!res.ok){
            throw new Error('Network response was not ok');
          }
          return res.json()
        })
        .then((res) =>{
          console.log("redirect")
          this.setState({ redirect: "/events/single/" + res._id});

          /*
          //reset the HTML form
          document.getElementById("EventCreationForm").reset();
          //reset the state
          component_scope.setState({
            title: null,
            type: "course",
            description: "",
            startDate: new Date(),
            endDate: new Date().setDate((new Date()).getDate()+10),
            duration: 10,
            city: "Munich",
            location: null,
            listOfDanceStyles: [],
            listOfProficiencyLevels: null,
            price: null,
            promoCode: null,
            picture: null,

            pictureChange: false,
            danceCategory: 'latin',
            danceStyle: [],
          });*/
        })
        .catch(err => {
          if(component_scope.props.update){
            component_scope.setState({showAltert: true,
              errorMessage: "Error occured while sending to server. Event might not have been updated." })
          }else{
            component_scope.setState({showAltert: true,
              errorMessage: "Error occured while sending to server. Event might not have been created." })
          }
          console.log(err)}
          );
    } else {
      this.setState({showAltert: true,
        errorMessage: "You are not authorized to do this operation." })
    }
  };




  render() {

    //const cities2 = ["Berlin", "Stuttgart", "Frankfurt", "Mannheim", "Hamburg", "Essen", "Duisburg", "Munich", "Düsseldorf", "Cologne", "Wuppertal", "Saarbrücken", "Marienberg", "Bremen", "Hannover", "Bonn", "Dresden", "Wiesbaden", "Dortmund", "Leipzig", "Heidelberg", "Karlsruhe", "Augsburg", "Bielefeld", "Koblenz", "Altchemnitz", "Kassel", "Münster", "Kiel", "Freiburg", "Braunschweig", "Fürth", "Lübeck", "Osnabrück", "Magdeburg", "Potsdam", "Erfurt", "Rostock", "Mainz", "Ulm", "Würzburg", "Oldenburg", "Regensburg", "Ingolstadt", "Göttingen", "Bremerhaven", "Cottbus", "Jena", "Gera", "Flensburg", "Schwerin", "Rosenheim", "Gießen", "Stralsund", "Coburg", "Hofeck", "Emden", "Detmold", "Meißen", "Kitzingen", "Dingolfing", "Heppenheim", "Torgau", "Hanau", "Husum", "Schwandorf", "Bitburg", "Cham", "Traunstein", "Lüchow", "Gifhorn", "Biberach", "Bad Reichenhall", "Künzelsau", "Weißenburg", "Regen", "Nuremberg", "Aurich", "Nordhorn", "Aichach", "Marburg", "Görlitz", "Vechta", "Trier", "Pirmasens", "Pirna", "Neustadt", "Beeskow", "Westerstede", "Verden", "Worms", "Düren", "Landsberg", "Ludwigsburg", "Meiningen", "Siegen", "Deggendorf", "Peine", "Frankfurt (Oder)", "Nienburg", "Brake", "Memmingen", "Kirchheimbolanden", "Tauberbischofsheim", "Emmendingen", "Warendorf", "Bad Segeberg", "Rotenburg", "Kronach", "Darmstadt", "Mindelheim", "Bergheim", "Donauwörth", "Korbach", "Herzberg", "Hameln", "Suhl", "Friedberg", "Hof", "Neuburg", "Bad Kissingen", "Viersen", "Birkenfeld", "Bad Fallingbostel", "Halle", "Bamberg", "Fürstenfeldbruck", "Neuss", "Bad Kreuznach", "Heilbronn", "Bad Ems", "Schwäbisch Hall", "Offenburg", "Saalfeld", "Wolfenbüttel", "Altenkirchen", "Pforzheim", "Günzburg", "Euskirchen", "Chemnitz", "Rendsburg", "Tirschenreuth", "Offenbach", "Uelzen", "Zwickau", "Schwabach", "Gelsenkirchen", "Mettmann", "Ravensburg", "Leer", "Wittmund", "Ingelheim", "Höxter", "Oranienburg", "Erbach", "Freising", "Landau", "Stendal", "Balingen", "Reutlingen", "Eisenach", "Tuttlingen", "Neumünster", "Neu-Ulm", "Köthen", "Schleiz", "Garmisch-Partenkirchen", "Baden-Baden", "Bayreuth", "Wunsiedel", "Osterode", "Sankt Wendel", "Lüdenscheid", "Plauen", "Forst", "Pfaffenhofen", "Bochum", "Weimar", "Wilhelmshaven", "Limburg", "Freyung", "Merseburg", "Halberstadt", "Dessau-Roßlau", "Weiden", "Altenburg", "Heide", "Böblingen", "Kulmbach", "Homberg", "Perleberg", "Mülheim", "Northeim", "Salzwedel", "Cuxhaven", "Plön", "Mühlhausen", "Kempten", "Güstrow", "Lichtenfels", "Bad Salzungen", "Weilheim", "Jever", "Arnstadt", "Lüneburg", "Delmenhorst", "Neubrandenburg", "Bad Dürkheim", "Greiz", "Altötting", "Erding", "Lübben", "Holzminden", "Wetzlar", "Soest", "Mosbach", "Heilbad Heiligenstadt", "Neustadt", "Calw", "Kleve", "Annaberg-Buchholz", "Wismar", "Aachen", "Tübingen", "Freiberg", "Mönchengladbach", "Nordhausen", "Krefeld", "Stadthagen", "Hildesheim", "Celle", "Eberswalde", "Recklinghausen", "Eisenberg", "Kaufbeuren", "Sömmerda", "Remscheid", "Greifswald", "Rastatt", "Naumburg", "Lauf", "Amberg", "Ratzeburg", "Bad Homburg", "Neustadt", "Herne", "Sangerhausen", "Forchheim", "Eutin", "Bad Oldesloe", "Kelheim", "Bad Neustadt", "Helmstedt", "Heinsberg", "Zweibrücken", "Hagen", "Montabaur", "Haßfurt", "Pinneberg", "Apolda", "Bad Schwalbach", "Marktoberdorf", "Winsen", "Wesel", "Landshut", "Alzey", "Homburg", "Passau", "Cloppenburg", "Miesbach", "Gotha", "Schwelm", "Kusel", "Meschede", "Steinfurt", "Aschaffenburg", "Paderborn", "Karlstadt", "Waiblingen", "Villingen-Schwenningen", "Rottweil", "Göppingen", "Eichstätt", "Freudenstadt", "Schleswig", "Erlangen", "Olpe", "Lörrach", "Ansbach", "Wittlich", "Neuruppin", "Sonneberg", "Bottrop", "Ludwigshafen", "Borken", "Starnberg", "Gummersbach", "Lauterbach", "Herford", "Rathenow", "Solingen", "Speyer", "Siegburg", "Burg", "Leverkusen", "Unna", "Coesfeld", "Cochem", "Eschwege", "Bad Hersfeld", "Bad Neuenahr-Ahrweiler", "Sondershausen", "Dachau", "Meppen", "Wolfsburg", "Brandenburg", "Sigmaringen", "Sonthofen", "Itzehoe", "Bergisch Gladbach", "Dillingen", "Saarlouis", "Groß-Gerau", "Oberhausen", "Goslar", "Neustadt", "Germersheim", "Hofheim", "Ebersberg", "Prenzlau", "Bad Tölz", "Parchim", "Luckenwalde", "Bernburg", "Osterholz-Scharmbeck", "Stade", "Neumarkt", "Salzgitter", "Bautzen", "Hildburghausen", "Heidenheim", "Wittenberg", "Kaiserslautern", "Miltenberg", "Coburg", "Fulda", "Senftenberg", "Mühldorf", "Merzig", "Seelow", "Minden", "Waldshut-Tiengen", "Neunkirchen", "Neuwied", "Daun", "Esslingen", "Simmern", "Gütersloh", "Diepholz", "Frankenthal", "Straubing", "Pfarrkirchen", "Hamm", "Haldensleben", "Aalen" ];


    //Valid Dancestyle choices
    const danceStyles = [
      "latin",
      "cha-cha-cha",
      "samba",
      "jive",
      "paso doble",
      "boldero",
      "rumba",
      "mambo",
      "east coast swing",
      "standard",
      "waltz",
      "viennese waltz",
      "tango",
      "foxtrot",
      "quickstep",
      "hustle",
      "west coast swing",
      "salsa",
      "bachata",
    ];

    const gender = [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
  ];

    const eventLevels = [
      "beginner", "intermediate", "advanced"
    ];


    // Dance Styles //TODO (optional): add more various
    const danceStyleCategory = [
      {value: 'latin', label: 'Latin/Rythm'},
      {value: 'standard', label: 'Standard/Smooth'},
      {value: 'various', label: 'Various'},
  ];

  const latin = [
      {value: 'jive', label: 'Jive'},
      {value: 'rumba', label: 'Rumba'},
      {value: 'cha-cha-cha', label: 'Cha-Cha-Cha'},
      {value: 'samba', label: 'Samba'},
      {value: 'paso doble', label: 'Paso Doble'},
      {value: 'bolero', label: 'Bolero'},
      {value: 'mambo', label: 'Mambo'},
      {value: 'east coast swing', label: 'East Cost Swing'},
  ];
  const standard = [
      {value: 'waltz', label: 'Waltz'},
      {value: 'viennese waltz', label: 'Viennese Waltz'},
      {value: 'tango', label: 'Tango'},
      {value: 'foxtrot', label: 'Foxtrot'},
      {value: 'quickstep', label: 'Quickstep'},
  ];
  const various = [
      {value: 'salsa', label: 'Salsa'},
      {value: 'bachata', label: 'Bachata'},
      {value: 'west coast swing', label: 'West Cost Swing'},
      {value: 'hustle', label: 'Hustle'},
  ];

    
    if(this.state.redirect){
      return <Redirect to={this.state.redirect} />
    }

    if (window.sessionStorage.secret_token != null) {
      return (



        <div>
          <CriticalAlert show={this.state.showAltert} change={this.hideAlert}/>
          
          {(this.props.update && typeof(this.state.picture)=== "string" )? ( <img src={"/"+this.state.picture} alt="Picture"  height="600"/> ) : null}
          <form className="form-group" id="EventCreationForm" onSubmit={this.pushEvent}>

            <div className="form-group">
              <label className="label-bold" htmlFor="title">Title</label>
              <input type="text" className="form-control" id="title" name="title" placeholder="Event Title" onChange={this.onChangeInput} value={this.state.title} required />
            </div>
            <div className="form-group">
              <label className="label-bold" htmlFor="type">Type</label>
              <select
                className="form-control"
                name="type"
                onChange={this.onChangeInput}
                value={this.state.type}
              >
                <option value="course">Course</option>
                <option value="ball">Ball</option>
                <option value="competition">Competition</option>
                <option value="party">Party</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label-bold"> Startdate </label>
              <DatePicker
                className="form-control"
                name="startDate"
                selected={this.state.startDate}
                onChange={date => this.onChangeCalendar(date, "startDate")}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
              />
              <label className="label-bold"> Enddate </label>
              <DatePicker
                className="form-control"
                name="endDate"
                selected={this.state.endDate}
                onChange={date => this.onChangeCalendar(date, "endDate")}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={this.state.startDate}
              />
            </div>

            {/*
            <div className="form-group">
              <label className="label-bold" htmlFor="city">City</label>
              <Typeahead
                  id="basic-typeahead-single"
                  onChange={this.onChangeAuto}
                  options={cities}
                  placeholder="Choose a city..."
                  defaultSelected={[this.state.city]}
                />
            </div>
            */}

            <div className="form-group">
              <label className="label-bold" htmlFor="city">City</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={{label: this.state.city, value: this.state.city}}
                value={{label: this.state.city, value: this.state.city}}
                placeholder={"Choose a city..."}
                onChange={this.onChangeAuto}
                name="city"
                options={cities}

                        />
            </div>

            <div className="form-group">
              <label className="label-bold" htmlFor="location">Location</label>
              <input type="text" className="form-control" id="location" placeholder="e.g. Steet and Room Number" name="location" onChange={this.onChangeInput} value={this.state.location} required />
            </div>

            {/*
            <div className="form-group">
              <label className="mr-2 label-bold" htmlFor="listOfDanceStyles">Dance Styles</label>

              {danceStyles.map((danceStyle) => (
                <span>
                  <input className="mr-1" type="checkbox" name="listOfDanceStyles" value={danceStyle} onChange={this.onChangeCheckbox} />
                  <label className="checkbox-inline mr-2">{danceStyle.charAt(0).toUpperCase() + danceStyle.slice(1)}</label>
                </span>
              ))}
            </div>
              */}
            
                {/* The following are two selections, where the secound is depending on the first.
                            Here are the dance style categories and depending on that the user can specify the dancing style in more details if wanted.
                            This is solves by a switch case... */}
            <div>
              <div className="form-group">
              <label className="mr-2 label-bold" htmlFor="listOfProficiencyLevels">Dance style</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={this.state.danceCategory}
                  placeholder={"Dance style category..."}
                  isClearable={true}
                  isSearchable={true}
                  value={{label: this.state.danceCategory, value: this.state.danceCategory}}
                  onChange={this.handleSelect}
                  name="danceCategory"
                  options={danceStyleCategory}
                />
                {
                  {
                    'latin':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        defaultValue={''}
                        value={this.state.danceStyle}
                        isMulti={true}
                        placeholder={"Dance style..."}
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={latin}
                      />,
                    'standard':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        defaultValue={''}
                        value={this.state.danceStyle}
                        isMulti={true}
                        placeholder={"Dance style..."}
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={standard}
                      />,
                    'various':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        defaultValue={''}
                        value={this.state.danceStyle}
                        isMulti={true}
                        placeholder={"Dance style..."}
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={various}
                      />

                  }[this.state.danceCategory]
                }
              </div>
            </div>

            <div className="form-group">
              <label className="mr-2 label-bold" htmlFor="listOfProficiencyLevels">Profiency Level</label>
              <select multiple className="form-control" id="listOfProficiencyLevels" name="listOfProficiencyLevels" onChange={this.onChangeMultipleSelect} value={this.state.listOfProficiencyLevels} required>
                {eventLevels.map((level) => (
                  <option value={level}>
                    {level.charAt(0).toUpperCase() +
                      level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label-bold" htmlFor="price">Price</label>
              <div className="form-row">
                <input type="number" className="form-control col" id="price" min="0" step="0.01" placeholder="10.00" name="price" onChange={this.onChangeInput} value={this.state.price} required />

                <div className="input-group-append">
                  <div className="input-group-text">
                    €
                </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="label-bold" htmlFor="promoCode">PromoCode</label>
              <input type="text" className="form-control" id="promoCode" placeholder="e.g. Ball150" name="promoCode" onChange={this.onChangeInput} value={this.state.promoCode} />
            </div>
            <div className="form-group">
              <div className="custom-file">
                <input type="file" className="custom-file-input" name="picture" onChange={this.onChangeFile} id="customFile" />
                <label className="custom-file-label" htmlFor="customFile">Upload your event picture</label>
              </div>
            </div>
            <div className="form-group">
              <label className="label-bold">Description</label>
              <textarea className="form-control" name="description" id="description" onChange={this.onChangeInput} value={this.state.description} rows="4" />
            </div>

            <div class="form-group">
              <ProgressBar animated={true} min={0} max={100} striped={true} now={this.state.uploadProgress} label={"Uploading " + this.state.uploadProgress + " %"} hidden={this.state.hiddenProgress} />
            </div>

            <p className="text-muted"><b>Note:</b> All fields in pink are required.</p>

            <div className="form-group">
              <input type="submit" className="btn btn-outline-dark" value="Submit" />
            </div>
          </form>
        </div>

      )
    }
    else{
      return (
        <div> You are not allowed to view this page. </div>
      )
      }

  }

}

EventCreationForm.defaultProps = {
  update: false,
}

export default EventCreationForm
