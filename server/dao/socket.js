let dbserver = require('./dbserver');

module.exports = function(io){  //on接收 emit傳輸
  var users = {}; //socket註冊用戶
  io.on('connection',(socket)=>{
    socket.on('login',(id)=>{  //參考前端index.vue的join函數 
    console.log(id);
    //回覆客戶端
    socket.emit('msg',socket.id);
    //註冊
    socket.name = id;
    users[id] = socket.id; //users={65465q4we546(uid):socket.id,  235359qwrqrw3(uid):socket.id,...}
    
    })

    //1對1消息接收
    socket.on('msg',(msg,fromid,toid)=>{  
        console.log(msg);
        //修改好友最後通訊時間
        dbserver.upFriendLastTime({uid:fromid,fid:toid});
        //儲存一對一消息
        dbserver.insertMsg(fromid,toid,msg.message,msg.types);
        //回覆客戶端
        //socket.emit('msg',socket.id);
        if(users[toid]){
          socket.to(users[toid]).emit('msg',msg,fromid,0);  
        }
        socket.emit('msg',msg,toid,1); //自己也要一份 來更新index的最後訊息 但是自己的chatroom不能更新 
     });


    //用戶離開
    socket.on('disconnecting',()=>{
        //console.log(users);
        if(users.hasOwnProperty(socket.name)){//json的方法 可以判斷是否有指定的鍵
          delete users[socket.name];
          //console.log(users);
          console.log(socket.id+' 離開!');
        }
        
    });
    //加入群
    socket.on('group',function(data){
      socket.join(data); //群組用join
    });
    //接收群訊
    socket.on('groupMsg',function(msg,fromid,gid,name,img){
      dbserver.insertMsg(fromid,gid,msg.message,msg.types);
      //群內廣播
      socket.to(gid).emit('groupmsg',msg,gid,name,img,tip=0);
      //socket.to(gid).emit('groupmsg',msg,gid,1);
    })


   });


}



