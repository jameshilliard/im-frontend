export function getStorage(name) {
    if (typeof (Storage) !== 'undefined') {
      return localStorage.getItem(name)
    } else {
      return null;
    }
  }

export function setStorage(name, val) {
  if (typeof (Storage) !== 'undefined') {
    localStorage.setItem(name, val)
  } else {
    return null;
  }
}

export function deleteStorage(name) {
  if (typeof (Storage) !== 'undefined') {
    localStorage.removeItem(name);
  }
}

export function formatUpTime(timestamp)
{
    var time = new Date(timestamp);
    var days=Math.floor(time/(24*3600*1000));
    var leave1=time%(24*3600*1000);
    var hours=Math.floor(leave1/(3600*1000));
    var leave2=leave1%(3600*1000);
    var minutes=Math.floor(leave2/(60*1000));
    var leave3=leave2%(60*1000);
    var seconds=Math.round(leave3/1000);
    var daysText="";
    var hoursText="";
    var minutesText="";
    if (days>0)
      daysText=days+'d ';
    if (hours>0)
      hoursText=hours+'h ';
    if (minutes>0)
      minutesText=minutes+'m';
    if (days==0&&hours==0&&minutes==0&&seconds>0)
        return seconds+'s'
    return daysText+hoursText+minutesText;
}

export function convertHashRate(hashRate,unit)
{
  var unit_list = ["","K","M","G","T","P","E"];
  var hash_show = hashRate;
  var unit_key = 0;
  while(hash_show >= 1000)
  {
    hash_show /= 1000;
    unit_key ++;
  }
  return hash_show.toFixed(2) + " " + unit_list[unit_key]+unit;

  // if(minertype == 'B29+')
  // {
  //   return (hashRate/1000).toFixed(2)+' KH/s';
  // }
  // else if(minertype == 'A8+')
  // {
  //   return hashRate.toFixed(2)+' KH/s';
  // }
  // else
  // {
  //   if (hashRate<1000)
  //   {
  //       return hashRate.toFixed(2)+' MH/s';
  //   }
  //   else if (hashRate>=1000 && hashRate<1000000)
  //   {
  //       return (hashRate/1000).toFixed(2)+' GH/s ';
  //   }
  //   else if (hashRate>=1000000)
  //   {
  //       return (hashRate / 1000000).toFixed(2) + ' TH/s ';
  //   }
  // }
}
export function parseQueryString(url)
{
    var obj={};
    var keyvalue=[];
    var key="",value="";
    var paraString=url.split("&");
    for(var i in paraString)
    {
        keyvalue=paraString[i].split("=");
        key=keyvalue[0];
        value=keyvalue[1];

        obj[key]=value;
    }
    return obj;
}
export function isUrlValid(url) {
  return /^(https?|stratum\+tcp|tcp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

export function isValidNetMask(mask)
{
    var exp=/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    var reg = mask.match(exp);
    if(reg==null)
    {
        return false; //"非法"
    }
    else
    {
        return true; //"合法"
    }
}
export function generateUrlEncoded(fields) {
  var formBody = [];
  Object.keys(fields).forEach(function(index)  {
    var encodedKey = encodeURIComponent(index);
    var encodedValue = encodeURIComponent(fields[index]);
    formBody.push(encodedKey + "=" + encodedValue);
  });
  return formBody.join("&");
}

export function getModeAndLevel(value)
{
  var return_info = {};
  var level_list = ["2","3","4","0","1","2","3","4","0","1","2","3","4","0","1","2","3"];
  var mode = "";
  var level = level_list[parseInt(value) - 1];
  switch (value) 
  {
    case 1:
    case 2:
    case 3:
      mode="efficient";
      break;
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      mode="balanced";
      break;
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
      mode="factory";
      break;
    case 14:
    case 15:
    case 16:
    case 17:
      mode="performance"
      break;
    default:
  }
  return_info['mode'] = mode;
  return_info['level'] = level;
  return return_info;
}

export function getAutoTuneValue(mode,level)
{
  var return_value;
  switch (mode) 
  {
    case "efficient":
      switch(level)
      {
        case "2":
         return_value = "1";
         break;
        case "3":
          return_value = "2";
          break;
        case "4":
          return_value = "3";
          break;
        default:
          return_value = "1";
          break;
      }
      break;
    case "balanced":
      switch(level)
      {
        case "0":
          return_value = "4";
          break;
        case "1":
          return_value = "5";
          break;
        case "2":
          return_value = "6";
          break;
        case "3":
          return_value = "7";
          break;
        case "4":
          return_value = "8";
          break;
        default:
          return_value = "6";
          break;
      }
      break;
    case "factory":
      switch(level)
      {
        case "0":
          return_value = "9";
          break;
        case "1":
          return_value = "10";
          break;
        case "2":
          return_value = "11";
          break;
        case "3":
          return_value = "12";
          break;
        case "4":
          return_value = "13";
          break;
        default:
          return_value = "11";
          break;
      }
      break;
    case "performance":
      switch(level)
      {
        case "0":
          return_value = "14";
          break;
        case "1":
          return_value = "15";
          break;
        case "2":
          return_value = "16";
          break;
        case "3":
          return_value = "17";
          break;
        default:
          return_value = "16";
          break;
      }
      break;
    default:
  }

  return return_value;
}

export function showLevel(val)
{
  var sw_val = parseInt(val) - 2;
  var return_str = "";
  switch(sw_val)
  {
    case -2:
      return_str = " - -";
      break;
    case -1:
      return_str = " -";
      break;
    case 0:
      return_str = "";
      break;
    case 1:
      return_str = "+";
      break;
    case 2:
      return_str = "++";
      break;
    default:
      return_str = "";
      break;
  }
  return return_str;
}

export function showMode(val)
{
  var mode_str = "";
  switch(val)
  {
    case 1:
      mode_str="Efficiency";
      break;
    case 2:
      mode_str="Efficiency+";
      break;
    case 3:
      mode_str="Efficiency++";
      break;
    case 4:
      mode_str="Balanced - -";
      break;
    case 5:
      mode_str="Balanced -";
      break;
    case 6:
      mode_str="Balanced";
      break;
    case 7:
      mode_str="Balanced+";
      break;
    case 8:
      mode_str="Balanced++";
      break;
    case 9:
      mode_str="Factory - -";
      break;
    case 10:
      mode_str="Factory -";
      break;
    case 11:
      mode_str="Factory";
      break;
    case 12:
      mode_str="Factory+";
      break;
    case 13:
      mode_str="Factory++";
      break;
    case 14:
      mode_str="Performance - -";
      break;
    case 15:
      mode_str="Performance -";
      break;
    case 16:
      mode_str="Performance";
      break;
    case 17:
      mode_str="Performance+";
      break;
  }
  return mode_str;
}
