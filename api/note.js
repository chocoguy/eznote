import express from 'express';
import controller from './controller.js'

const router = express.Router();

router.route("/createnote").post(controller.createNote);
router.route("/viewnotes").get(controller.viewNotes);
router.route("/editnote/:id").put(controller.editNote);
router.route("/deletenote/:id").get(controller.deleteNote);
router.route("/viewnote/:id").get(controller.viewNote);

export default router;