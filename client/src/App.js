import { Container } from "reactstrap";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import store from "./store";
import { loadUser } from "./actions/authActions";
import AppNavbar from "./components/AppNavbar";
import CreateDictionary from "./components/CreateDictionary/CreateDictionary";
import DictionariesWrap from "./components/Dictionaries/DictionariesWrap";
import Dictionary from "./components/Dictionary/Dictionary";
import PasswordChange from "./components/User/Settings/PasswordChange";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style/spacing.css";
import EmailConfirm from "./components/Modals/EmailConfirm";

function App() {
  useEffect(() => {
    console.log("Loading user...");
    store.dispatch(loadUser());
  });
  return (
    <Provider store={store}>
      <div className="App">
        <AppNavbar></AppNavbar>
        <Container>
          <Switch>
            <Route exact path="/new">
              <CreateDictionary />
            </Route>
            <Route exact path="/dictionary/:dictId">
              <Dictionary />
            </Route>
            <Route exact path="/">
              <DictionariesWrap />
            </Route>
            <Route exact path="/verify/:username/:id">
              <EmailConfirm />
            </Route>
            <Route exact path="/changepassword">
              <PasswordChange />
            </Route>
          </Switch>
        </Container>
      </div>
    </Provider>
  );
}

export default App;
