/* URLにアクセスすると呼び出す関数 */
function doGet(e) {
  Logger.log(e.parameter.tid);
  
  if (!e.parameter.page) {
    var html =HtmlService.createTemplateFromFile('menu');
    //urlのtidパラメータから取得
    html.tid=e.parameter.tid;
    
    var htmlOutput =html.evaluate();
    // ブラウザ表示タイトル決定
    htmlOutput.setTitle('居室内工具管理システムデモ版');
    htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
    return htmlOutput;
  }
}

function getSheet(name){
  // スプレッドシートの取得
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // 指定されたシート名からシートを取得して返却
  var sheet = ss.getSheetByName(name);
  return sheet;
}

function getval(sheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // 指定したシートからデータを取得
  var values = ss.getSheetByName(sheet).getDataRange().getValues();
  // 1行目の列名のデータも取得しているのでそれをshiftで削除する
  values.shift();
  return values;
}

function worker_check(wrkid){
  //受け取ったシートのデータを二次元配列に取得
  var wkdat = getval("worker");
  
  for(var i=0; i<wkdat.length; i++){
    if(wkdat[i][0] === wrkid){
      return wrkid;
    }
  }
  return 0;
}

function takeclick2(wrkid, tktools){
  //tktoolsは持出にチェックした工具
  if(worker_check(wrkid)==0) {
    return 0
  }
  
  //受け取ったシートのデータを二次元配列に取得
  var ss=getSheet("list");  //シートを設定;
  var dat=getval("list");

  var takeday = new Date()
  var giveday = new Date(takeday.getYear(), takeday.getMonth(), takeday.getDate() + 7);
  
  for(var i=0; i<dat.length; i++){
    if(tktools[i]==true){ //持出にチェック
      //持出にチェックしてるとき inなら持出
      if(dat[i][3]=="in"){
        dat[i][2]= wrkid;  //使用者
        dat[i][3]= "out";  //inout
        dat[i][4]= Utilities.formatDate(takeday ,"JST","yyyy/MM/dd");  //持出日
        dat[i][5]= Utilities.formatDate(giveday,"JST","yyyy/MM/dd");  //返却予定日
      }
    }else{
      //返却にチェックしてるとき 使用者が同じなら
      if(dat[i][2]==wrkid){
        dat[i][2]= "";  //使用者
        dat[i][3]= "in";//inout
        dat[i][4]= "";  //持出日
        dat[i][5]= "";  //返却予定日
      }
    }
  }
  
  var lastrow = dat.length;
  var lastcol = dat[0].length;
  ss.getRange(2,1,lastrow,lastcol).setValues(dat);//スプレッドシートに書き込み

  return 1;
}


//tktoolsは持出にチェックした工具
function all_returnclick2(wrkid, tktools){
  if(worker_check(wrkid)==0) {
    return 0;
  }
  //受け取ったシートのデータを二次元配列に取得
  var ss=getSheet("list");  //シートを設定
  var dat=getval("list");
  
  for(var i=0; i<dat.length; i++){
    if(tktools[i]==true){ //持出にチェック
      //持出にチェックしてるとき wrkidが同じなら返却
      if(dat[i][2]==wrkid){
        dat[i][2]= "";  //使用者
        dat[i][3]= "in";//inout
        dat[i][4]= "";  //持出日
        dat[i][5]= "";  //返却予定日
      }
    }
  }
  
  var lastrow = dat.length;
  var lastcol = dat[0].length;
  ss.getRange(2,1,lastrow,lastcol).setValues(dat);//スプレッドシートに書き込み

  return 1;
}

function uselistget(wrkid){
  //受け取ったシートのデータを二次元配列に取得
  var data = getval("list");
  var wkdat =  getval("worker"); 
  const userlist = [];
  
  //検索用に行と列を入れ替え
  var _ = Underscore.load();
  var wkdatTrans = _.zip.apply(_, wkdat);
  
  if(wrkid!=0){
    idrow =wkdatTrans[0].indexOf(wrkid);
    var wrkname =wkdat[idrow][1];
    
  }else{
    var wrkname ='';
  }
  
  //閲覧している使用者idと使用者名
  userlist.push([wrkid,wrkname]);

  for(var i=0; i<data.length; i++){
    if(data[i][3]==='out'){
      var id=data[i][2];
      
      //社番の行を取得
      idrow =wkdatTrans[0].indexOf(id);
      
      //idと名前を取得
      userid =wkdat[idrow][0];
      user =wkdat[idrow][1];
      userlist.push([userid,user]); 
      
    }else{
      userlist.push(["",""]);
    }
  }
 return userlist;
}


function check(){
  // スプレッドシートの取得
  var ss = getval("list");
  var ontime = new Date();
  
  for(var i=0; i<ss.length; i++){
    if(new Date(ss[i][5])>ontime.getTime()){
      // 返却遅れ処理 作成予定

    }
  }
}