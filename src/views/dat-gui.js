import dat from "dat.gui/build/dat.gui.min"
import mainScheduler from "../scheduler"
import random from "../randomAdapter";
import path from "path";

import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import React, { Component } from 'react'
import * as d3 from "d3";
import guiStore from "../data/guiStore"
import {restartScheduler} from "../data/SchedulerActions"


//for removing folders thanks stack overflow! http://stackoverflow.com/questions/18085540/remove-folder-in-dat-gui
dat.GUI.prototype.removeFolder = function(name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
}
//gui is the dat.gui instance
var gui
var currentLesson;

const config = {
  "Boost Time" : 10,
  "Number of Queues" : 8,
  "timeQuantums" : [],
  "Number of Jobs" : 10,
  "IO Frequency Min" : 10,
  'IO Frequency Max' : 10,
  "IO Length Min" : 10,
  "IO Length Max" : 10,
  "Duration": 10,
  "Jobs Start Time": 10,
  "generation": [],
  "Scheduler Height": 25,
  "Speed": 1,
  "Start Time Spacing": 1
}

const SimulationsPannel = {
	'Load' : function(){},
	'Save' : function(){},
	'Current Simulation': "Slot 1",
  'Share Link': "https://mlfq.tk/YGUuy768K",
};

var propsParameter;
const SchedulerParametersPannel = {
    get ["Number of Queues"](){
      return config["Number of Queues"];
    },
    set ["Number of Queues"](v){
      config["Number of Queues"] = v;

      if (currentLesson === "EXPLORE")
        render(gui)
      else 
        renderGui(gui, propsParameter)
    },
    get ["Boost Time"]() {
      return config["Boost Time"];
    },
    set ["Boost Time"](v) {
      config["Boost Time"] = v;
    },
    'Trigger Boost': function(){
      mainScheduler.boostJobs();
    },
    get ["Speed"](){
        return config["Speed"]
        //return mainScheduler.speed;
    },
    set ["Speed"](v){
      config["Speed"] = v
      mainScheduler.speed = 2100 - 200 * config["Speed"];
      mainScheduler.config.speed = 2100 - 200 * config["Speed"];
    },
    get ["Scheduler Height"](){
        return config["Scheduler Height"]
    },
    set ["Scheduler Height"](v){
      config["Scheduler Height"] = v;
    }


    
};

var JobGeneratorPannel = {
    get ['Number of Jobs'](){
      return config['Number of Jobs'];
    },
    set ["Number of Jobs"](v){
      config["Number of Jobs"] = v;
    },
    get ['IO Frequency Min'](){
      return config["IO Frequency Min"];
    },
    set ["IO Frequency Min"](v){
      if (v < config['IO Frequency Max'])
        config['IO Frequency Min'] = v;
      else 
        config['IO Frequency Min'] = config['IO Frequency Max'];
    },
    get ['IO Frequency Max'](){
      return config["IO Frequency Max"];
    },
    set ["IO Frequency Max"](v){
      if (v > config['IO Frequency Min'])
        config['IO Frequency Max'] = v;
      else 
        config['IO Frequency Max'] = config['IO Frequency Min'];
    },
    get ['IO Length Min'](){
      return config["IO Length Min"];
    },
    set ["IO Length Min"](v){
      if (v < config['IO Length Max'])
        config['IO Length Min'] = v;
      else 
        config['IO Length Min'] = config['IO Length Max'];
    },
    get ['IO Length Max'](){
      return config["IO Length Max"];
    },
    set ["IO Length Max"](v){
      if (v > config['IO Length Min'])
        config['IO Length Max'] = v;
      else 
        config['IO Length Max'] = config['IO Length Min'];
    },
    get ["Duration"](){
      return config["Duration"];
    },
    set ["Duration"](v){
      config["Duration"] = v;
    },
    get ["Jobs Start Time"](){
      return config["Jobs Start Time"];
    },
    set ["Jobs Start Time"](v){
      config["Jobs Start Time"] = v;
    },
    'Generate Jobs': function() {
      refreshScheduler(config);
    },
    get ["Start Time Spacing"](){
      return config["Start Time Spacing"];
    },
    set ["Start Time Spacing"](v){
      config["Start Time Spacing"] = v;
    },
    

  }

  var TimeQuantum ={
    'Queue 0': 1,
    'Queue 1': 2,
    'Queue 2': 3,
    'Queue 3': 4,
    'Queue 4': 5,
    'Queue 5': 6,
    'Queue 6': 7,
    'Queue 7': 8,
    'Queue 8': 9,
    'Queue 9': 10,
    'Queue 10': 11,
    'Queue 11': 12,
  }


//2100 - 200 * config["Speed"];
//this is what is connected to the store
function datGui(props){
    propsParameter = props.parameter
    gui = props.gui;
    if (props.parameter["render"] === true) {
      currentLesson = props.lessonName
      renderGui(gui, propsParameter)
      SchedulerParametersPannel["Speed"] = props.simulation.speed / 1000
      retainSpeed(gui);
    } 
    if (currentLesson === "EXPLORE")
      render(gui);
    
    return null;
}



export default Container.createFunctional(datGui, () => [guiStore], () => {
   return guiStore.getState()
});


