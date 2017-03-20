import React, { Component } from "react";
import { Link } from "react-router";
import ScatterplotMatrix from "./ScatterplotMatrix";
import * as d3 from "d3";
import {Button, ButtonGroup,  DropdownButton, MenuItem} from "react-bootstrap"
import '../style/bootstrap/bootstrap.scss';
import '../style/Nav.scss';
const pathLArrow = require ("./Images/leftArrow.png");
const pathRArrow = require ("./Images/RightArrow.png");



const content = {
    width:"80.00%",  
    height:"95%",
}

const myStyle = {
    backgroundColor: "black",
}

const dropdownStyle = {
    backgroundColor: "black",
    zIndex: "0",
    color: "white",
};



class Header extends Component {
    
    lArrow() {
        return {display: this.props.location.pathname === "/Scheduler" ? "none" : ""}
    }

    rArrow() {
        return {display: this.props.location.pathname === "/Scheduler" ? "" : "none"}
    }

    render() {
        return (
            <div>
                <div>
                    <ButtonGroup className="bootstrap" style={myStyle}>
                        <DropdownButton title="LESSONS" id="bg-nested-dropdown" className="" style={myStyle}>
                            <MenuItem eventKey="1" className="" style={dropdownStyle}>GETTING STARTED</MenuItem>
                            <MenuItem eventKey="2" className="" style={dropdownStyle}>JOB LIFE CYCLE</MenuItem>
                            <MenuItem eventKey="3" className="" style={dropdownStyle}>BASIC IO</MenuItem>
                            <MenuItem eventKey="4" className="" style={dropdownStyle}>THE TIME QUANTUM</MenuItem>
                            <MenuItem eventKey="5" className="" style={dropdownStyle}>IO FREQUENCY AND PRIORITY</MenuItem>
                            <MenuItem eventKey="6" className="" style={dropdownStyle}>PERSISTENT TIME QUANTUMS</MenuItem>
                            <MenuItem eventKey="7" className="" style={dropdownStyle}>THE BOOST TIMER</MenuItem>
                        </DropdownButton>
                        <Button className="bootstrap glyphicon glyphicon-chevron-right btn myBtn" style={myStyle} ></Button>
                        <div style={{ color: "white", display: "inline-block", width: "35px", textAlign: "center" }}>
                            {10}
                        </div>

                        <Button className="bootstrap glyphicon glyphicon-chevron-left btn myBtn" style={myStyle}></Button>
                        
                    
                    </ButtonGroup>
                </div>

                <Link to={"Scheduler"} className="Nav" style = {this.lArrow()}>
                    <img src={pathLArrow} className="myLArrow"/>
                    
                </Link>
                <div style={content}>{this.props.children}</div>
                <Link to={"SPLOM"} className="Nav"  style = {this.rArrow()}>
                    <img src={pathRArrow} className="myRArrow"/>
                </Link>
            </div>
        );
    }
}
export default Header;