import * as React from "react";
import "./App.css";
import "./style.css";
import * as firebase from "firebase";

import "./style.css";

interface IState {
  authState: "loading" | "autenticado" | "naoautenticado";

  formEmail: string;
  formPassword: string;

  messages: any;
}

class App extends React.Component {
  state: IState = {
    authState: "loading",
    formEmail: "",
    formPassword: "",
    messages: {}
  };

  componentDidMount() {
    // observa autenticacao
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.setState({ authState: "naoautenticado" });
        console.log("NAOAUTENTICADO");
      } else {
        this.setState({ authState: "autenticado" });
        console.log("AUTENTICADO");
      }
    });

    // observa lista de mensagens
    firebase
      .database()
      .ref("messages")
      .on("value", (messagesSnapshot: any) => {
        this.setState({ messages: messagesSnapshot.val() });
      });
  }

  signIn = (event: any) => {
    event.preventDefault();

    if (!this.state.formEmail) {
      return;
    }
    if (!this.state.formPassword) {
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.formEmail,
        this.state.formPassword
      );
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  onSignInFormFieldChange = (event: any) => {
    console.log(event.target);
    this.setState({ [event.target.name]: event.target.value });
  };

  generateMessage = () => {
    firebase
      .database()
      .ref("messages")
      .push({
        text: "Mensagem gerada automaticamente!",
        random: Math.random() * 9999
      });
  };

  public render() {
    switch (this.state.authState) {
      case "loading":
        return <h1>Loading...</h1>;
      case "autenticado":
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
            <h1>Chat vai ser aqui...</h1>
            <button onClick={this.generateMessage}>Generate message</button>

            <button onClick={this.signOut}>Sign out</button>
          </div>
        );
      default:
        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Expert Tribble</h1>
            </header>
            <form className="Login" onSubmit={this.signIn}>
              <h1>Log in</h1>
              <input
                className="LoginInput"
                name="formEmail"
                value={this.state.formEmail}
                onChange={this.onSignInFormFieldChange}
              />
              <br />
              <input
                className="LoginInput"
                name="formPassword"
                type="password"
                value={this.state.formPassword}
                onChange={this.onSignInFormFieldChange}
              />
              <button type="submit">Sign In</button>
            </form>
          </div>
        );
    }
  }
}

export default App;

/*

cd .\react-project\
npm run build
cd ..
firebase deploy --only hosting

*/
