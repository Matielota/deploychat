const {PORT} = process.env;


const io = require ("socket.io")(PORT ,{
    cors:{
        origin:"https://deploy-click-care.vercel.app"
    }
});

io.on("conection", (socket)=>{
    console.log("a user conected.")
})

 let users= [];

const addUser = (userId, socketId) =>{
    !users.some((user) => user.userId === userId) &&
    users.push({userId, socketId});
}

const removeUser = (socketId) =>{
    users = users.filter((user)=>user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };


io.on("connection", (socket) => {
    console.log("a user conectiojn",socket.id);
    socket.on("addUser", (userId)=>{
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });
    socket.on("disconnect", ()=>{
        console.log("a user disconnected", socket.id);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        try{
        const user = getUser(receiverId);
        console.log(user)
        console.log(senderId,
            text,)
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });}
        catch(err){
            console.log(err)
        }
      });
}) 