const supabase = require("../supabaseClient");
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const { data: user, error } = await supabase.auth.getUser(token);
        if (error) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      } catch (err) {
        console.error(err);
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(401);
    }
  };

  module.exports = authenticateJWT;