import React, { Component } from 'react';
import axios from 'axios';
import {
  Redirect
} from 'react-router-dom';

import {getStorage,deleteStorage,isUrlValid,generateUrlEncoded} from '../lib/utils'

class Poolspage extends Component {

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      pools: {
        "Password1":"",
        "Password2":"",
        "Password3":"",
        "Pool1":"",
        "Pool2":"",
        "Pool3":"",
        "UserName1":"",
        "UserName2":"",
        "UserName3":""
      },
      fieldsValidation: {
        "Password1":true,
        "Password2":true,
        "Password3":true,
        "Pool1":true,
        "Pool2":true,
        "Pool3":true,
        "UserName1":true,
        "UserName2":true,
        "UserName3":true
      },
      updatingPools: false,
      isLoaded: false,
      showAlert: false,
      redirectToIndex:false,
      type: "",
      poolsUpdated:false,
      errorUpdating:false,
      redirectToLogin:false
    };


  }


  componentDidMount() {
    var { pools,fieldsValidation,isLoaded,showAlert,updatingPools,redirectToIndex } = this.state;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
      var comp=this;
      var strSend = generateUrlEncoded({"jwt":token});
      axios.post(window.customVars.urlPrefix+window.customVars.apiMinerType,strSend)
      .then(res => {
        if (res.data.success === true) {
          comp.setState({
            type: res.data.type
          });

          axios.post(window.customVars.urlPrefix+window.customVars.apiConfigPools,strSend)
          .then(res => {
            if (res.data.success === true) {
              if (res.data.pools) {
                Object.keys(res.data.pools).forEach(function (key) {
                  if (res.data.pools[key]!==null&&(key==="Pool1"||key==="Pool2"||key==="Pool3"||key==="UserName1"||key==="UserName2"||key==="UserName3"||key==="Password1"||key==="Password2"||key==="Password3")) {
                    if (res.data.pools["Pool"+key.charAt(key.length-1)]!="")
                      pools[key]=res.data.pools[key];
                  }
                });
                comp.setState({
                  pools: pools,
                  isLoaded: true
                });
              }
            }
          });
        } else {
          if ((typeof res.data.token !== 'undefined')&&res.data.token!==null&&res.data.token==="expired") {
              deleteStorage("jwt");
              comp.setState({"redirectToLogin":true});
          }
        }
      });
    }

  }

  handleInputChange(event) {
   var { pools,fieldsValidation,isLoaded,showAlert,updatingPools,redirectToIndex } = this.state;

   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   pools[name]=value;
   switch (name) {
     case "Pool1":
       if (value=="") {
         pools["UserName1"]="";
         pools["Password1"]="";
       }
       if (value!==""&&isUrlValid(value)) {
         fieldsValidation["Pool1"]=true;
       } else {
         fieldsValidation["Pool1"]=false;
       }
       if (pools["UserName1"]===""&&pools["Pool1"]!=="") {
         fieldsValidation["UserName1"]=false;
       } else {
         fieldsValidation["UserName1"]=true;
       }
       if (pools["Password1"]===""&&pools["Pool1"]!=="") {
         fieldsValidation["Password1"]=false;
       } else {
         fieldsValidation["Password1"]=true;
       }

       break;
     case "Pool2":
       if (value=="") {
         pools["UserName2"]="";
         pools["Password2"]="";
       }
       if (value===""||isUrlValid(value)) {
         fieldsValidation["Pool2"]=true;
       } else {
         fieldsValidation["Pool2"]=false;
       }
       if (pools["UserName2"]===""&&pools["Pool2"]!=="") {
         fieldsValidation["UserName2"]=false;
       } else {
         fieldsValidation["UserName2"]=true;
       }
       if (pools["Password2"]===""&&pools["Pool2"]!=="") {
         fieldsValidation["Password2"]=false;
       } else {
         fieldsValidation["Password2"]=true;
       }
       break;
     case "Pool3":
       if (value=="") {
         pools["UserName3"]="";
         pools["Password3"]="";
       }
       if (value===""||isUrlValid(value)) {
         fieldsValidation["Pool3"]=true;
       } else {
         fieldsValidation["Pool3"]=false;
       }
       if (pools["UserName3"]===""&&pools["Pool3"]!=="") {
         fieldsValidation["UserName3"]=false;
       } else {
         fieldsValidation["UserName3"]=true;
       }
       if (pools["Password3"]===""&&pools["Pool3"]!=="") {
         fieldsValidation["Password3"]=false;
       } else {
         fieldsValidation["Password3"]=true;
       }
       break;
      case "UserName1":
      if (value==="") {
        fieldsValidation["UserName1"]=false;
      } else {
        fieldsValidation["UserName1"]=true;
      }
      break;
      case "UserName2":
      if (value===""&&pools["Pool2"]!=="") {
        fieldsValidation["UserName2"]=false;
      } else {
        fieldsValidation["UserName2"]=true;
      }
      break;
      case "UserName3":
      if (value===""&&pools["Pool3"]!=="") {
        fieldsValidation["UserName3"]=false;
      } else {
        fieldsValidation["UserName3"]=true;
      }
      break;
      case "Password1":
      if (value==="") {
        fieldsValidation["Password1"]=false;
      } else {
        fieldsValidation["Password1"]=true;
      }
      break;
      case "Password2":
      if (value===""&&pools["Pool2"]!=="") {
        fieldsValidation["Password2"]=false;
      } else {
        fieldsValidation["Password2"]=true;
      }
      break;
      case "Password3":
      if (value===""&&pools["Pool3"]!=="") {
        fieldsValidation["Password3"]=false;
      } else {
        fieldsValidation["Password3"]=true;
      }
      break;
     default:

   }

   this.setState({pools: pools, fieldsValidation:fieldsValidation, showAlert: false, updatingPools: false, isLoaded: true, redirectToIndex: false});
  }

  handleSubmit(event) {



    var { pools,fieldsValidation,isLoaded,showAlert,updatingPools,redirectToIndex } = this.state;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
        if (updatingPools)
          return;
        event.preventDefault();
        var formIsValid=true;
        Object.keys(fieldsValidation).forEach(function(index)  {
          if (!fieldsValidation[index]) {
            formIsValid=false;
            return;
          }
        });

        this.state.showAlert=!formIsValid;


        if (formIsValid) {
          this.setState({updatingPools:true});

          var postData=pools;
          postData.jwt=token;
          var strSend = generateUrlEncoded(postData);

          var comp=this;
          comp.setState({poolsUpdated:true});

          axios.post(window.customVars.urlPrefix+window.customVars.apiUpdatePools, strSend)
          .then(function (response) {
            if(response.data.success === true){
                comp.setState({poolsUpdated:true});
                setTimeout(() => {
                  comp.setState({redirectToIndex:true});
                }, 5000);
            } else if(response.data.success === true) {
              comp.setState({errorUpdating:true,updatingPools:false});
            }
          })
          .catch(function (error) {
            comp.setState({updatingPools:false});
          });
        }
      }
  }


  render() {
    const { pools,fieldsValidation,isLoaded,showAlert,updatingPools,redirectToIndex,type,poolsUpdated,errorUpdating,redirectToLogin } = this.state;
    if (redirectToIndex) {
      return <Redirect to="/?restarting" />;
    }
    if (redirectToLogin) {
      return <Redirect to="/login" />;
    }
    var token=getStorage("jwt");
    var user=getStorage("userName");
    var isAdmin=false;
    if (token!==null&&user!==null) {
      if (user=="admin")
        isAdmin=true;
    }

    var poolsFields=[];
    if (type!="") {
      if (type==16) {
        poolsFields[0]=(
          <select name="Pool1" defaultValue={pools.Pool1} className="form-control form-control-sm" onChange={this.handleInputChange} id="inputURL1">
            <option value="stratum+tcp://dbg.stratum.slushpool.com:3336">stratum+tcp://dbg.stratum.slushpool.com:3336</option>
            <option value="stratum+tcp://dbg.stratum.myrig.com:3333">stratum+tcp://dbg.stratum.myrig.com:3333</option>
          </select>);
          poolsFields[1]=(
            <select name="Pool2" defaultValue={pools.Pool2}  className="form-control form-control-sm" onChange={this.handleInputChange} id="inputURL2">
              <option value="">None</option>
              <option value="stratum+tcp://dbg.stratum.slushpool.com:3336">stratum+tcp://dbg.stratum.slushpool.com:3336</option>
              <option value="stratum+tcp://dbg.stratum.myrig.com:3333">stratum+tcp://dbg.stratum.myrig.com:3333</option>
            </select>);
            poolsFields[2]=(
              <select name="Pool3" defaultValue={pools.Pool3}  className="form-control form-control-sm" onChange={this.handleInputChange} id="inputURL3">
                <option value="">None</option>
                <option value="stratum+tcp://dbg.stratum.slushpool.com:3336">stratum+tcp://dbg.stratum.slushpool.com:3336</option>
                <option value="stratum+tcp://dbg.stratum.myrig.com:3333">stratum+tcp://dbg.stratum.myrig.com:3333</option>
              </select>);
      } else {
          poolsFields[0]=<input type="text" className="form-control form-control-sm"  name="Pool1" value={this.state.pools.Pool1} onChange={this.handleInputChange} id="inputURL1" placeholder="Pool URL" />;
          poolsFields[1]=<input type="text" className="form-control form-control-sm"  name="Pool2" value={this.state.pools.Pool2} onChange={this.handleInputChange} id="inputURL2" placeholder="Pool URL" />;
          poolsFields[2]=<input type="text" className="form-control form-control-sm"  name="Pool3" value={this.state.pools.Pool3} onChange={this.handleInputChange} id="inputURL3" placeholder="Pool URL" />;

      }
    }
    return (
      <div className="Poolspage">

      <h1>Settings<br/><small>Mining Pools</small></h1>

          {poolsUpdated &&
            <div className="alert alert-success mt-5">
              Pools updated successfully! Restarting service, please wait <div className="btn-loader lds-dual-ring pt-1"></div>
            </div>
          }

          {errorUpdating &&
            <div className="alert alert-warning mt-5">
              It was not possible to restart the service, please restart the miner manually
            </div>
          }

          <div className="row">
              {/* Box Pool 1 */}
             <div className="col-md-12 mt-5">
               <div className="box">
                 <div className="box-header">
                   <h3>Pool 1  {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                 </div>
                     {isLoaded &&
                     <div className="box-body p-4">
                        <div className={"form-group " + (!fieldsValidation.Pool1 && "has-error")}>
                          <label htmlFor="inputURL1">URL</label>
                            <div className="input-group mb-2">

                              {/* <input type="text" className="form-control form-control-sm"  name="Pool1" value={this.state.pools.Pool1} onChange={this.handleInputChange} id="inputURL1" placeholder="Pool URL" /> */}
                              {poolsFields[0]}
                            </div>
                        </div>
                        <div className={"form-group " + (!fieldsValidation.UserName1 && "has-error")}>
                          <label htmlFor="inputWorker1">Worker</label>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text"><i className="fa fa-user"></i></div>
                                </div>
                                <input type="text" className="form-control form-control-sm"  name="UserName1" value={this.state.pools.UserName1} onChange={this.handleInputChange} id="inputWorker1" placeholder="Pool Worker" />
                            </div>
                        </div>
                        <div className={"form-group " + (!fieldsValidation.Password1 && "has-error")}>
                          <label htmlFor="inputPassword1">Password</label>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                </div>
                                <input type="text" className="form-control form-control-sm"  name="Password1" value={this.state.pools.Password1} onChange={this.handleInputChange} id="inputPassword1" placeholder="Pool Password" />
                            </div>
                        </div>
                     </div>
                     }
                     {/* ./box-body */}
               </div>
             </div>
             {/* ./ Box Pool 1 */}
          </div>

          <div className="row">
              {/* Box Pool 2 */}
              <div className="col-md-6 mt-5">
                  <div className="box">
                      <div className="box-header">
                          <h3>Pool 2  {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                      </div>
                      {isLoaded &&
                      <div className="box-body p-4">
                          <div className={"form-group " + (!fieldsValidation.Pool2 && "has-error")}>
                              <label htmlFor="inputURL2">URL</label>
                              <div className="input-group mb-2">
                                  {poolsFields[1]}
                              </div>
                          </div>
                          <div className={"form-group " + (!fieldsValidation.UserName2 && "has-error")}>
                              <label htmlFor="inputWorker2">Worker</label>
                              <div className="input-group mb-2">
                                  <div className="input-group-prepend">
                                      <div className="input-group-text"><i className="fa fa-user"></i></div>
                                  </div>
                                  <input type="text" className="form-control form-control-sm"  name="UserName2" value={this.state.pools.UserName2} onChange={this.handleInputChange} id="inputWorker2" placeholder="Pool Worker" />
                              </div>
                          </div>
                          <div className={"form-group " + (!fieldsValidation.Password2 && "has-error")}>
                              <label htmlFor="inputPassword2">Password</label>
                              <div className="input-group mb-2">
                                  <div className="input-group-prepend">
                                      <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                  </div>
                                  <input type="text" className="form-control form-control-sm"  name="Password2" value={this.state.pools.Password2} onChange={this.handleInputChange} id="inputPassword2" placeholder="Pool Password" />
                              </div>
                          </div>
                      </div>
                      }
                      {/* ./box-body */}
                  </div>
              </div>
              {/* ./ Box Pool 2 */}




              {/* Box Pool 3 */}
              <div className="col-md-6 mt-5">
                  <div className="box">
                      <div className="box-header">
                          <h3>Pool 3  {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                      </div>
                      {isLoaded &&
                      <div className="box-body p-4">
                          <div className={"form-group " + (!fieldsValidation.Pool3 && "has-error")}>
                              <label htmlFor="inputURL3">URL</label>
                              <div className="input-group mb-2">
                                  {poolsFields[2]}
                              </div>
                          </div>
                          <div className={"form-group " + (!fieldsValidation.UserName3 && "has-error")}>
                              <label htmlFor="inputWorker3">Worker</label>
                              <div className="input-group mb-2">
                                  <div className="input-group-prepend">
                                      <div className="input-group-text"><i className="fa fa-user"></i></div>
                                  </div>
                                  <input type="text" className="form-control form-control-sm"  name="UserName3" value={this.state.pools.UserName3} onChange={this.handleInputChange} id="inputWorker3" placeholder="Pool Worker" />
                              </div>
                          </div>
                          <div className={"form-group " + (!fieldsValidation.Password3 && "has-error")}>
                              <label htmlFor="inputPassword3">Password</label>
                              <div className="input-group mb-2">
                                  <div className="input-group-prepend">
                                      <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                  </div>
                                  <input type="text" className="form-control form-control-sm"  name="Password3" value={this.state.pools.Password3} onChange={this.handleInputChange} id="inputPassword3" placeholder="Pool Password" />
                              </div>
                          </div>
                      </div>
                      }
                      {/* ./box-body */}
                  </div>
              </div>
              {/* ./ Box Pool 3 */}



          </div>
          {/* ./row */}

          <div className="row mt-5">


              {isAdmin &&
              <div className="col-md-12 text-center">
                    <button ref="btn" disabled={!isLoaded||updatingPools} onClick={this.handleSubmit} className="btn btn-primary">Update Pools {updatingPools && <div className="btn-loader lds-dual-ring"></div>}</button>
                  {showAlert &&
                  <div id="poolsAlert" className="alert alert-warning mt-3">
                      Please check your pools configuration, invalid fields are in red!
                  </div>
                  }
              </div>
              }
          </div>

      </div>
    );
  }
}

export default Poolspage;
