import express from "express"
import * as memberC from "../controllers/member.js"

const route = express.Router()
route.get("/members/detail",memberC.getMember)
route.get("/members/logout",memberC.logoutMember)
route.post("/members",memberC.PostMember)
route.post("/members/login",memberC.loginMember)

export default route