import { Container } from "reactstrap";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import store from "./store";
import AppNavbar from "./components/AppNavbar";
import CreateDictionary from "./components/CreateDictionary/CreateDictionary";
import DictionariesWrap from "./components/Dictionaries/DictionariesWrap";
import Dictionary from "./components/Dictionary/Dictionary";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style/spacing.css";
import EmailConfirm from "./components/Modals/EmailConfirm";

function App() {
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
            <Route exact path="/verify/:username/:hash">
              <EmailConfirm />
            </Route>
          </Switch>
        </Container>
      </div>
    </Provider>
  );
}

export default App;
