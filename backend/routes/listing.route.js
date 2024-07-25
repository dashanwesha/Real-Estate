import express from "express"
import { verifyToken } from "../utils/verifyToken.js"
import { createListing } from "../controller/listing.controller.js"
const router = express.Router()
router.post("/create" ,createListing)
export default router