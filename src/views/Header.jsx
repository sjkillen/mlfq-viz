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


function lArrow(location) {
   return { display: location.pathname === "/Scheduler" ? "none" : "" }
}

function rArrow(location) {
   return { display: location.pathname === "/Scheduler" ? "" : "none" }
}

function Header({ children, location }) {
   return (
      <div>
         <DatGUI />
         <div>
            <ButtonGroup className="bootstrap" style={myStyle}>
               <DropdownButton title="LESSONS" id="bg-nested-dropdown" className="Nav" style={myStyle}>
                  {Object.getOwnPropertyNames(lessons).map((lesson, i) => {
                     return (
                        <MenuItem key={lesson} eventKey={lesson} onSelect={setLesson} style={dropdownStyle}>
                           {lessons[lesson].lessonName || lesson}
                        </MenuItem>
                     )
                  })}
               </DropdownButton>
               <Button className="bootstrap glyphicon glyphicon-chevron-left btn myBtn" style={myStyle} ></Button>
               <div style={{ color: "white", display: "inline-block", width: "35px", textAlign: "center" }}>
                  {10}
               </div>
               <Button className="bootstrap glyphicon glyphicon-chevron-right btn myBtn" style={myStyle}></Button>
            </ButtonGroup>
         </div>
         <Link to={"Scheduler"} className="Nav" style={this.lArrow()} onClick={() => navigate("Scheduler")}>
            <img src={pathLArrow} className="myLArrow" />
         </Link>
         <div style={content}>{this.props.children}</div>
         <Link to={"SPLOM"} className="Nav" style={this.rArrow()} onClick={navigate.bind(null, "SPLOM")}>
            <img src={pathRArrow} className="myRArrow" />
         </Link>
      </div>
   );
}

export default Header;