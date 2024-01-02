import React from "react";

import "./BracketMaker.css"
import Game from "../Game/Game.js"
import axios from 'axios'



const API_READ_PATH = 'https://lineupgod.com/api/NFLplayoffs/getTeamData.php';
const API_WRITE_PATH = 'https://lineupgod.com/api/NFLplayoffs/pushPicksNFLPlayoffs.php';

const nullTeam =   {
    seed: 0,
    conf: "",
    name: "???"
  }

class BracketMaker extends React.Component{

  constructor(props){

    super(props)

    this.handleGameChange = this.handleGameChange.bind(this)
    this.submitClick = this.submitClick.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.validateEmail = this.validateEmail.bind(this)

    this.state ={
       teamData: null,
       name: "",
       email: "",
       message: "Click Here to Submit Picks",
       successfulSubmit: false,
       afcWildcard: new Array(3).fill(nullTeam),
       nfcWildcard: new Array(3).fill(nullTeam),
       afcDivisional: new Array(2).fill(nullTeam),
       nfcDivisional: new Array(2).fill(nullTeam),
       afcChampion: nullTeam,
       nfcChampion:nullTeam,
       superBowl:nullTeam
    }
  }

  componentDidMount() {
    //console.log("AYYYO")
    this.getData();
    //console.log("AYYYO!!")
    console.log(this.state.teamData)

 }

 getData = () => {
   axios.get(API_READ_PATH).then(response => response.data)
   .then((data) => {
     this.setState({teamData:data})
  })
}

  submitClick(){

      if(this.state.successfulSubmit) return;

      var newMessage

      console.log("SubmitClick")

      if(this.state.name === ""){
        newMessage = "Enter your name!"
        this.setState({message:newMessage})
        return
      }else if(!this.validateEmail(this.state.email)){
          newMessage = "Enter a valid email!"
          this.setState({message:newMessage})
          return
      }else if(this.state.superBowl.name === "???" || this.state.afcChampion.name === "???" || this.state.nfcChampion.name === "???"){
        newMessage = "You have empty games still!"
        this.setState({message:newMessage})
        return
      }


      let formData = new FormData();
        formData.append('name', this.state.name)
        formData.append('email', this.state.email)
        formData.append('aw1', this.state.afcWildcard[0].name)
        formData.append('aw2', this.state.afcWildcard[1].name)
        formData.append('aw3', this.state.afcWildcard[2].name)
        formData.append('nw1', this.state.nfcWildcard[0].name)
        formData.append('nw2', this.state.nfcWildcard[1].name)
        formData.append('nw3', this.state.nfcWildcard[2].name)
        formData.append('ad1', this.state.afcDivisional[0].name)
        formData.append('ad2', this.state.afcDivisional[1].name)
        formData.append('nd1', this.state.nfcDivisional[0].name)
        formData.append('nd2', this.state.nfcDivisional[1].name)
        formData.append('ac', this.state.afcChampion.name)
        formData.append('nc', this.state.nfcChampion.name)
        formData.append('sb', this.state.superBowl.name)


        axios({
        method: 'post',
        url: `${API_WRITE_PATH}`,
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
                    //handle success
                    console.log(response)
                    this.setState({message: "Thank you for submitting! You should recieve a confirmation email soon. Let Nick know if not. Refresh the page to submit another entry",
                                  successfulSubmit: true})

                })
                .catch( (response) => {
                    //handle error
                    console.log("Bad")
                    newMessage = "Someone has already picked that scenario. Change one or two and try again"
                    this.setState({message: newMessage})
                });


  }


  validateEmail(e){

    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!regEmail.test(e)){
          return false; //invalid email
        }
        return true;
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handleGameChange(id, team){ //ID is gameID

    if(this.state.successfulSubmit) return;

    var array;
    var firstTwo = id.substr(0,2) //gameID
    var last = id.substr(2,1) //gameID number like AW1 or AW2

    if(firstTwo==="AW"){
      array = this.state.afcWildcard;
      array[parseInt(last) - 1] = team
      this.setState({afcWildcard : array})
      //console.log(firstTwo)
      //console.log(parseInt(last) - 1)
    }

    if(firstTwo === "NW"){
        array = this.state.nfcWildcard;
        array[parseInt(last) - 1] = team
        this.setState({nfcWildcard : array})
        //console.log(firstTwo)
      }

    if(firstTwo==="AD"){
      array = this.state.afcDivisional;
      array[parseInt(last) - 1] = team
      this.setState({afcDivisional : array})
      //console.log(firstTwo)
      //console.log(parseInt(last) - 1)
    }

    if(firstTwo === "ND"){
        array = this.state.nfcDivisional;
        array[parseInt(last) - 1] = team
        this.setState({nfcDivisional : array})
        //console.log(firstTwo)
      }

    if(firstTwo === 'AC'){
      this.setState({afcChampion: team})
    }
    if(firstTwo === 'NC'){
      this.setState({nfcChampion: team})
    }
    if(firstTwo === 'SB'){

      var newMessage
      if(team.name === "???" || this.state.afcChampion.name === "???" || this.state.nfcChampion.name === "???"){
          newMessage = "Almost There!"
      }else {
        newMessage = "Superbowl Winner: " + team.name + "! Click to submit"
      }

      this.setState({superBowl: team, message: newMessage})
    }

      //console.log(this.state.afcWildcard)

  }

