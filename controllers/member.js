import database from "../services/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function logoutMember(req, res) { 
    console.log(`GET /logout Member is requested.`)
try {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    res.json({ message: `Login Fail`, login: false })
}
catch (err) {
    return res.json({
        message: err.message
    })
}
}

export async function getMember(req, res) {
console.log(`GET /getMember is requested.`)
// อ่านค่าจาก Cookies ที่ส่งมาจาก Browser --> Frontend --> Backend 
const token = req.cookies.token
    if (!token)
        return res.json({message: `No member`, login: false })

    try {
        const secret_key = process.env.SECRET_KEY // ENV // ตรวจสอบ + แปลง JWT เพื่ออ่านข้อมูล
        const member = jwt.verify(token, secret_key)
        console.log(member)
        return res.json({
        memEmail: member.memEmail,
         memName: member.memName,
        dutyId: member.dutyId, 
        login:true
        })
    }
    catch (err) {
    // ถ้ามีการเปลี่ยนแปลง Token/Signature ไม่ถูกต้อง จะเกิด Error
    console.log(err.message)
    return res.json({ message: `The information was falsified.`,login: false })
    }
}

export async function PostMember(req,res) {
    console.log("post /members")
    const bodyData = req.body
    try{
        if(!bodyData.memEmail || !bodyData.memName){
            return res.json({message:" memEmail and memName are require",regist:false})
        }

        const chkRow = await database.query({
            text:`SELECT * FROM members WHERE "memEmail" = $1`,
            values:[bodyData.memEmail]
        })
        if (chkRow.rowCount != 0){
            return res.status(400).json({message:`memEmail ${bodyData.memEmail} is exists.`,regist:false})
        }
        const pwd = req.body.password
        const saltround = 11
        const pwdHash =  await bcrypt.hash(pwd,saltround)
        const result = await database.query({
            text:`INSERT INTO "members" ("memEmail","memName","memHash")
                    VALUES ($1,$2,$3)`,
            values:[
                bodyData.memEmail,
                bodyData.memName,
                pwdHash,
            ]
        })

        bodyData.createDate = new Date()
        bodyData.message = "Success"
        bodyData.regist = true
        res.json(bodyData)
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function loginMember(req, res) { 
    console.log("POST /loginMembers is requested.") 
    const bodyData = req.body
    try {
    // ตรวจสอบ loginName กับ password
    if (!bodyData.loginName || !bodyData.password) {
        return res.status(400).json({ message: `ERROR loginName and password is required.` })
    }
    // ตรวจสอบว่ามี Email นี้หรือไม่
    const result = await database.query({
         text: `SELECT * FROM members WHERE "memEmail"= $1`, 
         values: [req.body.loginName]
    })
    // ไม่พบ email ที่ login
    if (result.rowCount == 0) {
        return res.status(401).json({ message: `Login Fail`,login:false })
    }
    // ถ้าพบ ก็ทําการอ่านข้อมูลมาตรวจสอบ
    // ท่าการเปรียบเทียบ Password กับ Login ที่เข้ามาเทียบกับค่า hash ใน DB ผ่าน bcrypt 
    const loginOK = await bcrypt.compare(req.body.password,result.rows[0].memHash) 

    if (loginOK){
        const theuser = {
            memEmail:result.rows[0].memEmail,
            memName:result.rows[0].memName,
            dutyId:result.rows[0].dutyId,
        }

        const secret_key=process.env.SECRET_KEY
        const token = jwt.sign(theuser,secret_key,{
            expiresIn:"24h"
        })
        res.cookie("token",token,{
            maxAge:1000*60*24,
            httpOnly:true,
            secure:true,
            sameSite:"strict"
        })
        res.json({message:`Login Success`, login:true})
    }
    else{
        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"strict"
        })
        res.status(401).json({message: `Login Fail`,login:false})
    }

    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }
}