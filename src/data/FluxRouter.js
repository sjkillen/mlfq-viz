import SPLOMPanel from "../views/SPLOMPanel";
import SchedulerPanel from "../views/SchedulerPanel";
import { deepFreeze } from "../util";
import dispatcher from "./dispatcher";
import { ReduceStore, Container } from "flux/utils";
import { fromJS as immut } from "immutable";

export const nav = {
    map: {
        '/Scheduler': SchedulerPanel,
        'SPLOM': SPLOMPanel,
    },
    order: ['/Scheduler', 'SPLOM']
};
deepFreeze(nav);

const actions = {
    navigate: Symbol()
}

class RouterStore extends ReduceStore {
    getInitialState() {
        return immut({
            url: '/Scheduler',
            current: 0
        });
    }
    reduce(state, action) {
        switch (action.type) {
            case actions.navigate:
                return state.set("current", action.toIndex).set("url", nav.order[action.toIndex]);
        }
        return state;
    }
}

export const routerStore = new RouterStore(dispatcher);

export function navigate(toIndex) {
    dispatcher.dispatch({
        type: actions.navigate,
        toIndex
    });
}

function RouterSC({ url }) {
    if (url in nav.map) {
        return React.createElement(nav.map[url]);
    } else {
        return (<span />);
    }
}


export const Router = Container.createFunctional(RouterSC, () => [routerStore], () => routerStore.getState().toJS());