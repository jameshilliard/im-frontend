import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'

import {
  Redirect
} from 'react-router-dom';

class Rebootpage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "rebooting":false,
      "redirectToIndex":false,
      "redirectToLogin":false
    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleSubmit(event) {
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
      this.setState({"rebooting":true});
      event.preventDefault();
      var strSend = generateUrlEncoded({"jwt":token});
      axios.post(window.customVars.urlPrefix+window.customVars.apiReboot,strSend)
      .then(res => {
          if (res.data.success==false&&(typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
              deleteStorage("jwt");
              this.setState({"redirectToLogin":true});
          }
      })
      .catch(function (error) {

      });
      var comp=this;
      setTimeout(() => {
        comp.setState({"redirectToIndex":true});
      }, 4000);
    }

  }

  render() {
    const { rebooting, redirectToIndex,redirectToLogin } = this.state;
    if (redirectToIndex) {
      return <Redirect to="/?rebooting" />;
    }
    if (redirectToLogin) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="Rebootpage">

      <h1>Maintenance<br/><small>Reboot</small></h1>

      <div className="row">

          {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>Reboot Miner</h3>
               </div>
                   <div className="box-body p-4">

                       <div className="alert alert-info">
                           This web interface will became unavailable after your press the Reboot button. Please wait until the reboot cycle complete.
                       </div>

                   </div>
                 <div className="box-footer">
                     <button disabled={rebooting} className="btn btn-primary" onClick={this.handleSubmit}>Reboot Now {rebooting && <div className="btn-loader lds-dual-ring"></div>}</button>
                 </div>

             </div>
           </div>
           {/* ./ Box  */}
        </div>

      </div>
    );
  }
}

export default Rebootpage;
