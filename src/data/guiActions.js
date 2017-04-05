import dispatcher from "./dispatcher";


export function navigate(to){

   dispatcher.dispatch({
      type: "NAVIGATE",
      data: to
   });
}