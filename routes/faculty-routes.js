const express = require("express")
const router = express.Router()


router.get("/", (req, res)=>{
    return res.send("歡迎來到教職員首頁")
})

router.get("/new", (req, res)=>{
    return res.send("新增教職員")
})


module.exports = router