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
import HeaderStore from "../data/HeaderStore";
import "./Header.scss";

import { Container } from "flux/utils";

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
   static getStores() {
      return [HeaderStore];
   }
   static calculateState(prevState) {
      return HeaderStore.getState().toJS();
   }
    lArrow() {
        const view = this.props.location.pathname;
        let disp = ""
        if (view === "/Scheduler")
            disp = "none";
        else if (view === "/SPLOM")
            disp = "";
        else if (view === "/PAAxis") {
            disp = "";
        }
        return { display: disp }
    }

    rArrow() {
        const view = this.props.location.pathname;
        let disp;
        if (view === "/Scheduler")
            disp =  "";
        else if (view === "/SPLOM")
            disp = "";
        else if (view === "/PAAxis")
            disp = "none";

        return { display: disp }
    }

    RarrowController() {
        const currentView = this.props.location.pathname;
        if (currentView === "/Scheduler")
            return "SPLOM"
        else if (currentView === "/SPLOM")
            return "PAAxis"
    }

    LarrowController() {
        const currentView = this.props.location.pathname;
        if (currentView === "/SPLOM")
            return "Scheduler"
        else if (currentView === "/PAAxis")
            return "SPLOM"
    }
    render() {
        let lessonIndex = "-";
        const indexLookup = [];
        return (
            <div className="Header">
                <DatGUI />
                <div>
                    <ButtonGroup className="bootstrap" style={myStyle}>
                        <DropdownButton title="LESSONS" id="bg-nested-dropdown" className="Nav" style={myStyle}>{
                            Object.getOwnPropertyNames(lessons).map((lesson, i) => {
                                indexLookup[i] = lesson;
                                const selected = this.state.selectedLesson === lessons[lesson].lessonName;
                                const className = selected ? "menu selected" : "menu";
                                if (selected) lessonIndex = i;
                                return (
                                    <MenuItem className={className} key={lesson} eventKey={lesson} onSelect={setLesson} style={dropdownStyle}>
                                        { i } - {lessons[lesson].lessonName || lesson}
                                    </MenuItem>
                                )
                            })}
                        </DropdownButton>
                        <Button onClick={() => moveLesson(indexLookup, lessonIndex, -1)} className="bootstrap glyphicon glyphicon-chevron-left btn myBtn" style={myStyle} ></Button>
                        <div style={{ color: "white", display: "inline-block", width: "35px", textAlign: "center" }}>
                            {lessonIndex}
                        </div>
                        <Button onClick={() => moveLesson(indexLookup, lessonIndex, +1)} className="bootstrap glyphicon glyphicon-chevron-right btn myBtn" style={myStyle}></Button>
                    </ButtonGroup>
                </div>
                <Link to={this.LarrowController()} className="Nav" style={this.lArrow()}>
                    <img src={pathLArrow} className="myLArrow" />
                </Link>
                <div style={content}>{this.props.children}</div>
                <Link to={this.RarrowController()} className="Nav" style={this.rArrow()}>
                    <img src={pathRArrow} className="myRArrow" />
                </Link>
            </div>
        );
    }
}

function moveLesson(lookup, index, mov) {
    const newIndex = index + mov;
    if (!Number.isInteger(index) || newIndex < 0 || newIndex >= lookup.length) return;
    setLesson(lookup[newIndex]);
}

export default Container.create(Header);