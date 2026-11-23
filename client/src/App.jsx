import { Container } from "reactstrap";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import store from "./store";
import { loadUser } from "./actions/authActions";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style/spacing.scss";
import "./style/graphic.scss";
import AppNavbar from "./components/AppNavbar";
import CreateDictionary from "./components/CreateDictionary/CreateDictionary";
import DictionariesWrap from "./components/Dictionaries/DictionariesWrap";
import Dictionary from "./components/Dictionary/Dictionary";
import PasswordChange from "./components/User/Settings/Password/PasswordChange";
import PasswordForgot from "./components/User/Settings/Password/PasswordForgot";

import EmailConfirm from "./components/Modals/EmailConfirm";
import ResetPasswordCheck from "./components/User/Settings/Password/ResetPasswordCheck";
import Profile from "./components/User/Profile";
import Settings from "./components/User/Settings/Settings";
import Friends from "./components/User/Friends/Friends";
import UserProfile from "./components/User/Others/UserProfile";
import ExploreUsers from "./components/User/Friends/ExploreUsers";
import ProtectedRoute from "./routes/ProtectedRoute";
import GoVerify from "./components/Modals/GoVerify";
import DeleteProfile from "./components/User/Settings/DeleteProfile";
function App() {
  useEffect(() => {
    if (!import.meta.env.STATIC_DEMO) store.dispatch(loadUser());
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
              <DictionariesWrap />
              {import.meta.env.STATIC_DEMO && (
                <section className="col-md-8 mx-auto mt-4 mb-5 pt-3 border-top text-left" aria-labelledby="about-demo">
                  <h2 id="about-demo" className="h5">About this demo</h2>
                  <p>
                    Spomenar is a digital memory book where friends can make
                    questionnaires and share answers. This static preview opens
                    without an account so you can try it right away. Your
                    practice spomenars and answers stay in this browser.
                  </p>
                  <p>
                    I built Spomenar as my final thesis project and earned a
                    grade of 5/5. The full-stack version uses React, an Express
                    API and MongoDB Atlas. It implements registration, login, email
                    verification and password reset.
                  </p>
                  <p className="small text-muted mb-0">
                    OpenAI Codex assisted with preparing this public demo.
                    The sample answers are fictional.
                  </p>
                </section>
              )}
            </Route>
            {import.meta.env.DEMO_MODE && (
              <Route exact path="/try-create">
                <CreateDictionary practice />
              </Route>
            )}
            {import.meta.env.STATIC_DEMO && <Redirect to="/" />}
            <Route exact path="/verify/:username/:id">
              <EmailConfirm />
            </Route>
            <Route exact path="/forgotpassword">
              {import.meta.env.DEMO_MODE ? <Redirect to="/" /> : <PasswordForgot />}
            </Route>
            <Route exact path="/goverify/:userId">
              {import.meta.env.DEMO_MODE ? <Redirect to="/" /> : <GoVerify />}
            </Route>
            <Route exact path="/resetpassword/:username/:hash">
              {import.meta.env.DEMO_MODE ? <Redirect to="/" /> : <ResetPasswordCheck />}
            </Route>
            <ProtectedRoute path="/changepassword" component={PasswordChange} />
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/friends" component={Friends} />
            <ProtectedRoute path="/settings" component={Settings} />
            <ProtectedRoute path="/explore" component={ExploreUsers} />
            <ProtectedRoute path="/new" component={CreateDictionary} />
            <ProtectedRoute path="/delete" component={DeleteProfile} />
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