//------------------------------------- scheduler panel -------------------------------------------
  function displaySchedulerParams(gui, scheduler, TimeQuantum, numberOfQues){
    var menu2 = gui.addFolder("Scheduler Parameters"); 
      menu2.add(scheduler, 'Boost Time', 10, 1000);
      menu2.add(scheduler, 'Trigger Boost')
      menu2.add(scheduler, 'Number of Queues',[1,2,3,4,5,6,7,8,9,10,11,12]);
      var Timequantum = menu2.addFolder("Time Quantums");
      for (var i = 0; i < numberOfQues; i++)
        Timequantum.add(TimeQuantum,'Queue ' + i ,1,20);
      return gui;
  }
//-------------------------------------- work load panel ------------------------------------------     
function displayJobGenerator(gui, workload){
    var gui3 = gui;
    var menu3 = gui3.addFolder("Job Generator"); 
    menu3.add(workload,'Number of Jobs', 1,50);
    menu3.add(workload,'Duration',1,100);
    menu3.add(workload, "Start Time Spacing", 1, 500)
    menu3.add(workload,'IO Frequency Min', 1,10);
    menu3.add(workload,'IO Frequency Max', 1,10);

    menu3.add(workload,'IO Length Min',1,10);
    menu3.add(workload,'IO Length Max',1,10);
    menu3.add(workload,'Generate Jobs');
    return gui;
}

//--------------------------------------for clearing the pannels
function render(gui) {
  clearPanels(gui);
  gui = displaySchedulerParams(gui, SchedulerParametersPannel, TimeQuantum, config["Number of Queues"]);
  gui = displayJobGenerator(gui, JobGeneratorPannel);
  retainSpeed(gui);
}

function renderGui(gui, params) {
  clearPanels(gui);
  const panels = Object.getOwnPropertyNames(params);
  
  for (let i=0; i<panels.length; i++){

    if(panels[i] === "Scheduler Parameters") {
      const menu = gui.addFolder(panels[i]);
      const SchedulerAttributes = Object.getOwnPropertyNames(params[panels[i]]);

      for (let k = 0; k < SchedulerAttributes.length; k++){
        
        if (SchedulerAttributes[k] === "Number of Queues"){
          const arr = []
          const numberOfQues = params[panels[i]][SchedulerAttributes[k]];
          config["Number of Queues"] = numberOfQues;

          for (let i = 1; i <= numberOfQues; i++)
            arr.push(i);
          menu.add(SchedulerParametersPannel, SchedulerAttributes[k], arr)
          
          const Timequantum = menu.addFolder("Time Quantums");
          const tqVals = params[panels[i]]["timeQuantums"];
          const tqDisplayVals = Object.getOwnPropertyNames(TimeQuantum);
          for (let i = 0; i < numberOfQues; i++) {
            TimeQuantum[tqDisplayVals[i-1]] = tqVals[i-1]
            Timequantum.add(TimeQuantum,'Queue ' + i , 1, 20);
          }
          
        } else if (SchedulerAttributes[k] === "Boost Time"){
          let boostTime = params[panels[i]][SchedulerAttributes[k]];
          config["Boost Time"] = boostTime;
          menu.add(SchedulerParametersPannel, SchedulerAttributes[k], 1, boostTime)
          menu.add(SchedulerParametersPannel, "Trigger Boost")
        } else if (SchedulerAttributes[k] === "Scheduler Height"){
          menu.add(SchedulerParametersPannel, SchedulerAttributes[k], 1, 50)
        }
      }
    }

    else if (panels[i] === "Job Generator"){
      const SchedulerAttributes = Object.getOwnPropertyNames(params[panels[i]]);
      const menu = gui.addFolder(panels[i]);

      for (let k = 0; k < SchedulerAttributes.length; k++){
        const displayValue = params[panels[i]][SchedulerAttributes[k]];
        config[SchedulerAttributes[k]] = displayValue; 
        let max = 20
        if(SchedulerAttributes[k] === "Duration")
          max = 100;
        
        menu.add(JobGeneratorPannel, SchedulerAttributes[k], 1, max)
      }
      if(currentLesson === "EXPLORE")
        menu.add(JobGeneratorPannel, "Generate Jobs")
        
    }
  }
  retainSpeed(gui);
}

var reloadReference = 0;
function retainSpeed(gui){
  if (reloadReference === 0)
    reloadReference = gui.add(SchedulerParametersPannel,'Speed',1, 10);
  else {
    gui.remove(reloadReference);
    reloadReference = gui.add(SchedulerParametersPannel,'Speed',1, 10);
  }
}


function clearPanels(gui){
  gui.removeFolder("Scheduler Parameters");
  gui.removeFolder("Job Generator");
}


function createTQs() {
  const myArray = [];
  for (var i = 1; i <= config["Number of Queues"]; i++)
    myArray.push(Math.round(TimeQuantum["Queue " + i]));
  return myArray;
}

//i suposed to restart the scheduler
function refreshScheduler(config){
    restartScheduler({
          timeQuantums: createTQs(),
          boostTime: Math.round(config["Boost Time"]),
          resetTQsOnIO: false,
          random,
          speed: mainScheduler.speed,
          generation: [{
            ioFrequencyRange: [config["IO Frequency Min"], config["IO Frequency Max"]],
            jobRuntimeRange: [1, config["Duration"]],
            numJobsRange: [config["Number of Jobs"], config["Number of Jobs"]],
            jobCreateTimeRange: [1, Math.round(config["Start Time Spacing"])],
            ioLengthRange: [config["IO Length Min"], config["IO Length Max"]],
          }],
      });
}