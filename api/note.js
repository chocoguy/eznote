import express from 'express';;
import controller from './controller.js';
import { protectRoute } from './auth.js';
import { authorize } from './authorizeMachine.js';

const router = express.Router();

//http://localhost:5000/api/note/createnote
router.route("/createnote").post(authorize, controller.createNote);
//http://localhost:5000/api/note/viewnotes
router.route("/viewnotes").get(authorize, controller.viewNotes);
//http://localhost:5000/api/note/editnote/3736
router.route("/editnote/:id").put(authorize,  controller.editNote);
//http://localhost:5000/api/note/deletenote/3736
router.route("/deletenote/:id").delete(authorize, controller.deleteNote);
//http://localhost:5000/api/note/viewnote/3736
router.route("/viewnote/:id").get(authorize, controller.viewNote);

export default router;