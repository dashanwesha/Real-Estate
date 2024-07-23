import express from "express"
import { verifyToken } from "../utils/verifyToken.js"
import { deleteUser, getUserListings, updateUser } from "../controller/user.controller.js"
const router = express.Router()
router.post("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id", verifyToken, deleteUser)
router.get("/listings/:id", verifyToken, getUserListings)
export default router