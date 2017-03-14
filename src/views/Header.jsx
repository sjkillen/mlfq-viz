
import React, { Component } from "react";
import { Link } from "react-router";
import ScatterplotMatrix from "./ScatterplotMatrix";
import * as d3 from "d3";

const LArrow = {
    width: "16.66%",
    position: "fixed",
    left: "0",
    bottom: "50%",
    top: "30%"
};
const RArrow = {
    width: "16.66%",
    position: "fixed",
    right: "0",
    bottom: "50%",
    top: "30%"
};

const content = {
    width: "66.66%",
    overflow: "scroll",
    height: "500px",
    marginLeft: "16.6%",
    marginRight: "16.6%",
};

class Header extends Component {
    render() {
        return (
            <div>
                <Link to={"Scheduler"}>
                    <img src="leftArrow.png" style={LArrow} />
                </Link>
                <div style={content}>{this.props.children}</div>
                <Link to={"Scheduler"}>
                    <img src="RightArrow.png" style={RArrow} />
                </Link>
            </div>
        );
    }
};

export default Header;