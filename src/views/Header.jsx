
import React, { Component } from 'react'
import { Link } from 'react-router'
import ScatterplotMatrix from "./ScatterplotMatrix"
import * as d3 from "d3";
import {Button, ButtonGroup,  DropdownButton, MenuItem} from "react-bootstrap"
import '../style/bootstrap/bootstrap.scss';
import '../style/Nav.scss';

const LArrow = {
    width: "16.66%",
    position: "fixed",
    left:"0",
    bottom:"50%",
    top:"30%"
}
const RArrow = {
    width: "16.66%",
    position: "fixed",
    right:"0",
    bottom:"50%",
    top:"30%"
}

const content = {
    width:"66.66%", 
    overflow: "scroll", 
    height:"500px",
    marginLeft: "16.6%",
    marginRight: "16.6%",
}

const NavBar = {
    width: "100%",
    position: "fixed",
    backgroundColor: "Black",
    margin: 0

};

const myStyle = {
    backgroundColor: "black",

}

const dropdownStyle = {
    backgroundColor: "black",
    zIndex : "0",
    color: "white",
}

class Header extends Component{

  render() {
    return (
        <div>
        
            <div style={NavBar}>
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
                    <Button className="bootstrap glyphicon glyphicon-chevron-right" style={myStyle}></Button>
                    <Button className="bootstrap glyphicon glyphicon-chevron-left" style={myStyle}></Button>
                </ButtonGroup>
            </div>

            <Link to={"Scheduler"}>
                <img src="leftArrow.png" style={LArrow}/>
            </Link>
            <div style={content}>{this.props.children}</div>
            <Link to={"Henry"}>
                <img src="RightArrow.png" style={RArrow}/>
            </Link>
        </div>
        
    )
  }
};







export default Header