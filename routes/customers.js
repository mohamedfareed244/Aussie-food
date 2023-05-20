
import Router from "express"
import {getcustomers} from "../controllers/customers-controller.js";
import {postcustomers} from "../controllers/customers-controller.js";

const router=Router();

router.post('/signup', postcustomers );
  router.post("/signin", getcustomers);

  router.get('/signup',async (req,res)=>{
    res.render("register");
  });
  router.get('/signin',async (req,res)=>{
    res.render("sign-in");
  });

  export default router;