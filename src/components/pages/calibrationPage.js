import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'
import { Redirect } from 'react-router-dom';

class CalibrationPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "alertMessage": "",
      "isLoaded": false,
      "hasAutoTune": true,
      "redirectToLogin": false,
      "selfTestRunning": false,
      "selfTestError": "",
      "selfTestProgress": 0,
      "selfTestIntermediateProgress": 0,
      "selfTestIsDone": false,
      "selfTestPeriod": 0,
      "hasSelfTest": true
    };

    this.startSelfTest = this.startSelfTest.bind(this);
  }

  componentDidMount() {

    this.checkProgress();

  }

  runIntermediateProgress(inital,final) {
    var { selfTestPeriod,selfTestProgress } = this.state;
    console.log("Current "+inital+" goal "+final+" Period "+selfTestPeriod+" selfTestProgress: "+selfTestProgress);

    if (selfTestPeriod>0&&final>0&&final>selfTestProgress) {
      var sleepTime=(selfTestPeriod*1000)/100;
      console.log("Sleep Time "+sleepTime);
      var diff=(final-inital)/100;
      console.log("Diff "+diff+" Progress "+(diff+selfTestProgress));
      var page=this;
      this.setState({"selfTestProgress":parseFloat(parseFloat(selfTestProgress)+diff).toFixed(1)});
      this.timeProgress=setTimeout(() => {
        page.runIntermediateProgress(inital,final);
      }, sleepTime);
    }
  }


  handleSubmit(event) {

  }

  checkProgress() {
    var { selfTestProgress,selfTestRunning } = this.state;
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
        axios.post(window.customVars.urlPrefix+window.customVars.apiSelfTestStatus,postData,axiosConfig)
        .then(res => {
          if (res.data.success === true) {
            page.setState({"isLoaded":true});
            if (res.data.running===true) {

              page.setState({"selfTestRunning":true,"selfTestPeriod":res.data.testPeriod});
              //Self Test is Running
              var progress=0;
              if (res.data.steps>0&&res.data.step>=0) {
                progress=(res.data.step/res.data.steps)*100;
                if (progress!=selfTestProgress||progress==0&&selfTestProgress==0) {
                  selfTestProgress=progress;
                  console.log("P "+progress);
                  page.setState({"selfTestProgress":selfTestProgress});
                }
                if (progress!=100)
                  page.runIntermediateProgress(selfTestProgress,(((res.data.step+1)/res.data.steps)*100)-1);

              }
              page.timeOutLogs=setTimeout(() => {
                page.checkProgress();
              }, 30000);
            } else {

              //Self Test not Running
              if (selfTestRunning) {
                page.setState({"selfTestRunning":false,"selfTestIsDone":true});
              }
            }
            /*
            var progress=0;
            if (res.data.steps>0&&res.data.step>=0) {
              progress=(res.data.step/res.data.steps)*100;
              if (progress==0||(progress>selfTestProgress&&progress!=100)) {
                  page.runIntermediateProgress(selfTestProgress,(((res.data.step+1)/res.data.steps)*100)-1);
              } else if(progress==100) {
                //page.setState({"selfTestProgress":progress,"selfTestRunning":false,"selfTestIsDone":true})
              }
            }

            if (res.data.running === true) {
              page.setState({"isLoaded":true,"selfTestRunning":true,"selfTestPeriod":res.data.testPeriod});
              page.timeOutLogs=setTimeout(() => {
                page.checkProgress();
              }, 30000);
            } else {
              page.setState({"isLoaded":true,"selfTestRunning":false});
            }
            */

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

  componentWillUnmount() {
    if (typeof this.timeOutLogs !== 'undefined')
      clearTimeout(this.timeOutLogs);
  }

  /*getLogs() {
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
  */

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
                page.setState({"selfTestRunning":true});
                page.checkProgress();
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
    var { alertMessage,isLoaded,hasAutoTune,redirectToLogin,selfTestError,selfTestRunning,selfTestLog,selfTestIsDone,saving,formChanged,saved,selfTestProgress } = this.state;

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


                          <div className="row">
                            <div className="col-md-12">


                             <ul className="small">
                               <li>Running it can take up to 1 hour, and your miner will not work in the pools you have specified.</li>
                               <li>Please, once you have started this process, do not turn off, restart or change the pools of your miner.</li>
                             </ul>

                             {selfTestRunning &&
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                    Calibration progress
                                  </div>
                                  <div className="col-md-9">
                                    <div className="progress">
                                       <div className="progress-bar" role="progressbar" style={{width: selfTestProgress + "%"}} aria-valuenow={selfTestProgress} aria-valuemin="0" aria-valuemax="100">{selfTestProgress}%</div>
                                    </div>
                                  </div>
                               </div>
                             }

                             {!selfTestIsDone &&
                               <p className="h6">Are you sure you want to start calibration now?</p>
                             }

                             {selfTestError != "" &&
                                <div className="alert alert-warning small mt-4">
                                  {selfTestError}
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
                       {!selfTestIsDone &&
                       <div className="box-footer">
                            <button disabled={selfTestRunning} className="btn btn-primary btn-sm" type="button" onClick={this.startSelfTest}>Start Now {selfTestRunning && <div className="btn-loader lds-dual-ring"></div>}</button>
                       </div>
                       }
                 </div>
               </div>
               {/* .Box */}


          </div>
          {/* ./row */}

      </div>
    );
  }
}

export default CalibrationPage;
