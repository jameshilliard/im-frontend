import React, { Component } from 'react';
import axios from 'axios';
import {generateUrlEncoded,getStorage,deleteStorage} from '../lib/utils'
import { Redirect, Link } from 'react-router-dom';
import 'react-rangeslider/lib/index.css'
import Slider from 'react-rangeslider'

class Profilepage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "alertMessage": "",
      "isLoaded": false,
      "sliderValue": 1,
      "redirectToLogin": false,
      "saving": false,
      "formChanged": false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
        axios.post(window.customVars.urlPrefix+window.customVars.apiGetAutoTune,postData,axiosConfig)
        .then(res => {
          if (res.data.success === true) {
            var sliderValue;
            if (res.data.autoTuneMode=="off") {
              sliderValue=-1;
            } else if(res.data.autoTuneMode=="efficient") {
              sliderValue=1;
            } else if (res.data.autoTuneMode=="default") {
              sliderValue=0;
            }
            page.setState({"isLoaded":true,"sliderValue":sliderValue,"sliderValueSetted":sliderValue});
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
    var { sliderValue } = this.state;
    event.preventDefault();
    var token=getStorage("jwt");
    var page=this;
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
      var mode="off";
      if (sliderValue===0) {
        mode="default";
      } else if (sliderValue===1) {
        mode="efficient";
      }



      var params = new URLSearchParams();
      params.append('autotune', mode);
      let axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
      };
      this.setState({"saving":true});
      axios.post(window.customVars.urlPrefix+window.customVars.apiSetAutoTune,params,axiosConfig)
      .then(res => {
        if (res.data.success === true) {
          this.setState({"saving":false,"saved":true,"sliderValueSetted":sliderValue,"formChanged":false});
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


  handleChange = (value) => {
    this.setState({
      sliderValue: value,
      formChanged: (value!=this.state.sliderValueSetted)
    })
  }

  render() {
    var { alertMessage,isLoaded,sliderValue,redirectToLogin,saving,formChanged,saved } = this.state;




    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    const horizontalLabels = {
      "-1": 'Off',
      "0": 'Default',
      "1": 'Efficiency'
    }




    return (
      <div className="Profilepage">

      <h1>Miner Profile<br/><small>Performance</small></h1>


      <div className="row">

          {/* Box */}
         <div className="col-md-12 mt-5">
           <div className="box">
             <div className="box-header">
               <h3>Profiles {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
             </div>


                 <div className="box-body p-4">
                 {saved &&
                     <div className="alert alert-success">
                       Profile configuration updated.
                     </div>
                 }

                   <div className="row">
                      <div className="col-md-12 text-center">
                        <p className="small text-left">There are 3 Auto Tune modes</p>
                        <ol className="small text-left">
                          <li><strong>Off</strong> the miner will work with the factory default values</li>
                          <li><strong>Default</strong> the miner will dynamically search the voltage and frequency values to achieve the highest hash rate</li>
                          <li><strong>Efficiency</strong> the miner will use less power but the hash rate will be lower</li>
                        </ol>

                        <h3 className="color-title">Auto Tune Mode: </h3>

                        <Slider
                          min={-1}
                          max={1}
                          value={0}
                          tooltip={false}
                          value={sliderValue}
                          onChange={this.handleChange}
                          labels={horizontalLabels}
                          className="mr-5 ml-5"
                        />


                      </div>
                    </div>


                 </div>
                 <div className="box-footer">
                      <button disabled={!formChanged||saving} className="btn btn-primary" onClick={this.handleSubmit}>Save {saving && <div className="btn-loader lds-dual-ring"></div>}</button>
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

export default Profilepage;
