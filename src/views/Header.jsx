
import React, { Component } from 'react'
import { Link } from 'react-router'
import ScatterplotMatrix from "./ScatterplotMatrix"
import "./Navigation.scss"
import * as d3 from "d3";


const LArrow = {
    height: "25%",
    marginTop: "100px"
}
const RArrow = {
    height: "25%",
    marginTop: "50px",
    marginLeft: "90%"
}


class Header extends Component{

  render() {
    return (
        <div>
         <svg ref={(el) => update(el)} className="image">
         </svg>

        <Link to={"Scheduler"}>
            <img src="leftArrow.png" style={LArrow}/>
            <img src="RightArrow.png" style={RArrow}/>
        </Link>
        </div>
    )
  }
};



function update(svgElement) {
   if (!svgElement) return;
   const width = 1800, height = 500;

}






export default Header