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
import DetailView from "./DetailView"


import { Container } from "flux/utils";

const pathLArrow = require("./Images/LeftArrow.png");
const pathRArrow = require("./Images/RightArrow.png");

const myStyle = {
    backgroundColor: "black",
    color: "white",
    zIndex: "1"
}
const dropdownStyle = {
    backgroundColor: "black",
    zIndex: "1",
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
        else if (view === "/PAPanel") {
            disp = "";
        }
        return { display: disp }
    }

    rArrow() {
        const view = this.props.location.pathname;
        let disp;
        if (view === "/Scheduler")
            disp = "";
        else if (view === "/SPLOM")
            disp = "none";
        else if (view === "/PAPanel")

            disp = "none";

        return { display: disp }
    }

    RarrowController() {
        const currentView = this.props.location.pathname;
        if (currentView === "/Scheduler")
            return "SPLOM"
        else if (currentView === "/SPLOM")
            return "PAPanel"

    }

    LarrowController() {
        const currentView = this.props.location.pathname;
        if (currentView === "/SPLOM")
            return "Scheduler"
        else if (currentView === "/PAPanel")
            return "SPLOM"
    }
    render() {
        let lessonIndex = "-";
        const indexLookup = [];
        return (
            <div className="Header">
                <div className="header">
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
                                            {i} - {lessons[lesson].lessonName || lesson}
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
                    <DetailView />
                    {this.props.children}
                    <Link to={this.RarrowController()} className="Nav" style={this.rArrow()}>
                        <img src={pathRArrow} className="myRArrow" />
                    </Link>
                </div>
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