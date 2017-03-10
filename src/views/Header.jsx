
import React, { Component } from 'react'
import { Link } from 'react-router'
import ScatterplotMatrix from "./ScatterplotMatrix"
import "./Navigation.scss"
import * as d3 from "d3";


const LArrow = {
    height: "25%",
    width: "16.66%"
}
const RArrow = {
    height: "25%",
    width: "16.66%"
}


class Header extends Component{

  render() {
    return (
        <div>
        <Link to={"Scheduler"}>
            <img src="leftArrow.png" style={LArrow}/>
        </Link>
        <div style={{width:"66.66%", overflow: "scroll", height:"300px"}}>{this.props.children}</div>
        <Link to={"Scheduler"}>
            <img src="RightArrow.png" style={RArrow}/>
        </Link>
        </div>
    )
  }
};







export default Header