import express from 'express';
import controller from './controller.js'

const router = express.Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/deleteacc").get(controller.deleteAccount);
//http://localhost:5000/api/user/test
router.route("/test").get(controller.testRoute);

export default router;