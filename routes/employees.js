
import Router from "express"
import { GetAllproducts, getemployees } from "../controllers/employees-controllers.js";
import { postemployees } from "../controllers/employees-controllers.js";
import { confirmmail } from "../controllers/employees-controllers.js";
import { empprof } from "../controllers/employees-controllers.js";
import { changepass } from "../controllers/employees-controllers.js";
import { getallchats } from "../controllers/employees-controllers.js";

import { GetAllemps } from "../controllers/employees-controllers.js";

import { GetAllcustomers} from "../controllers/employees-controllers.js";
import { emplogout} from "../controllers/employees-controllers.js";

import { sectionsdetails } from "../controllers/employees-controllers.js";




import { getallchatssel ,emporder,seremp,switchtoadd,getorder} from "../controllers/employees-controllers.js";
const router = Router();
console.log(postemployees);
//employees sign up 
router.post("/", postemployees)
//employees sign in 
router.post("/signin", getemployees);
router.post("/search",seremp);
//access to employees profile 
router.get("/profile", empprof);
//verify employees mail 
router.get("/mail/verification/:id", confirmmail);
//change employees password 
router.post("/profile/password/change", changepass);
router.post('/search/order/num',getorder);
router.get("/signin", (req, res) => {
  res.render("admin_signin", { alert: false });
})
router.get("/profile/chat/details/:id", getallchatssel);
router.get("/profile/chat/details", getallchats);
router.get("/profile/orders", emporder)
router.get('/profile/logout', emplogout);

//for employees
router.get("/profile/user", GetAllemps);

//for admin menu sections
router.get("/profile/menu/:sec_name", sectionsdetails);


// router.get("/emppp", GetAllproducts);


// router.get("/empp", GetAllcustomers);

router.get("/profile/addnewone",switchtoadd);
router.get("/profile/customers",GetAllcustomers);

export default router;

