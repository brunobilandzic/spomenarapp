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
import PasswordChange from "./components/User/Settings/Password/PasswordChange";
import PasswordForgot from "./components/User/Settings/Password/PasswordForgot";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style/spacing.css";
import "./style/graphic.css";
import EmailConfirm from "./components/Modals/EmailConfirm";
import ResetPasswordCheck from "./components/User/Settings/Password/ResetPasswordCheck";
import Profile from "./components/User/Profile";
import Settings from "./components/User/Settings/Settings";
import Friends from "./components/User/Friends/Friends";

function App() {
  useEffect(() => {
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
            <Route exact path="/forgotpassword">
              <PasswordForgot />
            </Route>
            <Route exact path="/resetpassword/:username/:hash">
              <ResetPasswordCheck />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/friends">
              <Friends />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
          </Switch>
        </Container>
      </div>
    </Provider>
  );
}

export default App;
