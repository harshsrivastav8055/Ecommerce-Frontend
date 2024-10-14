import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
//Query give us id and represented by ?  and key = 24 so req.query krene pe 24 milega
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please Login First", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Please Enter valid ID", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("This is only for admin", 401));
    next();
});
