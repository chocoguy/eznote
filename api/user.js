import express from 'express';
import controller from './controller.js';
import { protectRoute } from './auth.js';
import { authorize } from './authorizeMachine.js';

const router = express.Router();

//http://localhost:5000/api/user/register
router.route("/register").post(controller.register);
//http://localhost:5000/api/user/login
router.route("/login").post(controller.login);
//http://localhost:5000/api/user/deleteacc
router.route("/deleteacc").delete(authorize, controller.deleteAccount);
//http://localhost:5000/api/user/test
router.route("/test").get(controller.testRoute);

export default router;