  render() {

    if(this.state.teamData === null){
      return(
      <div className = "mainBody"></div>)
    }else{
      console.log(this.state.teamData)


    const aw = [].concat(this.state.afcWildcard)
        .sort((a, b) => a.seed > b.seed ? 1 : -1)

    const nw = [].concat(this.state.nfcWildcard)
        .sort((a, b) => a.seed > b.seed ? 1 : -1)

    const ad = [].concat(this.state.afcDivisional)
        .sort((a, b) => a.seed > b.seed ? 1 : -1)

    const nd = [].concat(this.state.nfcDivisional)
        .sort((a, b) => a.seed > b.seed ? 1 : -1)


    return (
      <div className = "mainBody">
          <div className = "infoAndSubmit">
            <label>
              Name:
              <input type="text" maxLength="15" value={this.state.name} onChange={this.handleNameChange} />
            </label>
            <br/>
            <label>
              Email:
              <input type="email" maxLength="255" value={this.state.email} onChange={this.handleEmailChange}/>
            </label>
            <br/>
            <button onClick = {this.submitClick}>{this.state.message}</button>
         </div>
         <div className = "gameList">
            <Game  title = "AFC Wildcard 1"
                    gameID = 'AW1'
                    team1 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '2')}
                    team2 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '7')}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "NFC Wildcard 1"
                    gameID = 'NW1'
                    team1 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '2')}
                    team2 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '7')}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "AFC Wildcard 2"
                    gameID = 'AW2'
                    team1 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '3')}
                    team2 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '6')}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "NFC Wildcard 2"
                    gameID = 'NW2'
                    team1 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '3')}
                    team2 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '6')}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "AFC Wildcard 3"
                    gameID = 'AW3'
                    team1 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '4')}
                    team2 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '5')}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "NFC Wildcard 3"
                    gameID = 'NW3'
                    team1 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '4')}
                    team2 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '5')}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "AFC Divisional 1"
                    gameID = 'AD1'
                    team1 = {this.state.teamData.find(t => t.conf === "AFC" && t.seed === '1')}
                    team2 = {aw[0].seed === 0 ? nullTeam : aw[2]}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "NFC Divisional 1"
                    gameID = 'ND1'
                    team1 = {this.state.teamData.find(t => t.conf === "NFC" && t.seed === '1')}
                    team2 = {nw[0].seed === 0 ? nullTeam : nw[2]}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "AFC Divisional 2"
                    gameID = 'AD2'
                    team1 = {aw[0].seed === 0 ? nullTeam : aw[0]}
                    team2 = {aw[0].seed === 0 ? nullTeam : aw[1]}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "NFC Divisional 2"
                    gameID = 'ND2'
                    team1 = {nw[0].seed === 0 ? nullTeam : nw[0]}
                    team2 = {nw[0].seed === 0 ? nullTeam : nw[1]}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "AFC Champs"
                    gameID = 'AC'
                    team1 = {ad[0].seed === 0 ? nullTeam : ad[0]}
                    team2 = {ad[0].seed === 0 ? nullTeam : ad[1]}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "NFC Champs"
                    gameID = 'NC'
                    team1 = {nd[0].seed === 0 ? nullTeam : nd[0]}
                    team2 = {nd[0].seed === 0 ? nullTeam : nd[1]}
                    gameChange ={this.handleGameChange}/>
            <Game  title = "Superbowl"
                    gameID = 'SB'
                    team1 = {this.state.afcChampion}
                    team2 = {this.state.nfcChampion}
                    gameChange ={this.handleGameChange}/>
         </div>
      </div>
    );
  }}
  }


  export default BracketMaker;
