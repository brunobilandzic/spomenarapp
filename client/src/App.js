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
import UserProfile from "./components/User/Others/UserProfile";
import ExploreUsers from "./components/User/Friends/ExploreUsers";
import ProtectedRoute from "./routes/ProtectedRoute";
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
            <Route exact path="/dictionary/:dictId">
              <Dictionary />
            </Route>
            <Route exact path="/">
              <h4 className="main-hedaer">All dictionaries</h4>
              <DictionariesWrap />
            </Route>
            <Route exact path="/verify/:username/:id">
              <EmailConfirm />
            </Route>
            <Route exact path="/forgotpassword">
              <PasswordForgot />
            </Route>
            <Route exact path="/resetpassword/:username/:hash">
              <ResetPasswordCheck />
            </Route>
            <ProtectedRoute path="/changepassword" component={PasswordChange} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/friends" component={Friends} />
            <ProtectedRoute path="/settings" component={Settings} />
            <ProtectedRoute path="/explore" component={ExploreUsers} />
            <ProtectedRoute path="/new" component={CreateDictionary} />
            <ProtectedRoute
              path="/user/dictionaries"
              component={DictionariesWrap}
              props={{ author: true }}
            />
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/friends">
              <Friends />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/explore">
              <ExploreUsers />
            </Route>
            <Route exact path="/:username">
              <UserProfile />
            </Route>
          </Switch>
        </Container>
      </div>
    </Provider>
  );
}

export default App;
