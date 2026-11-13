import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.js";
import { validate } from "../middleware/validate.js";
import { createNoteSchema, updateNoteSchema } from "../schemas/note.schema.js";
import {
  list,
  create,
  getOne,
  update,
  remove,
} from "../controllers/note.controller.js";

export const noteRouter = Router();

noteRouter.use(requireAuth);

noteRouter.get("/", list);
noteRouter.post("/", validate(createNoteSchema), create);
noteRouter.get("/:id", getOne);
noteRouter.patch("/:id", validate(updateNoteSchema), update);
noteRouter.delete("/:id", remove);
