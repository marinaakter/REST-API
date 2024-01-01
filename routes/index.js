import { Router } from 'express';
import {registerController,loginController,userController} from '../controllers';


const router = Router();
router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/me',userController.login)



export default router;