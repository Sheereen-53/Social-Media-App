import jwt from "jsonwebtoken";
import {AuthenticationError} from "apollo-server";

export const checkAuth = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split("Bearer ")[1];
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT);
                return user;
            } catch (err) {
                throw new AuthenticationError("Invalid/Expired token");
            }
        } else {
            throw new Error("Authentication token must be \'Bearer [token]");
        }
    } else {
        throw new Error("Authentication Header must be provided")
    }
}

