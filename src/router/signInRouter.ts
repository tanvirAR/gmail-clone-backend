// external imports
import express from "express";

// internal imports
import { login, logout } from "../controller/signIn/signInController";
import { checkLogin } from "../middleware/common/checkLogin";
import { checkLoggedIn } from "../controller/checkLogIn/checkLogin";

const router = express.Router();


router.post("/", login);


// check if user is logged in or not 
router.get("/", checkLoggedIn)

router.delete("/", logout);

export default router;
