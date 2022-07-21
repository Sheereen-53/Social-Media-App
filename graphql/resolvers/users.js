import User from "../../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import {UserInputError} from "apollo-server";
import {validateRegisterInput, validateLoginInput} from "../../utils/validators.js";

const users = {
    Mutation: {
        async login(parent, {username, password}) {
            const {errors, valid} = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            const user = await User.findOne({username});

            if (! user) {
                errors.general = 'User not found';
                throw new UserInputError("User not found", {errors});
            }


            const match = await bcrypt.compare(password, user.password);
            if (! match) {
                errors.general = 'Wrong Crendetials';
                throw new UserInputError("Wrong Credentials", {errors});
            }

            const token = jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username
            }, process.env.JWT);

            return {
                ... user._doc,
                id: user._id,
                token
            };

        },
        async register(parent, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword
            }
        }) { // TODO: Validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            // TODO: Make sure user does not already exist
            const user = await User.findOne({username});
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                });
            }
            // TODO: Hash the password and create an auth token
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const newUser = new User({email, username, password: hash, createdAt: new Date().toISOString()});

            const res = await newUser.save()
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, process.env.JWT);

            return {
                ... res._doc,
                id: res._id,
                token
            };

        }
    }
}

export default users
