import * as React from "react";
import "./App.css";
import "./style.css";
import * as firebase from "firebase";

import "./style.css";

interface Message {
  text: string;
  time: number;
  email: string | null;
}

interface IState {
  authState: "loading" | "autenticado" | "naoautenticado";

  authFormTab: "cadastro" | "login";

  formEmail: string;
  formPassword: string;

  messageText: string;
  messages: Message[];
}

class App extends React.Component<{}, IState> {
  state: IState = {
    authState: "loading",
    authFormTab: "login",
    formEmail: "",
    formPassword: "",
    messageText: "",
    messages: []
  };

  componentDidMount() {
    // observa autenticacao
    firebase.auth().onAuthStateChanged(user => {
      if (this.state.authFormTab === 'cadastro') {
        return;
      }

      if (user) {
        this.setState({ authState: "autenticado" });
      } else {
        this.setState({ authState: "naoautenticado" });
      }
    });

    // observa lista de mensagens
    firebase
      .database()
      .ref("messages")
      .on("value", messagesSnapshot => {
        if (!messagesSnapshot) return;

        const messagesData = messagesSnapshot.val();
        console.log({ messagesData });

        // trecho para estudo
        // objetivo: transformar um objeto de dados do firebase em uma matriz
        const newMessages: Message[] = [];

        // 1 forma
        const messageIds = Object.keys(messagesData);
        messageIds.forEach(id => {
          newMessages.push(messagesData[id]);
        });

        // 2 forma
        // for (const message of messagesData) {
        //   newMessages.push(message);
        // }

        // fim do trecho

        this.setState({ messages: newMessages });
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

  signUp = async (event: any) => {
    event.preventDefault();

    if (!this.state.formEmail) {
      return;
    }
    if (!this.state.formPassword) {
      return;
    }

    await firebase.auth()
      .createUserWithEmailAndPassword(
        this.state.formEmail,
        this.state.formPassword
      );
    await firebase.auth().signOut();
    this.onToggleAuthFormTab();
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  onChangeSignInFormField = (event: any) => {
    const fieldName: "formEmail" | "formPassword" = event.target.name;
    const fieldValue: string = event.target.value;

    switch (fieldName) {
      case "formEmail":
        return this.setState({ formEmail: fieldValue });
      case "formPassword":
        return this.setState({ formPassword: fieldValue });
    }
  };

  onChangeMessageField = (event: any): void => {
    const messageText = event.target.value;
    this.setState({ messageText });
  };

  onKeyPressMessageField = (event: any): void => {
    // check if enter has been pressed
    if (event.charCode === 13) {
      this.sendMessage();
    }
  };

  onToggleAuthFormTab = (e?: any) => {
    this.setState((state) => ({
      authFormTab: state.authFormTab === 'login' ? 'cadastro' : 'login',
      formEmail: "",
      formPassword: "",
    }));
    if (e) {
      e.preventDefault();
    }
  };

  sendMessage = async () => {
    const messageText = this.state.messageText;
    const user = firebase.auth().currentUser;

    if (messageText === "" || !user) return;

    this.setState({ messageText: "" });

    const message: Message = {
      text: messageText,
      email: user.email,
      time: Date.now()
    };

    await firebase
      .database()
      .ref("messages")
      .push(message);

    console.log("Mensagem criada!");
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
            <h1>Chat vai ser aqui ...</h1>
            <button onClick={this.signOut}>Sign out</button>
            <div id="msg">
              <input
                type="text"
                placeholder="Digite sua mensagem aqui..."
                value={this.state.messageText}
                onChange={this.onChangeMessageField}
                onKeyPress={this.onKeyPressMessageField}
              />
              <ul>
                {this.state.messages.map((message, index) => (
                  <h4 key={index} style={{ textAlign: "left" }}>
                    <span style={{ color: "#FF4500" }}>{message.time}</span>{" "}
                    <span style={{ color: "#FF4500" }}>{message.email}</span>
                    {": "}
                    {message.text}
                  </h4>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="App">
            <header className="Header">
              <h1 className="Title">Welcome to Expert Tribble</h1>
              <h3 className="Subtitle">The developers chat</h3>
            </header>
            {(this.state.authFormTab === 'cadastro') ? (
              // FORMULARIO DE CADASTRO
              <form className="Login" onSubmit={this.signUp}>
                <h1>Sign Up</h1>
                <input
                  className="LoginInput"
                  name="formEmail"
                  value={this.state.formEmail}
                  onChange={this.onChangeSignInFormField}
                />
                <br />
                <input
                  className="LoginInput"
                  name="formPassword"
                  type="password"
                  value={this.state.formPassword}
                  onChange={this.onChangeSignInFormField}
                />
                <br />
                <button type="submit">Sign Up</button>
                <br />
                <span>I already has an account! Let's</span>{" "}
                <a href="" onClick={this.onToggleAuthFormTab}>
                  login
                </a>
              </form>
            ) : (
              // FORMULARIO DE LOGIN
              <form className="Login" onSubmit={this.signIn}>
                <h1>Log in</h1>
                <input
                  className="LoginInput"
                  name="formEmail"
                  value={this.state.formEmail}
                  onChange={this.onChangeSignInFormField}
                />
                <br />
                <input
                  className="LoginInput"
                  name="formPassword"
                  type="password"
                  value={this.state.formPassword}
                  onChange={this.onChangeSignInFormField}
                />
                <br />
                <button type="submit">Log In</button>
                <br />
                <span>Don't have an account? Sign up</span>{" "}
                <a href="" onClick={this.onToggleAuthFormTab}>
                  here
                </a>
              </form>
          )}
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
