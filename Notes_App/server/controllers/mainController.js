exports.homepage=async(req,res)=>{
    const locals={
        title:"nodejs Notes",
        description:"free nodejs note app",
    }
    res.render("index", {locals,layout:"../views/layouts/front-page"})
}
exports.about=async(req,res)=>{
    const locals={
        title:"about nodejs",
        description:"free nodejs note app",
    }
    res.render("about", locals)
}