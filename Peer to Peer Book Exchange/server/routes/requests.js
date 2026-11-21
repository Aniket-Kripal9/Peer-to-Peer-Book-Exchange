import express from "express";
import {
  getRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", createRequest);
router.put("/:id", updateRequestStatus);
router.delete("/:id", deleteRequest);

export default router;
