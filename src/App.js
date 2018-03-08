import React, { Component } from 'react';
import './Assets/css/styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Loginpage from './components/pages/loginPage';
import Wrapper from './components/wrapperComponent/wrapper';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "authenticated": false
    };

  }


  componentWillMount() {
    window.customVars = {
        urlPrefix: "",
        apiDevsPools: "/index.php?/api/summary",
        apiConfigPools: "/index.php?/api/pools",
        apiMinerType: "/index.php?/api/type",
        apiUpdatePools: "/index.php?/api/updatePools",
        apiLogin: "/index.php?/api/auth",
        apiUpdatePassword: "/index.php?/api/updatePassword",
        apiNetwork: "/index.php?/api/network",
        apiUpdateNetwork: "/index.php?/api/updateNetwork",
        apiPing: "/index.php?/api/ping",
        apiReboot: "/index.php?/api/reboot",
        apiOverview: "/index.php?/api/overview"
    };
  }


  componentDidMount() {

  }

  render() {


    return (
      <div className="App">
          <Router>
            <Wrapper/>
          </Router>
      </div>
    );

  }
}

export default App;
