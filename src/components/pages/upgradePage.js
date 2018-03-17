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
        "upgrading":false,
        "keepSettings":1,
        "errorMessage":"",
        upgraded:false,
        upgradePercent:0,
        upgradeMessage:"",
        redirectToIndex:false,
        redirectToLogin:false,
        errorLog:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }


  handleSubmit(event) {
    const { upgrading } = this.state;

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
                if (percentCompleted==100) {
                  comp.setState({upgradeMessage:"Upgrading Firmware"});

                  setTimeout(() => {
                    comp.setState({upgradePercent:0});
                    setTimeout(() => {
                      comp.setState({upgradePercent:50});
                    }, 2000);
                  }, 1000);
                }
              },
              headers: {
                  'Authorization': 'Bearer ' + token,
                  'X_FILENAME': this.fileInput.files[0].name
              }
            }
            this.setState({upgrading:true,errorMessage:"",upgradeMessage:"Uploading Firmware"});
            var fd = new FormData();

            fd.append("keepsettings", this.state.keepSettings);
            fd.append("upfile", this.fileInput.files[0]);

            axios.post(window.customVars.urlPrefix+window.customVars.apiUpgrade, fd, config)
            .then(function (res) {
                if (res.data.success === true) {

                  comp.setState({upgradePercent:100});
                  comp.setState({upgrading:false,errorMessage:"",upgraded:true});


                } else {

                  comp.setState({upgradePercent:100});
                  if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
                      deleteStorage("jwt");
                      comp.setState({"redirectToLogin":true});
                  } else if (typeof res.data.output !== 'undefined'){
                      comp.setState({upgrading:false,errorMessage:"Error upgrading the firmware",upgraded:false,errorLog:res.data.output})
                  }

                }
            })
            .catch(function (error) {

            });

            /*
            var comp=this;
            var xhr = new XMLHttpRequest();
        		if (xhr.upload) {


        			// progress bar
        			xhr.upload.addEventListener("progress", function(e) {
        				var pc = parseInt(100 - (e.loaded / e.total * 100));
        				comp.setState({upgradePercent:pc});
        			}, false);

        			// file received/failed
        			xhr.onreadystatechange = function(e) {
        				comp.poll(1000);
        				if (xhr.readyState == 4) {
        					if (xhr.status != 200) {

                    comp.setState({upgrading:false,errorMessage:"Error uploading the file"});
        						return;
        					}
                  comp.setState({upgrading:false,errorMessage:"",upgradeMessage:"2. Upgrading Firmware"});
        				}
        			};

        			// start upload
              this.setState({upgrading:true,errorMessage:"",upgradeMessage:"1. Uploading Firmware"});

        			xhr.open("POST", window.customVars.urlPrefix+window.customVars.apiUpgrade, true);
              xhr.setRequestHeader("Authorization", 'Bearer ' +  token);
        			xhr.setRequestHeader("X_FILENAME", this.fileInput.files[0].name);
        			xhr.send(this.fileInput.files[0]);

        		}


            */
          }


        }
      }

  }

  getProgress() {
      var comp=this;
      var status;
  		var listempty;
  		var msg ="";
  		var lasterror = 0;
      axios.post(window.customVars.urlPrefix+window.customVars.apiUpgradeProgress)
      .then(function (response) {
        response.data.forEach(function(key,val)  {
          console.log(val);
          comp.poll(1000);
          /*
          if (key == "Status")
					status = val;
  				if (key == "Msg" && val != "" )
  					msg = val;
  				if (key == "Error")
  					lasterror = val;

            if (msg) {
      				if (lasterror == 0)
      					Output("<p>" + msg + "</p>");
      				else
      					Output("<p><strong>" + msg + "</strong></p>");
      			}
            */
        });
      })
      .catch(function (error) {

      });

    }

  poll(timer){
    var comp=this;
		setTimeout(function(){
			comp.getProgress();
		}, timer);
	}

  handleInputChange(event) {
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   if (name==="keepSettings") {
     this.setState({"keepSettings":(value?1:0)});
   }
  }

  render() {
    const { upgrading,errorMessage,keepSettings,upgradePercent,upgradeMessage,upgraded,redirectToLogin,upgradePhase,errrorLog } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login" />;
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
                           <ol className="text-normal">
                           <li>The update.swu file should be obtained from our support center</li>
                           <li>Check the "Keep User Settings" option if you want to retain your configuration.</li>
                           <li>Do not power off or refresh this page during the upgrade process.</li>
                           <li>After the upgrade process is completed, the system will reboot automatically.</li>

                           </ol>

                           {!upgrading &&
                           <div>

                             <div className="form-group row">
                                 <label htmlFor="inputKeepSettings" className="col-sm-3 col-form-label">Keep User Settings</label>
                                 <div className="col-sm-9">
                                     <input name="keepSettings" onChange={this.handleInputChange} type="checkbox" checked={keepSettings=="1"} id="inputKeepSettings" /> &nbsp;&nbsp;
                                     <small>Please check this box if you want to preserve all you configurations after the upgrade process.</small>
                                 </div>
                             </div>
                             <div className="form-group row">
                                 <label htmlFor="inputImage" className="col-sm-3 col-form-label">Image</label>
                                 <div className="col-sm-9">
                                     <input ref={input => {this.fileInput = input;}} type="file" className="form-control-sm" id="inputImage" placeholder="Upload Firmware" />
                                 </div>
                             </div>
                           </div>
                           }

                           {errorMessage!=="" &&
                           <div className="alert alert-warning small">
                            <ul>
                             <h4 class="alert-heading">{errorMessage}</h4>
                             {this.state.errorLog.map((message, index) => (
                                <li>{message}</li>
                             ))}
                             </ul>
                           </div>
                           }

                           {upgrading &&
                             <div>
                               <h3>Upgrade process</h3>
                               <div className="progress">
                                  <div className="progress-bar" role="progressbar" style={{width: upgradePercent + "%"}} aria-valuenow={upgradePercent} aria-valuemin="0" aria-valuemax="100">{upgradePercent}%</div>

                               </div>
                               <small>{upgradeMessage}</small>
                             </div>
                           }
                        </div>
                        }
                        {upgraded &&
                        <div>
                          <div className="alert alert-success">
                            Firmware updated successfully, rebooting...
                          </div>

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
