import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import {generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'


class Upgradepage extends Component {

  constructor(props) {
    super(props);

    this.state = {
        fields: {

        },
        upgrading:false,
        upgraded:false,
        upgradePercent:0,
        rebooting:false,
        redirectToIndex:false,
        redirectToLogin:false,
        errorMessage: "",
        upgradeMessages:[],
        upgradeStatus:"",
        upgradeStep:"",
        upgradeStepCount:"",
        upgradeDidRun: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reboot = this.reboot.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
        axios.post(window.customVars.urlPrefix+window.customVars.apiPing,postData,axiosConfig)
        .then(res => {
          if (!res.data.success) {
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


  updateStatus(status) {
    this.setState({upgradeStatus:status});
    switch (status) {
      case 'START':
        this.setState({"upgradePercent":0});
        break
      case 'RUN':
        break
      case 'SUCCESS':
        this.setState({"upgraded":true,"upgrading":false});
        break
      case 'FAILURE':
        this.setState({"upgrading":false});
        break
      default:
        break
    }
  }

  handleSubmit(event) {
    var { upgrading, upgradeMessages,upgradeStatus } = this.state;

    event.preventDefault();
      if (!upgrading) {
        if (this.fileInput.files[0]==null||this.fileInput.files[0].name.split('.').pop()!="swu"||(this.fileInput.files[0].size / Math.pow(1024,2)).toFixed(2) > 100) {
          this.setState({errorMessage:"Please insert a valid firmware file."})
        } else {

          var token=getStorage("jwt");
          if (token===null) {
            this.setState({"redirectToLogin":true});
          } else {

            var comp=this;
            const config = {
              onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                comp.setState({upgradePercent:percentCompleted});
              },
              headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'multipart/form-data'
              }
            }

            comp.setState({"upgradeStatus":"IDLE","upgradeStep":"Uploading","upgradeMessages":[],"upgradeDidRun":true});
            var ws = new WebSocket('ws://' + window.location.host + window.location.pathname.replace(/\/[^\/]*$/, '') + window.customVars.apiUpgradeProgress)
            upgradeMessages=[];

            ws.onmessage = function (event) {
              var msg = JSON.parse(event.data)

              switch (msg.type) {
                case 'message':
                  upgradeMessages.push({"level":msg.level,"text":msg.text})
                  comp.setState({"upgradeMessages":upgradeMessages});
                  break
                case 'status':
                  comp.updateStatus(msg.status);


                  break
                case 'source':
                  break
                case 'step':
                  var percent = Math.round((100 * (Number(msg.step) - 1) + Number(msg.percent)) / Number(msg.number))
                  //var value = percent + '%' + ' (' + msg.step + ' of ' + msg.number + ')'
                  var upgradeStepCount=msg.step + ' of ' + msg.number;
                  comp.setState({"upgradeStep":msg.name,"upgradeStepCount":upgradeStepCount,"upgradePercent":percent});
                  break
              }
            }

            this.setState({upgrading:true,errorMessage:""});
            var fd = new FormData();


            //fd.append("keepsettings", this.state.keepSettings);
            fd.append("upfile", this.fileInput.files[0]);

            axios.post(window.customVars.urlPrefix+window.customVars.apiUpgrade, fd, config)
            .then(function (res) {
                if (res.data.success === true) {

                }
            })
            .catch(function (error) {


                if (error.response&&error.response.status == 401) {
                  deleteStorage("jwt");
                  comp.setState({"redirectToLogin":true});
                }

            });


          }


        }
      }

  }

  reboot(event) {
    event.preventDefault();
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
      this.setState({"rebooting":true});

      var postData = {

      };
      let axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
      };
      axios.post(window.customVars.urlPrefix+window.customVars.apiReboot,postData,axiosConfig)
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


  handleInputChange(event) {
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;

  }

  render() {
    const { upgrading,errorMessage,keepSettings,upgradePercent,upgraded,redirectToIndex,redirectToLogin,upgradeStatus,upgradeMessages,upgradeStep,upgradeStepCount,upgradeDidRun,rebooting } = this.state;

    if (redirectToIndex) {
      return <Redirect to="/?rebooting" />;
    }


    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }
    return (
      <div className="Upgradepage">

      <h1>Maintenance<br/><small>Firmware</small></h1>

        <div className="row">

            {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>Upgrade</h3>
               </div>
                   <div className="box-body p-4">

                       {!upgraded &&
                       <div>
                           <ol className="small">
                           <li>The update.swu file should be obtained from our support center</li>
                           <li>Do not power off or refresh this page during the upgrade process</li>
                           <li>All your settings will be preserved</li>
                           </ol>



                             <div className="form-group row">
                                 <div className="col-md-12 text-center">
                                     <input ref={input => {this.fileInput = input;}} type="file" className="form-control-sm" id="inputImage" placeholder="Upload Firmware" />
                                 </div>
                             </div>

                             {errorMessage!="" &&
                               <div className="alert alert-warning small">
                                {errorMessage}
                               </div>
                              }
                           </div>
                           }

                          {upgradeDidRun &&
                            <div>

                               <h5 className="mt-4">Upgrade process</h5>
                               <div className="row mt-2">
                                  <div class="col-md-3 field-title">
                                    Status
                                  </div>
                                  <div className="col-md-9 field-value">
                                    <span className={upgradeStatus=="FAILURE" &&"text-warning"}>{upgradeStatus}</span>
                                  </div>
                               </div>
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                    Progress
                                  </div>
                                  <div className="col-md-9">
                                    <div className="progress">
                                       <div className="progress-bar" role="progressbar" style={{width: upgradePercent + "%"}} aria-valuenow={upgradePercent} aria-valuemin="0" aria-valuemax="100">{upgradePercent}%</div>
                                    </div>
                                  </div>
                               </div>
                               <div className="row mt-2">
                                  <div className="col-md-3 field-title">
                                    Step
                                  </div>
                                  <div className="col-md-9 field-value">
                                    {upgradeStep} <i>{upgradeStepCount}</i>
                                  </div>
                               </div>

                               <p className="text-center mt-3">
                                <button class="btn btn-secondary btn-sm" type="button" data-toggle="collapse" data-target="#collapseDetails" aria-expanded="false" aria-controls="collapseDetails">
                                  View details
                                </button>
                               </p>

                              <div class="collapse" id="collapseDetails">
                                <div class="card card-body">
                                  <ul className="small">
                                  {this.state.upgradeMessages.map((message, index) => (
                                     <li className={message.level<=3 &&"text-warning"}>{message.text}</li>
                                  ))}
                                  </ul>
                                </div>
                              </div>

                              {upgraded &&
                              <div className="alert alert-success small mt-4">
                                The firmware has been upgraded, rebooting the miner...
                              </div>
                              }

                           </div>
                          }

                   </div>


                   {!upgraded &&
                   <div className="box-footer">
                       <button disabled={upgrading} className="btn btn-primary" onClick={this.handleSubmit}>Upgrade Now {upgrading && <div className="btn-loader lds-dual-ring"></div>}</button>
                   </div>
                   }

             </div>
           </div>
           {/* ./ Box  */}
        </div>
      </div>
    );
  }
}

export default Upgradepage;
