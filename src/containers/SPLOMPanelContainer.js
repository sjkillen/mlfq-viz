import { Container } from "flux/utils";
import {Component} from 'react';
import SchedulerStore from "../data/SchedulerStore";

export default Container.createFunctional(SPLOMPanel, () => [SchedulerStore], () => {
   return SchedulerStore.getState()
});


function SPLOMPanel(scheduler) {
    console.log(scheduler)
   return (
      <div>
         Status:
         {window.getStatus()}
      </div>
   );
}