import Joi from 'joi';
import { User } from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import CustomErrorHandler from '../../services/CustomErrorHandler';



const registerController = {
    async register(req, res, next) {
        



        //validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            password_confirmation: Joi.valid(Joi.ref('password')).required()
        });




        
        const { error } = registerSchema.validate(req.body);
        
        if (error) {
            return next(error);
        }

        //check user is in database
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            
            }
        } catch (err) {
            return next(err);
        }
        const {name, email, password} = req.body;
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //prepare the model
        
        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        let access_token;
        try {
            const result = await user.save();
            

            //token
            access_token = JwtService.sign({_id: result._id,role: result.role});



        } catch(err) {
            return next(err);
        }




        res.json({access_token})
    }
}




export default registerController;