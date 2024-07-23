import { Router } from "express";
import { loginUser, logoutUser, refAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.post("/login", loginUser)

router.post("/logout", verifyJWT, logoutUser)

router.post("/refresh-token", refAccessToken)

export { router as userRouter };
