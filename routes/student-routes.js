const express = require("express");
const router = express.Router()
const Student = require("../models/student")

const testMiddleware = (req,res,next)=>{
    console.log('middleware ing~~~~~')
    next()
}
const testMiddleware2 = (req,res,next)=>{
    console.log('middleware ing222~~~~~')
    next()
}
const testMiddleware3 = (req,res,next)=>{
    console.log('middleware ing333~~~~~')
    next()
}



// GET: 獲得所有學生資料
router.get('/',
// 要放多種middleware 可以用array 接 
// [
//     testMiddleware,
//     testMiddleware2,
//     testMiddleware3
// ],
async (req, res, next)=>{
    try{
        let studentData = await Student.find({}).exec();
        return res.render("students", {studentData})
        // return res.send(studentData)
    }catch(e){
        next(e)
        // return res.status(500).send("尋找資料時發生錯誤")
    }
})


// GET: 獲得特定學生 id
router.get('/:_id', async(req,res, next)=>{
    let { _id } = req.params
    try{
        let foundStudent = await Student.findOne({ _id }).exec()
        if(foundStudent !== null){  
            return res.render("student-page", {foundStudent})
        }else{
            return res.status(400).render("student-not-found")
        }
    }catch(e){
        next(e)
        // return res.status(400).render("student-not-found")
    }
})

// 新增學生頁面
router.get("/new", (req, res)=>{
    return res.render("new-student-from")
})

//編輯學生資料
router.get('/:_id/edit', async(req,res, next)=>{
    let { _id } = req.params
    try{
        let foundStudent = await Student.findOne({ _id }).exec()
        if(foundStudent !== null){  
            return res.render("edit-student", {foundStudent})
        }else{
            return res.status(400).render("student-not-found")
        }
    }catch(e){
        next(e)
        // return res.status(400).render("student-not-found")
    }
})


//刪除學生資料
router.get('/:_id/delete', async(req,res, next)=>{
    let { _id } = req.params
    try{
        let foundStudent = await Student.findOne({ _id }).exec()
        if(foundStudent !== null){  
            return res.render("delete-student", {foundStudent})
        }else{
            return res.status(400).render("student-not-found")
        }
    }catch(e){
        next(e)
        // return res.status(400).render("student-not-found")
    }
}) 

// POST: 創建一個新學生
router.post('/', async(req, res)=>{
    try{
        // 使用者給的資料
        let { name, age, merit,other } = req.body
        
        let newStudent = new Student({
            name,
            age,
            scholarship:{
                merit,
                other,
            },
        })
        let saveStudent = await newStudent.save()
        // 給user的顯示的訊息
        return res.render("student-save-success", { saveStudent })
    }catch(e){
        return res.status(400).render("student-save-fail")
    }
})

// PUT: 修改特定的學生資料, user需提供完整資料(若無填寫會被覆蓋過去)
router.put('/:_id', async(req,res)=>{
    try{
        let { _id } = req.params
        let { name, age, merit,other } = req.body

        let newData = await Student.findOneAndUpdate(
            { _id },
            { name, age, scholarship:{ merit, other }},
            {
                new:true,
                runValidators:true,
                overwrite:true, // 覆蓋所有數據
                /*
                因為HTTP put request 要求客戶端提供所有數據,所以
                我們需要根據客戶端提供的數據, 來更新資料庫內的資料
                */
            }
        )
        return res.render("student-update-success", { newData })
    }catch(e){
       return res.status(400).send(e.message)
    }
})

class NewData {
    constructor(){} 
        setProperty(key, value) {
            if(key !== 'merit' && key !== 'other'){
                this[key] = value
            }else{
                this[`scholarship.${key}`] = value
            }
        }
    
}



// PATCH: 修改特定的學生資料, user只需提供要被修改的資料
router.patch('/:_id', async(req, res)=>{
    try{

        let { _id } = req.params
        let newObject = new NewData()
        for(let property in req.body){
            newObject.setProperty(property, req.body[property])
        }

        // req.body => { age:'29', name:'小鐘', merit:'3000', other:'1500'}
        // newObject => { age:'29', name:'小鐘', 'scholarship.merit':'3000', 'scholarship.other':'1500' } 

        let newData =  await Student.findByIdAndUpdate({ _id }, newObject,{
            new:true,
            runValidators:true,
            // 不能寫overwrite:true(因為資料會全部被覆蓋過去)
        })
        res.send({msg:'成功更新學生資料!', updatedData:newData})
    }catch(e){
        return res.status(400).send(e)
    }
})


// DELETE: 刪除特定的學生資料
router.delete('/:_id', async(req, res)=>{
    try{
        let { _id } = req.params
        let foundDeleteStudent = await Student.findOne({ _id }).exec()
        return res.render("student-delete-success", { foundDeleteStudent })
    }catch(e){
        return res.status(500).send('無法刪除學生資料')
    }
})

module.exports = router;


