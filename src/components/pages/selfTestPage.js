import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class SelfTestPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "alertMessage": "",
      "isLoaded": false,
      "hasAutoTune": true,
      "redirectToLogin": false,
      "selfTestRunning": false,
      "selfTestError": "",
      "selfTestLog": [],
      "selfTestLastLogLine": 0,
      "selfTestIsDone": false,
      "hasSelfTest": true
    };

    this.startSelfTest = this.startSelfTest.bind(this);
  }

  componentDidMount() {

    var page=this;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
        var postData = {

        };
        let axiosConfig = {
          headers: {
              'Authorization': 'Bearer ' + token
          }
        };
        axios.post(window.customVars.urlPrefix+window.customVars.apiHasAgeing,postData,axiosConfig)
        .then(res => {
          if (res.data.success === true) {
            page.setState({"isLoaded":true,"hasAutoTune":res.data.hasAutoTune,"hasSelfTest":res.data.hasSelfTest});
          } else {
            if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                deleteStorage("jwt");
                page.setState({"redirectToLogin":true});
            }
          }

          })
          .catch(function (error) {

          });
    }

  }


  handleSubmit(event) {

  }

  componentWillUnmount() {
    if (typeof this.timeOutLogs !== 'undefined')
      clearTimeout(this.timeOutLogs);
  }

  getLogs() {
    var { selfTestLog,selfTestLastLogLine } = this.state;
    var page=this;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
        var params = new URLSearchParams();
        params.append('line', selfTestLastLogLine);
        let axiosConfig = {
          headers: {
              'Authorization': 'Bearer ' + token
          }
        };

        axios.post(window.customVars.urlPrefix+window.customVars.apiSelfTestLogs,params,axiosConfig)
        .then(res => {
          if (res.data.success === true) {
            //Self test Running
            if (res.data.lines instanceof Array) {
              res.data.lines.forEach(function(message)  {
                selfTestLog.push(message);
                selfTestLastLogLine++;


              });
              if (res.data.lines.length>0)
                page.setState({"selfTestLog":selfTestLog,"selfTestLastLogLine":selfTestLastLogLine});
            }
            if (res.data.running) {
              //its Running
              page.timeOutLogs=setTimeout(() => {
                page.getLogs();
              }, 5000);
            } else {
              //done
              page.setState({"selfTestRunning":false,"selfTestIsDone":true,"hasSelfTest":true});
            }
          } else {
            if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                deleteStorage("jwt");
                page.setState({"redirectToLogin":true});
            }

          }

          })
          .catch(function (error) {

          });
    }
  }

  startSelfTest() {
    var { selfTestRunning } = this.state;
    if (!selfTestRunning) {
        var page=this;
        var token=getStorage("jwt");
        if (token===null) {
          this.setState({"redirectToLogin":true});
        } else {
            var postData = {

            };
            let axiosConfig = {
              headers: {
                  'Authorization': 'Bearer ' + token
              }
            };
            page.setState({"selfTestRunning":true,"selfTestError":""});
            axios.post(window.customVars.urlPrefix+window.customVars.apiStartSelfTest,postData,axiosConfig)
            .then(res => {
              if (res.data.success === true) {
                //Self test Running
                page.setState({"selfTestRunning":true,"selfTestLastLogLine":0,"selfTestLog":[]});
                page.getLogs();
              } else {
                if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                    deleteStorage("jwt");
                    page.setState({"redirectToLogin":true});
                } else {
                  page.setState({"selfTestRunning":false});
                  if (res.data.message !== "") {
                    //self Test Already running
                    page.setState({"selfTestError":res.data.message})
                  }
                }

              }

              })
              .catch(function (error) {

              });
        }
    }
  }

  handleInputChange(event) {
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   if (name=="autotune") {
     var formChanged=(this.state.hasAutoTuneDefault!=value);
     this.setState({"hasAutoTune":value,"formChanged":formChanged});
   }
  }

  render() {
    var { alertMessage,isLoaded,hasAutoTune,redirectToLogin,selfTestError,selfTestRunning,selfTestLog,selfTestIsDone,saving,formChanged,saved,hasSelfTest } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="SelfTestPage">

          <h1>Calibrate<br/><small>Performance</small></h1>


          <div className="row">

               {/* Box */}
               <div className="col-md-12 mt-5">
                 <div className="box">
                   <div className="box-header">
                     <h3>Miner Calibration {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                   </div>

                  <div className="box-body p-4">


                         {!hasSelfTest &&
                           <div className="alert alert-warning mt-2 text-center small">
                              Right now you don&#39;t have frequency and voltage settings obtained from self test. We recommend run it to achieve better performance.
                           </div>
                         }


                          <div className="row">
                            <div className="col-md-12">


                             <ul className="small">
                               <li>Running it can take up to 1 hour, and your miner will not work in the pools you have specified.</li>
                               <li>Please, once you have started this process, do not turn off, restart or change the pools of your miner.</li>
                             </ul>

                             {!selfTestRunning &&
                               <p className="h6">Are you sure you want to start calibration now?</p>
                             }

                             {selfTestError != "" &&
                                <div className="alert alert-warning small mt-4">
                                  {selfTestError}
                                </div>
                             }

                             {selfTestLog.length > 0 &&
                               <div>
                                 <h3 className="text-left color-title mt-3">Calibration Results:</h3>
                                 <ul className="text-left ">
                                 {selfTestLog.map((message, index) => (
                                    <li key={index} className="small">{message}</li>
                                 ))}
                                 </ul>
                               </div>
                             }

                             {selfTestIsDone &&
                               <div className="alert alert-success small mt-4">
                                Calibration ran successfully
                               </div>
                             }

                            </div>
                          </div>





                       </div>
                       <div className="box-footer">
                            <button disabled={selfTestRunning} className="btn btn-primary btn-sm" type="button" onClick={this.startSelfTest}>Start Now {selfTestRunning && <div className="btn-loader lds-dual-ring"></div>}</button>
                       </div>
                 </div>
               </div>
               {/* .Box */}


          </div>
          {/* ./row */}

      </div>
    );
  }
}

export default SelfTestPage;
