import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded} from '../lib/utils'


class Upgradepage extends Component {

  constructor(props) {
    super(props);

    this.state = {
        fields: {

        },
        "upgrading":false,
        "keepSettings":1,
        "errorMessage":"",
        upgradePercent:0,
        upgradeMessage:"",
        redirectToIndex:false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }


  handleSubmit(event) {
    const { upgrading } = this.state;

    event.preventDefault();
      if (!upgrading) {
        if (this.fileInput.files[0]==null||this.fileInput.files[0].name.split('.').pop()!="bin"||(this.fileInput.files[0].size / Math.pow(1024,2)).toFixed(2) > 100) {
          this.setState({errorMessage:"Please insert a valid firmware file."})
        } else {
          this.setState({upgrading:true,errorMessage:""})

          var fd = new FormData();
          var comp=this;
          fd.append("keepsettings", this.state.keepSettings);
          fd.append("upfile", this.fileInput.files[0]);
          axios.post(window.customVars.urlPrefix+'/../cgi-bin/upload.py', fd)
          .then(function (response) {

          })
          .catch(function (error) {

          });
          comp.getPercentProccess();

        }
      }

  }

  getPercentProccess() {
      var comp=this;
      axios.post(window.customVars.urlPrefix+'/../cgi-bin/show.py')
      .then(function (response) {
        comp.setState({"upgradePercent":response.data.percent,"upgradeMessage":response.data.text});
        setTimeout(() => {
          comp.getPercentProccess();
        }, 2000);
      })
      .catch(function (error) {
        setTimeout(() => {
          comp.getPercentProccess();
        }, 2000);
      });

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
    const { upgrading,errorMessage,keepSettings,upgradePercent,upgradeMessage } = this.state;

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


                       <ol className="text-normal">
                       <li>The update.bin file should be obtained from the support center</li>
                       <li>Check the "Keep User Settings" option if you want to retain your configuration.</li>
                       <li>Do not power off or refresh this page during the upgrade process.</li>
                       <li>After the upgrade process is completed, the system will reboot automatically, if not please reboot it manually.</li>

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
                       <div className="alert alert-warning">
                         {errorMessage}
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
                   <div className="box-footer">
                       <button disabled={upgrading} className="btn btn-primary" onClick={this.handleSubmit}>Upgrade Now {upgrading && <div className="btn-loader lds-dual-ring"></div>}</button>
                   </div>

             </div>
           </div>
           {/* ./ Box  */}
        </div>
      </div>
    );
  }
}

export default Upgradepage;
