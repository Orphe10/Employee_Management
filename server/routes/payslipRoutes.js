import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import { createPayslip, getPayslips, getPayslipsById } from "../controllers/paylipController.js";



const payslipRouter = Router();

payslipRouter.post("/", protect, protectAdmin, createPayslip)
payslipRouter.get("/", protect,getPayslips)
payslipRouter.post("/:id", protect, getPayslipsById)

export default payslipRouter;