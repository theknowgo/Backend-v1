import helpAndSupportController from "../controllers/helpAndSupport.controller.js";
import express from "express";
const router = express.Router();

router.post("/", helpAndSupportController.create);
router.get("/", helpAndSupportController.findAll);
router.get("/:id", helpAndSupportController.findOne);
router.put("/:id", helpAndSupportController.update);
router.patch("/:id", helpAndSupportController.close);
router.get("/users/:userid", helpAndSupportController.findAllByUser);

export default router;
