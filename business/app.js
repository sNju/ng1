var express=require("express");
var app=express();
var http=require("http").Server(app);
var io=require("socket.io")(http);
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.static(__dirname+"/"));
http.listen(3000,function(){
	console.log("server is running=",__dirname);
});
app.get("/",function(req,res){
	//res.sendFile(__dirname+"/index.html");
});
var users=[];
var rusers=[];
io.sockets.on("connection",function(socket){
	console.log("user connected");
	socket.emit("message","hello this is greeting again");
	socket.on("send message",function(msg){
		console.log("message=",msg);
		io.sockets.emit("new message",{msg:msg,user:socket.user});
	});
	socket.on("set user",function(data,callback){
		console.log("user=",data);
		if(users.indexOf(data)!=-1)
		{
			callback(false);
		}
		else
		{
			callback(true);
			socket.user=data;
			users.push(socket.user);
			updateuser();
		}
	})
	function updateuser(){
		io.sockets.emit("usernames",users);
	}


	



	socket.on("send",function(data){
		console.log("data.dest",data.dest);
		io.sockets.emit(data.dest.toString(),data)		
	});


	socket.on("register",function(data,callback){
		console.log("user connected with id=",data.id);
		if(rusers.indexOf(data.id)!=-1){
			callback(false);
		}
		else
		{

			callback(true);
			socket.user=data.id;
			rusers.push(socket.user);
			updateruser();
		}
	});

	

	function updateruser(){
		io.sockets.emit("usernames",rusers);
	}


	socket.on("disconnect",function(){
		//console.log('disconnect',socket.user);
		if(!socket.user)return;
		users.splice(users.indexOf(socket.user),1);
		updateuser();
	});
})