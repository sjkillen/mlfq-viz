import dat from "dat.gui/build/dat.gui.min"
import mainScheduler from "../scheduler"
import random from "../randomAdapter";
import path from "path";
//---------------------------------- simulator panel ---------------------------------------------- 



if (window.location.href.includes("SPLOM")){
  console.log("SPLOM VIEW");
} else {
  console.log("Scheduler view");
}



var simulator = {
	'Load' : function(){},
	'Save' : function(){},
	'Current Simulation': "Slot 1",
  'Share Link': "https://mlfq.tk/YGUuy768K",
  'Enter Explore Mode': () => {}
  };
  var simulator_config = {
  'Duration': 100,
  get ["Speed"](){
      return mainScheduler.speed;
  },
  set ["Speed"](v){
    mainScheduler.speed = v;

  },

  'Color': false,
  };

  var gui = new dat.GUI();
  var menu = gui.addFolder("Simulations");

	menu.add(simulator, 'Current Simulation', [ 'Slot 1', 'Slot 2', 'Slot 3' ]);
	menu.add(simulator, 'Share Link');
	menu.add(simulator, 'Load');
  menu.add(simulator, 'Save');
  menu.add(simulator, 'Enter Explore Mode')
  
   var Config = menu.addFolder("Playback");
   Config.add(simulator_config,'Speed',100,6000);
//}
  
 //------------------------------------- scheduler panel ------------------------------------------- 
  var scheduler = {
  "Number of Queues": 12,
	'Boost Time': 10,
	'Trigger Boost': function(){
    mainScheduler.boostJobs();

  }
  };
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

  function createTQs() {
    const myArray = [];
    for (var element in TimeQuantum) {
      const [,val] = /Queue ([0-9]*)/.exec(element);
      myArray[val-1] = TimeQuantum[element];
    }
    return myArray;
  }
  
	var gui2 = gui
  var menu2 = gui2.addFolder("Scheduler Parameters"); 
  menu2.add(scheduler, 'Boost Time', 10, 100);
  menu2.add(scheduler, 'Trigger Boost')
  menu2.add(scheduler, 'Number of Queues',[1,2,3,4,5,6,7,8,9,10,11,12]);
  	
   var Timequantum = menu2.addFolder("Time Quantums");
  	Timequantum.add(TimeQuantum,'Queue 1',1,20);
    Timequantum.add(TimeQuantum,'Queue 2',1,20);
    Timequantum.add(TimeQuantum,'Queue 3',1,20);
    Timequantum.add(TimeQuantum,'Queue 4',1,20);
    Timequantum.add(TimeQuantum,'Queue 5',1,20);
    Timequantum.add(TimeQuantum,'Queue 6',1,20);
    Timequantum.add(TimeQuantum,'Queue 7',1,20);
    Timequantum.add(TimeQuantum,'Queue 8',1,20);
    Timequantum.add(TimeQuantum,'Queue 9',1,20);
    Timequantum.add(TimeQuantum,'Queue 10',1,20);
    Timequantum.add(TimeQuantum,'Queue 11',1,20);
    Timequantum.add(TimeQuantum,'Queue 12',1,20);
//-------------------------------------- work load panel ------------------------------------------     

  	var workload = {
		'Number of Jobs': 600,
		'IO Frequency Min': 70,
		'IO Frequency Max': 70,
    "IO Length Min"   : 40,
    "IO Length Max"   : 30,

    'Generate Jobs': function() {
      refreshScheduler();
  },
    'Seed': "GY34uyit786UJG"
  }
  var gui3 = gui2
  var menu3 = gui3.addFolder("Job Generator"); 
  menu3.add(workload,'Number of Jobs', 1,1000);
  menu3.add(workload,'IO Frequency Min', 1,100);
  menu3.add(workload,'IO Frequency Max', 1,100);
  menu3.add(simulator_config,'Duration',1,1000);
	menu3.add(workload,'IO Length Min',1,100);
	menu3.add(workload,'IO Length Max',1,100);
	menu3.add(workload,'Seed');
	menu3.add(workload,'Generate Jobs');
  
  //workload
  //timeQuantums
  //scheduler
  //simulator_config


  function refreshScheduler(config){
    mainScheduler.constructor(
      {
          timeQuantums: createTQs(),
          boostTime: Infinity,
          resetTQsOnIO: false,
          random,
          speed: mainScheduler.speed,
          generation: [
              {
                  ioFrequencyRange: [80, 100],
                  jobRuntimeRange: [Infinity, Infinity],
                  numJobsRange: [1, 1],
                  jobCreateTimeRange: [10, 10],
                  ioLengthRange: [5, 5]
              },
              {
                  ioFrequencyRange: [33, 80],
                  jobRuntimeRange: [Infinity, Infinity],
                  numJobsRange: [1, 1],
                  jobCreateTimeRange: [1, 1],
                  ioLengthRange: [0, 0]
              }
          ]
      }
    )
}