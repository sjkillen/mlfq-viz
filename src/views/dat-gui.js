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
var gui;
const config = {
  "Boost Time" : 10,
  "numOfQues" : 8,
  "timeQuantums" : [],
  "numOfJobs" : 600,
  "IO Frequency Min" : 40,
  'IO Frequency Max' : 70,
  "IO Length Min" : 40,
  "IO Length Max" : 30,
  "Duration": 10,
  "generation": [],
}

const SimulationsPannel = {
	'Load' : function(){},
	'Save' : function(){},
	'Current Simulation': "Slot 1",
  'Share Link': "https://mlfq.tk/YGUuy768K",
};

const SchedulerParametersPannel = {
    get ["Number of Queues"](){
      return config.numOfQues;
    },
    set ["Number of Queues"](v){
      config.numOfQues = v;
      render(gui);
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
        return mainScheduler.speed;
    },
    set ["Speed"](v){
      mainScheduler.speed = v;
      mainScheduler.config.speed = v;
    }
};

var JobGeneratorPannel = {
    get ['Number of Jobs'](){
      return config.numOfJobs;
    },
    set ["Number of Jobs"](v){
      config.numOfJobs = v;
    },
    get ['IO Frequency Min'](){
      return config["IO Frequency Min"];
    },
    set ["IO Frequency Min"](v){
      config['IO Frequency Min'] = v;
    },
    get ['IO Frequency Max'](){
      return config["IO Frequency Max"];
    },
    set ["IO Frequency Max"](v){
      config['IO Frequency Max'] = v;
    },
    get ['IO Length Min'](){
      return config["IO Length Min"];
    },
    set ["IO Length Min"](v){
      config["IO Length Min"] = v;
    },
    get ['IO Length Max'](){
      return config["IO Length Max"];
    },
    set ["IO Length Max"](v){
      config["IO Length Max"] = v;
    },
    get ["Duration"](){
      return config["Duration"];
    },
    set ["Duration"](v){
      config["Duration"] = v;
    },
    'Generate Jobs': function() {
      refreshScheduler(config);
    }
  }

  var TimeQuantum ={
    'Queue 1': 1,
    'Queue 2': 2,
    'Queue 3': 3,
    'Queue 4': 4,
    'Queue 5': 5,
    'Queue 6': 6,
    'Queue 7': 7,
    'Queue 8': 8,
    'Queue 9': 9,
    'Queue 10': 10,
    'Queue 11': 11,
    'Queue 12': 12
  }

var RestartScheduler = {
  "Reload" : function () {
    render(gui)
    refreshScheduler(config);
  }
}


function datGui(props){
    gui = props.gui;
    render(gui);
    return null;
}

export default Container.createFunctional(datGui, () => [guiStore], () => {
   return guiStore.getState()
});


//---------------------------------- simulator panel ---------------------------------------------- 
function displaySimulations(gui, simulator) {
  var menu = gui.addFolder("Simulations");
	menu.add(simulator, 'Current Simulation', [ 'Slot 1', 'Slot 2', 'Slot 3' ]);
	menu.add(simulator, 'Share Link');
	menu.add(simulator, 'Load');
  menu.add(simulator, 'Save');
  return gui;
}
//------------------------------------- scheduler panel -------------------------------------------
  function displaySchedulerParams(gui, scheduler, TimeQuantum, numberOfQues){
    var menu2 = gui.addFolder("Scheduler Parameters"); 
      menu2.add(scheduler, 'Boost Time', 10, 100);
      menu2.add(scheduler, 'Trigger Boost')
      menu2.add(scheduler, 'Number of Queues',[1,2,3,4,5,6,7,8,9,10,11,12]);

      var Timequantum = menu2.addFolder("Time Quantums");

      for (var i = 1; i <= numberOfQues; i++){
        Timequantum.add(TimeQuantum,'Queue ' + i ,1,20);
      }
      return gui;
  }
//-------------------------------------- work load panel ------------------------------------------     
function displayJobGenerator(gui, workload){
    var gui3 = gui;
    var menu3 = gui3.addFolder("Job Generator"); 
    menu3.add(workload,'Number of Jobs', 1,10);
    menu3.add(workload,'IO Frequency Min', 1,10);
    menu3.add(workload,'IO Frequency Max', 1,10);
    menu3.add(workload,'Duration',1,10);
    menu3.add(workload,'IO Length Min',1,10);
    menu3.add(workload,'IO Length Max',1,10);
    menu3.add(workload,'Generate Jobs');
    return gui;
}

var reloadReference = 0;
function render(gui) {
  gui.removeFolder("Simulations");
  gui.removeFolder("Scheduler Parameters");
  gui.removeFolder("Job Generator");
  gui = displaySimulations(gui, SimulationsPannel);
  gui = displaySchedulerParams(gui, SchedulerParametersPannel, TimeQuantum, config.numOfQues);
  gui = displayJobGenerator(gui, JobGeneratorPannel);
  if (reloadReference === 0)
    reloadReference = gui.add(SchedulerParametersPannel,'Speed',100,6000);
  else {
    gui.remove(reloadReference);
    reloadReference = gui.add(SchedulerParametersPannel,'Speed',100,6000);

  }
}
function createTQs() {
  const myArray = [];
  for (var i = 1; i <= config["numOfQues"]; i++)
    myArray.push(TimeQuantum["Queue " + i]);
  return myArray;
}
//i suposed to restart the scheduler
  function refreshScheduler(config){

    restartScheduler({
          timeQuantums: createTQs(),
          boostTime: config["Boost Time"],
          resetTQsOnIO: false,
          random,
          speed: mainScheduler.speed,
          generation: [{
            ioFrequencyRange: [config["IO Frequency Min"], config["IO Frequency Max"]],
            jobRuntimeRange: [1, config["Duration"]],
            numJobsRange: [config["numOfJobs"], config["numOfJobs"]],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [config["IO Length Min"], config["IO Length Max"]]
          }],
      });
}