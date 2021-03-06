import { Router } from "express";
import credentialsController from "../controllers/credentials.controller";
import verifyJwtHeader from "../middleware/auth/jwt-header";
import validateBody from "../middleware/validation/zod";
import { CreateCredentialSchema } from "../models/credentials";

const router = Router();

router.use(verifyJwtHeader);

router.post(
  "/credentials",
  validateBody(CreateCredentialSchema),
  credentialsController.create,
);

router.get("/credentials", credentialsController.findAll);
router.get("/credentials/:id", credentialsController.findOne);
router.delete("/credentials/:id", credentialsController.deleteOne);

export default router;
