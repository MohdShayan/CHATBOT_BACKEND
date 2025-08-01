import express from 'express';
import USER from '../schema/user.js';
import { handleUserLogin,handleUserSignup,handleUserLogout } from '../controller/user.js';
import { checkForAuthCookie } from '../middleware/auth.js';

const router = express.Router();

router.get("/me", checkForAuthCookie("gfgauthToken"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await USER.findById(req.user._id).select("name email");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.post('/logout', handleUserLogout);




export default router;
