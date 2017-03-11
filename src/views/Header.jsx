
import React, { Component } from 'react'
import { Link } from 'react-router'
import ScatterplotMatrix from "./ScatterplotMatrix"
import * as d3 from "d3";
import {Button, ButtonGroup,  DropdownButton, MenuItem} from "react-bootstrap"
import '../style/bootstrap/bootstrap.scss';

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
    background

};
class Header extends Component{

  render() {
    return (
        <div>
            <div style={NavBar}>
                <ButtonGroup className="bootstrap">
                    <DropdownButton title="Dropdown" id="bg-nested-dropdown" className="bootstrap">
                        <MenuItem eventKey="1" className="bootstrap">Dropdown link</MenuItem>
                        <MenuItem eventKey="2" className="bootstrap">Dropdown link</MenuItem>
                    </DropdownButton>
                    <Button className="bootstrap">{"<-"}</Button>
                    <Button className="bootstrap">{"->"}</Button>
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