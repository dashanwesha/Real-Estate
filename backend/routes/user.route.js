import express from "express"
import { verifyToken } from "../utils/verifyToken.js"
import { deleteUser, getUserListings, updateUser } from "../controller/user.controller.js"
const router = express.Router()
router.post("/update/:id", updateUser)
router.delete("/delete/:id", deleteUser)
router.get("/listings/:id", getUserListings)
export default router