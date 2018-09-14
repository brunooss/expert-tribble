import * as React from "react";
import "./App.css";
import "./style.css";
import * as firebase from "firebase";

class App extends React.Component {
  public render() {
    firebase
      .database()
      .ref("message")
      .set("Hello");
    return (
      <div className="App">
        <header className="Header">
          <h1 className="Title">Expert tribble</h1>
          <div>
            <i className="material-icons Icon">email</i>
            <i className="material-icons Icon">stay_current_portrait</i>
            <i className="material-icons Icon">chat</i>
          </div>
        </header>
        <form className="Login">
          <h1>Log in</h1>
          <input className="LoginInput" />
          <br />
          <input className="LoginInput" />
        </form>
      </div>
    );
  }
}

export default App;

/*

cd .\react-project\
npm run build
cd ..
firebase deploy --only hosting

*/
