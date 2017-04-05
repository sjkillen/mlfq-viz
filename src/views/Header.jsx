import React, { Component } from "react";
import { Link } from "react-router";
import ScatterplotMatrix from "./ScatterplotMatrix";
import * as d3 from "d3";
import { Button, ButtonGroup, DropdownButton, MenuItem } from "react-bootstrap"
import '../style/bootstrap/bootstrap.scss';
import '../style/Nav.scss';
import DatGUI from './dat-gui';
import { navigate } from "../data/guiActions";
import lessons, { setLesson } from "../data/lessons"


const pathLArrow = require("./Images/leftArrow.png");
const pathRArrow = require("./Images/RightArrow.png");


const content = {
   width: "80.00%",
   height: "95%",
}
const myStyle = {
   backgroundColor: "black",
   color: "white",
}
const dropdownStyle = {
   backgroundColor: "black",
   zIndex: "0",
   color: "white",
};


class Header extends Component {
    
    lArrow() {
        var view = this.props.location.pathname;
        var disp = ""
        if (view === "/Scheduler")
            disp = "none";
        else if (view === "/SPLOM") 
            disp = "";
        else if (view === "/PAPanel"){
            disp = "";
        }
        return {display: disp}
    }

    rArrow() {
        var view = this.props.location.pathname;
        var disp;
        if (view === "/Scheduler") 
            disp: "";
        else if (view === "/SPLOM") 
            disp = "";
        else if(view === "/PAPanel")
            disp = "none";

        return {display: disp}
    }

    RarrowController () {
        var currentView = this.props.location.pathname;
         if (currentView === "/Scheduler")
            return "SPLOM"
        else if (currentView === "/SPLOM") 
            return "PAPanel"
    }

    LarrowController () {
        var currentView = this.props.location.pathname;
         if (currentView === "/SPLOM")
            return "Scheduler"
        else if (currentView === "/PAPanel")
            return "SPLOM"
    }

    

    configScheduler(){
    }

    configHandler (event) {
        switch (event) {
            case "0":
                console.log("0!")  
                break;
            case "1":
                console.log("1!")  
                break;
            case "2": 
                console.log("2!!");
                break;
            case "3": 
                console.log("3!!");
                break;
            case "4": 
                console.log("4!!");
                break;
            case "5": 
                console.log("5!!");
                break;
            case "6": 
                console.log("6!!");
                break;
            case "7":
                console.log("7!!");
                break;
            default:
                break;
        }
    }

    render() {
        return (
            
            <div>
            <DatGUI Hello="asdasdfasdfadf"/>
                <div>
                    <ButtonGroup className="bootstrap" style={myStyle}>
                        <DropdownButton title="LESSONS" id="bg-nested-dropdown" className="Nav" style={myStyle}>
                            <MenuItem eventKey="0" className="MenuItem" onSelect={this.configHandler} style={dropdownStyle}>EXPLORE</MenuItem>
                            <MenuItem eventKey="1" className="" onSelect={this.configHandler} style={dropdownStyle}>GETTING STARTED</MenuItem>
                            <MenuItem eventKey="2" className="" onSelect={this.configHandler} style={dropdownStyle}>JOB LIFE CYCLE</MenuItem>
                            <MenuItem eventKey="3" className="" onSelect={this.configHandler} style={dropdownStyle}>BASIC IO</MenuItem>
                            <MenuItem eventKey="4" className="" onSelect={this.configHandler} style={dropdownStyle}>THE TIME QUANTUM</MenuItem>
                            <MenuItem eventKey="5" className="" onSelect={this.configHandler} style={dropdownStyle}>IO FREQUENCY AND PRIORITY</MenuItem>
                            <MenuItem eventKey="6" className="" onSelect={this.configHandler} style={dropdownStyle}>PERSISTENT TIME QUANTUMS</MenuItem>
                            <MenuItem eventKey="7" className="" onSelect={this.configHandler} style={dropdownStyle}>THE BOOST TIMER</MenuItem>
                        </DropdownButton>
                        <Button className="bootstrap glyphicon glyphicon-chevron-left btn myBtn" style={myStyle} ></Button>
                        <div style={{ color: "white", display: "inline-block", width: "35px", textAlign: "center" }}>
                            {10}
                        </div>

                        <Button className="bootstrap glyphicon glyphicon-chevron-right btn myBtn" style={myStyle}></Button>
                        
                    
                    </ButtonGroup>
                </div>
                <Link to={this.LarrowController()} className="Nav" style = {this.lArrow()}>
                    <img src={pathLArrow} className="myLArrow"/>
                </Link>
                <div style={content}>{this.props.children}</div>
                <Link to={this.RarrowController()} className="Nav"  style = {this.rArrow()}>
                    <img src={pathRArrow} className="myRArrow"/>
                </Link>
            </div>
        );
    }
}

export default Header;