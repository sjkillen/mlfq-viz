import dispatcher from "./dispatcher";

export const actions = {
   UPDATE_PARALLEL_AXIS: Symbol("UPDATE_PARALLEL_AXIS")
};

export function updateParallelAxis(props) {
    dispatcher.dispatch({
        type: actions.UPDATE_PARALLEL_AXIS,
        data: props
    });
}