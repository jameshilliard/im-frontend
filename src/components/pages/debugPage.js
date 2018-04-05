import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'

import {
  Redirect
} from 'react-router-dom';

class Debugpage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "isLoaded":false,
      "boards": [],
      "redirectToLogin":false
    };

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
        axios.post(window.customVars.urlPrefix+window.customVars.apiDebug,postData,axiosConfig)
        .then(res => {
          if (res.data.success&&res.data.boards&&res.data.boards.length>0) {
            page.setState({"isLoaded":true,"boards":res.data.boards});

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

  render() {
    const { isLoaded, redirectToIndex,redirectToLogin,boards } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="Debugpage">

      <h1>Debug<br/><small>Miner Stats</small></h1>

      <div className="row">

          {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
               <div className="box-header">
                 <h3>CgMiner Stats {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
               </div>
                <div className="box-body p-4">
                {boards.map((item, index) => (
                  <div key={index} className="mt-3">
                    <h4>Board {index+1}</h4>

                    <div className="row small">
                        {Object.keys(item.board).map(function(key) {
                          return <div className="col-md-6" key={key}>
                           <b>{key}:</b> {item.board[key]!==false&&item.board[key]}{item.board[key]===false&&"false"}
                         </div>
                        })}
                    </div>

                    <button className="btn btn-primary mt-2" type="button" data-toggle="collapse" data-target={"#collapse"+index} aria-expanded="false" aria-controls={"collapse"+index}>
                           Show Chips
                    </button>
                    <div className="collapse small" id={"collapse"+index}>
                      <div className="card card-body mt-2">
                        <div className="row">
                            {item.chips.map((chip, indexChip) => (
                              <div className="col-md-6" key={indexChip}>
                                <h5>Chip {indexChip+1}</h5>
                                <ul>
                                {Object.keys(chip).map(function(key) {
                                  return <li key={key}>
                                   <b>{key}:</b> {chip[key]!==false&&chip[key]}{chip[key]===false&&"false"}
                                 </li>
                                })}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
                </div>
             </div>
           </div>
           {/* ./ Box  */}
        </div>

      </div>
    );
  }
}

export default Debugpage;
