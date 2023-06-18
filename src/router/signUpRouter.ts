import  express  from "express";
import {addUserValidators, addUserValidationHandler} from "../middleware/signup/signupValidator";
import { addUser } from "../controller/signUp/signupController";


const router = express.Router()

router.post("/", addUserValidators, addUserValidationHandler, addUser)

export default router;