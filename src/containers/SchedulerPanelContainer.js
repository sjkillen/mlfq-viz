import { Container } from "flux/utils";
import SchedulerPanel from "../views/SchedulerPanel";
import SchedulerStore from "../data/SchedulerStore";

export default Container.createFunctional(SchedulerPanel, () => [SchedulerStore], () => {
   return SchedulerStore.getState().toJS();
});