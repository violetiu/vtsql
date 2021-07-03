setTimeout(() => {
  setInterval(()=>{
    editorRequest("/listen",(msg)=>{
        if(msg.action=="none"){
        }else if(msg.action=="new_editor"){
           var editorKey=msg.key;
           var ele=document.getElementById(editorKey);
           var sql=msg.sql;
          eval("newEditor(ele,sql)");
        }else if(msg.action=="suggestions"){
            eval("loadEditorSuggestions(msg.suggestions)");
         }
        else{
            console.log(msg);
        }
      
        
    });
  },500);

}, 2000);

type callBack=(data:any)=>void;
function editorRequest(path:string,callback:callBack) {

    var serverDiv = document.getElementById("server");
    serverDiv.id = "server";
    var post = serverDiv.getAttribute("data-port");
    /*请求参数*/
    var paramObj = {
        httpUrl: 'http://127.0.0.1:' + post+path,
        type: 'post',
    }
    /*请求调用*/
    httpRequest(paramObj, callback, function () {
        alert('网络错误')
    });
}

function httpRequest(paramObj: any, fun: any, errFun: any) {
    var xmlhttp: any = null;
    /*创建XMLHttpRequest对象，
     *老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：new ActiveXObject("Microsoft.XMLHTTP")
     * */
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    /*判断是否支持请求*/
    if (xmlhttp == null) {
        alert('你的浏览器不支持XMLHttp');
        return;
    }
    /*请求方式，并且转换为大写*/
    var httpType = (paramObj.type || 'GET').toUpperCase();
    /*数据类型*/
    var dataType = paramObj.dataType || 'json';
    /*请求接口*/
    var httpUrl = paramObj.httpUrl || '';
    /*是否异步请求*/
    var async = paramObj.async || true;
    /*请求参数--post请求参数格式为：foo=bar&lorem=ipsum*/
    var paramData = paramObj.data || [];
    var requestData = '';
    for (var name in paramData) {
        requestData += name + '=' + paramData[name] + '&';
    }
    requestData = requestData == '' ? '' : requestData.substring(0, requestData.length - 1);

    /*请求接收*/
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            /*成功回调函数*/
            fun(JSON.parse(xmlhttp.responseText));
        } else {
            /*失败回调函数*/
            errFun;
        }
    }

    /*接口连接，先判断连接类型是post还是get*/
    if (httpType == 'GET') {
        xmlhttp.open("GET", httpUrl, async);
        xmlhttp.send(null);
    } else if (httpType == 'POST') {
        xmlhttp.open("POST", httpUrl, async);
        //发送合适的请求头信息
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(requestData);
    }
}