import '../style/bootstrap/bootstrap.scss';
import '../style/Nav.scss';
import "./Header.scss";

import React, { Component } from "react";
import { Link } from "react-router";
import * as d3 from "d3";
import { Button, ButtonGroup, DropdownButton, MenuItem } from "react-bootstrap"
import DatGUI from './dat-gui';
import { navigate } from "../data/guiActions";
import { lessons, setLesson, prevLesson, nextLesson } from "../data/lessons"
import HeaderStore from "../data/HeaderStore";
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

function getStores() {
    return [HeaderStore];
}
function calculateState(prevState) {
    return HeaderStore.getState().toJS();
}
function lArrow() {
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

function rArrow() {
    const view = this.props.location.pathname;
    let disp;
    const lesson = this.state.selectedLesson;

    if (lesson != "EXPLORE")
        return { display: "none" }

    if (view === "/Scheduler")
        disp = "";
    else if (view === "/SPLOM")
        disp = "none";
    else if (view === "/PAPanel")

        disp = "none";

    return { display: disp }
}

function RarrowController() {
    const currentView = this.props.location.pathname;
    if (currentView === "/Scheduler" || currentView === "/")
        return "SPLOM"
    else if (currentView === "/SPLOM")
        return "PAPanel"

}

function LarrowController() {
    const currentView = this.props.location.pathname;
    if (currentView === "/SPLOM" || currentView === "/")
        return "Scheduler"
    else if (currentView === "/PAPanel")
        return "SPLOM"
}

function Header({ selectedLesson }) {
    return (
        <div className="Header">
            <div className="header">
                <DatGUI />

                <div>
                    <ButtonGroup className="bootstrap" style={myStyle}>
                        <DropdownButton title="LESSONS" id="bg-nested-dropdown" className="Nav" style={myStyle}>{
                            lessons.map((lesson, i) => {
                                const className = selectedLesson === i ? "menu selected" : "menu";
                                return (
                                    <MenuItem className={className} key={i} eventKey={i} onSelect={setLesson} style={dropdownStyle}>
                                        {i} - {lesson.lessonName}
                                    </MenuItem>
                                )
                            })}
                        </DropdownButton>
                        <Button onClick={() => prevLesson(_)} className="bootstrap glyphicon glyphicon-chevron-left btn myBtn" style={myStyle} ></Button>
                        <div style={{ color: "white", display: "inline-block", width: "35px", textAlign: "center" }}>
                            {selectedLesson}
                        </div>
                        <Button onClick={() => nextLesson(_)} className="bootstrap glyphicon glyphicon-chevron-right btn myBtn" style={myStyle}></Button>
                    </ButtonGroup>
                </div>
                <Link to={LarrowController()} className="Nav" style={lArrow()}>
                    <img src={pathLArrow} className="myLArrow" />
                </Link>
                <DetailView />
                {/*this.props.children*/}
                <Link to={RarrowController()} className="Nav" style={rArrow()}>
                    <img src={pathRArrow} className="myRArrow" />
                </Link>
            </div>
        </div>
    );
}

export default Container.createFunctional(Header, () => [HeaderStore], () => HeaderStore.getState().toJS());