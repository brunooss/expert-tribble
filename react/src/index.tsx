import * as React from "react";
import * as ReactDOM from "react-dom";
import * as firebase from "firebase";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const config = {
  apiKey: "AIzaSyCNkb1WAn6iPHQpXhFhs6-wr0RzToyDOSk",
  authDomain: "expert-tribble.firebaseapp.com",
  databaseURL: "https://expert-tribble.firebaseio.com",
  projectId: "expert-tribble",
  storageBucket: "expert-tribble.appspot.com",
  messagingSenderId: "830210970310",
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
