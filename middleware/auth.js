import { verifyToken } from '../tokenCreation_and_Validations.js';

export function checkForAuthCookie(cookieName) {
  return (req, res, next) => {

    const token = req.cookies[cookieName];
 

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
      const payload = verifyToken(token);
      req.user = payload;

    } catch (error) {
   
      return res.status(401).json({ error: "Unauthorized" });
    }

    return next();
  };
}

