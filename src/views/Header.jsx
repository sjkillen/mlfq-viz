import "../style/bootstrap/bootstrap.scss";
import "../style/Nav.scss";
import "./Header.scss";

import React, { Component } from "react";
import * as d3 from "d3";
import { Button, ButtonGroup, DropdownButton, MenuItem } from "react-bootstrap";
import DatGUI from "./dat-gui";
import { lessons, setLesson, prevLesson, nextLesson } from "../data/lessons";
import HeaderStore from "../data/HeaderStore";
import DetailView from "./DetailView";
import { nav } from "../data/FluxRouter";
import dispatcher from "../data/dispatcher";
import { navigate, routerStore } from "../data/FluxRouter";

import { Container } from "flux/utils";

const pathLArrow = require("./Images/LeftArrow.png");
const pathRArrow = require("./Images/RightArrow.png");

const myStyle = {
   backgroundColor: "black",
   color: "white",
   zIndex: "1",
};
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

function NavigationArrow({ right = true, navState }) {
   const d = right ? 1 : -1;
   if ((navState.current + d) in nav.order) {
      const key = nav.order[navState.current + d];
      return (<div className="Nav" onClick={e => navigate(navState.current + d)}>
         <img src={right ? pathRArrow : pathLArrow} className={right ? "myRArrow" : "myLArrow"} />
      </div >);
   } else {
      return (<span />);
   }
}

function Header({ selectedLesson, navState, children }) {
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
                           <MenuItem className={className} key={i} eventKey={i}
                              onSelect={setLesson} style={dropdownStyle}>
                              {i} - {lesson.lessonName}
                           </MenuItem>
                        );
                     })}
                  </DropdownButton>
                  <Button onClick={() => prevLesson(selectedLesson)}
                     className="bootstrap glyphicon glyphicon-chevron-left btn myBtn" style={myStyle} ></Button>
                  <div style={{ color: "white", display: "inline-block", width: "35px", textAlign: "center" }}>
                     {selectedLesson}
                  </div>
                  <Button onClick={() => nextLesson(selectedLesson)}
                     className="bootstrap glyphicon glyphicon-chevron-right btn myBtn" style={myStyle}></Button>
               </ButtonGroup>
            </div>
            <NavigationArrow right={false} navState={navState} />
            <NavigationArrow right={true} navState={navState} />
            <DetailView />
            {children || alert("ERROR")}
         </div>
      </div>
   );
}

export default Container.create(class HeaderContainer extends Component {
   static getStores() {
      return [HeaderStore, routerStore];
   }

   static calculateState(prevState) {
      return Object.assign({
         navState: routerStore.getState().toJS(),
      }, HeaderStore.getState().toJS());
   }

   render() {
      return <Header {...HeaderContainer.calculateState() } children={this.props.children} />;
   }
}, { withProps: true });
