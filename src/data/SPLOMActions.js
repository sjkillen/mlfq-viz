import dispatcher from "./dispatcher";

export const actions = {
   UPDATE_MATRIX: Symbol("UPDATE_MATRIX")
};

export function updateMatrix(props) {
    dispatcher.dispatch({
        type: actions.UPDATE_MATRIX,
        data: props
    });
}