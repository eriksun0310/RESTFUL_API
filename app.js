const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const methodOverride = require("method-override") 
const studentRoutes = require("./routes/student-routes")
const facultyRoutes = require("./routes/faculty-routes")




// mongoose db
mongoose
    .connect("mongodb://localhost:27017/exampleDB")
    .then(()=>{
        console.log("connection mongoDB success !")
    })
    .catch((e)=>{
        console.log(e)
    }) 

app.set("view engine", 'ejs');
// middleware 給post 用
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
//cors :接受任何從同一台電腦來的請求
// app.use(cors());
app.use(methodOverride("_method"))
app.use("/students", studentRoutes)
app.use("/faculty", facultyRoutes)




// middleware 接route所有的錯誤(順序不能換)
app.use((err, req, res, next)=>{
    console.log('正在使用 middleware')
    return res.status(400).render("error")
})

app.listen(3000, ()=>{
    console.log('server listen port 3000')
})