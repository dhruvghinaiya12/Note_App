const express=require("express");
const expresslayouts=require("express-ejs-layouts");
const methodOverride=require("method-override");
const db = require("./config/db");
const session=require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const app=express();
const port=process.env.PORT || 4141

app.use(session({secret:"key-2024",resave:false,saveUninitialized:true,store:MongoStore.create({mongoUrl:process.env.DB_URL}),
// cookie:{maxAge: new Date(Date.now() + (3600000))}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(methodOverride("_method"));

app.use(express.static("public"));

app.use(expresslayouts);
app.set("layout","./layouts/main")
app.set("view engine","ejs")

app.use("/",require("./server/routes/auth"))
app.use("/",require("./server/routes/app"))
app.use("/",require("./server/routes/dashboard"))

// handle 404
app.get("*",(req, res) => {
    // res.status(404).send("404 page not found.");
    res.status(404).render("404");
})

app.get("/",(req,res)=>{
    const locals={
        title:"nodejs",
        description:"free nodejs note app",
    }
    res.render("index", locals)
})

app.listen(port,()=>{
console.log("server running on port " + port);
db();
})