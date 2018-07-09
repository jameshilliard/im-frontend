import React, { Component } from 'react';
import axios from 'axios';
import {getStorage,setStorage,deleteStorage,generateUrlEncoded} from '../lib/utils'
import chunkedRequest from 'chunked-request';
import ReactDOM from 'react-dom';
import {
  Redirect
} from 'react-router-dom';

class Logspage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "isLoaded":false,
      "redirectToLogin":false,
      "logLines":[],
      "MinerlogLines":[]
    };

  }



  componentDidMount() {
    var page=this;
    var token=getStorage("jwt");
    if (token===null) {
      this.setState({"redirectToLogin":true});
    } else {
    const { isLoaded, redirectToLogin,logLines,MinerlogLines } = this.state;
    var comp=this;
    function hasSuffix(s, suffix) {
      return s.substr(s.length - suffix.length) === suffix;
    }
    chunkedRequest({
       url: window.customVars.urlPrefix+window.customVars.apiStreamLogs,
       method: 'GET',
       headers: {'Authorization': 'Bearer ' + token},
       chunkParser(bytes, state = {}, flush = false) {
          if (!state.textDecoder) {
            state.textDecoder = new TextDecoder();
          }
          const textDecoder = state.textDecoder;
          const chunkStr = textDecoder.decode(bytes, { stream: !flush })
          const lines = chunkStr.split("\n");

          if (!flush && !hasSuffix(chunkStr, "\n")) {
            state.trailer = lines.pop();
          }

          const linesObjects = lines
            .filter(v => v.trim() !== '')
            .map(v => v);

          return [ linesObjects, state ];
        },
       onChunk(err, parsedChunk) {
         parsedChunk.forEach(function(line)  {
          logLines.push(line);
         });
         comp.setState({"logLines":logLines});
       }
     });
    //  Miner Logs
    chunkedRequest({
      url: window.customVars.urlPrefix+window.customVars.apiMinerLogs,
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + token},
      chunkParser(bytes, state = {}, flush = false) 
      {
         if (!state.textDecoder) {
           state.textDecoder = new TextDecoder();
         }
         const textDecoder = state.textDecoder;
         const chunkStr = textDecoder.decode(bytes, { stream: !flush })
         const lines = chunkStr.split("\n");

         if (!flush && !hasSuffix(chunkStr, "\n")) {
           state.trailer = lines.pop();
         }

         const linesObjects = lines
           .filter(v => v.trim() !== '')
           .map(v => v);

         return [ linesObjects, state ];
       },
      onChunk(err, parsedChunk) {
        parsedChunk.forEach(function(line)  {
         MinerlogLines.push(line);
        });
        comp.setState({"MinerlogLines":MinerlogLines});
      }
    });
   }

  }

  render() {
    const { isLoaded, redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login?expired" />;
    }

    return (
      <div className="Logspage">

      <h1>Debug<br/><small>Miner Logs</small></h1>

      <div className="row">

          {/* Box  */}
           <div className="col-md-12 mt-5">
             <div className="box">
                <div className="box-header">
                  <h3>Logs {!isLoaded && <div className="lds-dual-ring pull-right"></div>}</h3>
                </div>
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{padding:'0 5px 0 5px'}}>
                  <li class="nav-item">
                    <a class="nav-link active" id="sl-tab" data-toggle="tab" href="#sl" role="tab" aria-controls="sl" aria-selected="true">System</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="ml-tab" data-toggle="tab" href="#ml" role="tab" aria-controls="ml" aria-selected="false">Miner</a>
                  </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                  <div class="tab-pane fade show active" id="sl" role="tabpanel" aria-labelledby="sl-tab">
                    <LogBox lines={this.state.logLines} />
                  </div>
                  <div class="tab-pane fade" id="ml" role="tabpanel" aria-labelledby="ml-tab">
                    <LogBox lines={this.state.MinerlogLines} />
                  </div>
                </div>
             </div>
           </div>
           {/* ./ Box  */}
        </div>

      </div>
    );
  }
}

var LogBox = class LogBox extends React.Component {
  componentDidMount() {
  const node = ReactDOM.findDOMNode(this);
  node.scrollTop = node.scrollHeight;
}
componentWillUpdate() {
  const node = ReactDOM.findDOMNode(this);
  this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
}
componentDidUpdate(prevProps) {
  if (this.shouldScrollBottom) {
    const node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }
}

  render(){
    return (
      <ul className="logBox small">
      {this.props.lines.map((line, index) => (
         <li key={index}>
           {line}
         </li>
      ))}
      </ul>
    );
  }
};

export default Logspage;
