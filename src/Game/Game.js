import React from "react";

import "./Game.css"

const nullTeam =   {
    //id: 0,
    seed: 0,
    conf: "",
    name: "???"
  }

class Game extends React.Component{

  constructor(props){

    super(props)

    this.onRadioClick = this.onRadioClick.bind(this);
    //console.log(":Gameprops")
    //console.log(props)
    this.state = {
      title : props.title,
      team1: props.team1,
      gameID: props.gameID,
      name1 : props.team1.name,
      seed1 : props.team1.seed,
      //id1: props.team1.id,
      team2 : props.team2,
      name2 : props.team2.name,
      seed2 : props.team2.seed,
      //id2: props.team2.id,
      message : "",
      pick: 0,
      parentGameChange: props.gameChange
    }

  }

  onRadioClick(value){

    var newMessage = ""


    if(value === 1){
      //newMessage =this.state.name1
      this.state.parentGameChange(this.state.gameID,this.state.team1)
    }
    if(value === 2){
      //newMessage =this.state.name2
      this.state.parentGameChange(this.state.gameID,this.state.team2)
    }

    this.setState({pick:value,message:newMessage})

  }

  componentDidUpdate(prevProps, prevState){

    //console.log(this.props)

    if((prevProps.team1.name !== this.props.team1.name) || (prevProps.team2.name !== this.props.team2.name)){

      /*
      var newMessage

      if(prevState.pick === 1){
        newMessage =this.props.team1.name
      }


        if(prevState.pick === 2)
          newMessage =this.props.team2.name
        */
      document.getElementById(this.state.gameID + "t1").checked = false;
      document.getElementById(this.state.gameID + "t2").checked = false;
      this.state.parentGameChange(this.state.gameID,nullTeam)

      this.setState({
        team1: this.props.team1,
        name1 : this.props.team1.name,
        seed1 : this.props.team1.seed,
        //id1: this.props.team1.id,
        team2 : this.props.team2,
        name2 : this.props.team2.name,
        seed2 : this.props.team2.seed,
        //id2: this.props.team2.id,
        message: ""
      })
    }

  }
  render(){
    return(
      <div className="container">
        <div className="title">
          <header>{this.state.title}{this.state.message}</header>
        </div>
        <div className = "team">
          <input type = 'radio' id={this.state.gameID + "t1"}name ={this.state.gameID} onClick = {() => this.onRadioClick(1)}/>
          <label>{this.state.seed1 === 0 ? "" : "#"+ this.state.seed1} {this.state.name1}</label><br/>
        </div>
        <div className = "team">
          <input type = 'radio' id={this.state.gameID + "t2"} name ={this.state.gameID} onClick = {() => this.onRadioClick(2)}/>
          <label>{this.state.seed2 === 0 ? "" : "#"+ this.state.seed2}  {this.state.name2}</label><br/>
        </div>
      </div>
    )

  }


} export default Game;
