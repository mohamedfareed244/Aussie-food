
import { Emp } from "../models/Employees.js";
import nodemailer from "nodemailer"
import ejs from "ejs";
import { addemp, get_customers ,__dirname} from "../app.js";
import { orders } from "../models/orders.js";
import { Sec } from "../models/menu_sections.js";
import bcrypt from 'bcryptjs';
import {All } from "../models/schema.js";


import {customers } from "../models/customers.js";




//confirm mail 
function sendmail(User) {
  const trans = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "aussiefood6@gmail.com",
      pass: "gqhnpwicffirkdhn"
    }
  });
  let data;
  ejs.renderFile(__dirname+"/views/emp_mail.ejs", { user: User }, (err, d) => {
    data = d;

  });
  console.log(User.id);
  const options = {
    from: "aussiefood6@gmail.com",
    to: User.Email,
    subject: "mail confirmation",
    html: data

  }
  trans.sendMail(options, function (err, info) {
    if (err) {
      console.log("there are an error " + err)
    } else {
      console.log(info);
    }
  })
}

// const postemployees=(req, res)=> {

//     const employee=new Emp(req.body);
//     employee
//     .save( )
//     .then( result => {
//      console.log("succesfully saved");
//     })
//     .catch( err => {
//       console.log(err);
//     });
//   }



const postemployees = async (req, res) => {

  const obj = {
    Name: req.body.Name,
    Email: req.body.Email,
    Address: req.body.Address,
    Phone: req.body.Phone,
    isadmin: req.body.admin === undefined ? false : true,
    verified: false,
    Password: ""
  }
  const employee = new Emp(obj);

  try {
    await employee.save();
    await sendmail(employee);
    console.log("saved successfully");
    res.redirect("/employees/profile")
  } catch (err) {
    console.log(err);
  }

}


// create a new employee and send them an email
const getemployees = async (req, res) => {
  console.log(req.body.Email)
  console.log(req.body.password)
  let curr;
  await Emp.findOne({ Email: req.body.Email }).then((res) => {
    curr = res;
  })

  console.log(curr);

  if (curr === null || curr === undefined ) {
    res.render("admin_signin", { alert: true, text: "invalid Email or Password" })
  } else if (!curr.verified){
    res.render("admin_signin", { alert: true, text: "Check Your mail for verfication to signin " })
  }
  else {
    let founded=false;
    founded =await bcrypt.compare(req.body.password, curr.Password);
    if(!founded){
      res.render("admin_signin",{alert:true,text:"Invalid user name or password "});
    }
    req.session.employee = curr;
    console.log("start redirection");
    await addemp(curr);
try{
    res.redirect("/employees/profile");
}catch(err){

}
  }

}
//verified 
const confirmmail = async (req, res) => {
  const User = await Emp.findById(req.params.id);
  if (!User.verified) {
    req.session.employee = User;
    User.verified = true;
    await User.save();
    await addemp(User);
    res.render("admin_account", { user: User });
  } else {
    res.redirect("/employees/profile")
  }
}
//admin profile 
const empprof = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  } else {

    res.render("admin_account", { user: req.session.employee });
  }
}

const changepass = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const pass= await bcrypt.hash(req.body.psw,10);
    curr.Password=pass;

    await Emp.findOneAndReplace({ Email: curr.Email }, curr);

    res.render("admin_account", { user: req.session.employee });
  }
}

///// chat //////

const getchats = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const connected = await get_customers(curr);
    const requested = req.params.id;
    let obj;
    if (connected.length == 0) {
      res.redirect("/employees/profile");
    }
    for (let i = 0; i < connected.length; i++) {
      if (connected[i].id === requested) {
        obj = connected[i];
        break;
      }
    }
    res.render("admin_chat", { "connected": connected, "selected": obj });
  }
}
const getallchats = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const connected = await get_customers(curr);
    console.log("the number is ", connected.length)
    if (connected.length == 0) {
      console.log("yesssss")
      res.redirect("/employees/profile");
    } else {
      console.log("all the connected is ", connected);
      console.log(connected[0].chat);
      res.render("admin_chat", { "connected": connected, "selected": connected[0] });
    }
  }
}
const getallchatssel = async (req, res) => {
  if (req.session.employee === undefined || req.session.employee === null) {
    res.render("admin_signin", { alert: true, text: "You must login first to access this section !" });
  }
  else {
    const curr = req.session.employee;
    const connected = await get_customers(curr);
    console.log("all the connected is ", connected);
    let sel;
    for (let i = 0; i < connected.length; i++) {
      if (connected[i]._id === req.params.id) {
        sel = connected[i];
        break;
      }
    }
    res.render("admin_chat", { "connected": connected, "selected": sel });
  }
}
/////////////
const emporder= async(req,res)=>{
const curr=req.session.employee;
if(curr===null||curr===undefined){
  res.render("admin_signin",{alert:true,text:"You have to sign in first to access orders section "});
}else{
await orders.find({emp_name:curr.Name,emp_phone:curr.Phone}).then((items)=>{
  res.render("dashboard-orders",{orders:items});
}).catch((err)=>{
  res.render("error-page");
})
}
}



//get section items by section name 
// const getsectionAdmin = async (req, res,) => {
//   Sec.find()
//   .then((result) => {
//     res.render('admin-dashboard-menu',{employes:result})

//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }; 











//get emps in table
const GetAllemps = (req, res) => {
  try{
  const current=req.session.employee;
  if(current===null||current===undefined){
    res.render("admin_signin",{alert:true,text:"You must login to access this feature "});
  }
  else if(!current.isadmin){
    req.session.employee=null;
    res.render("admin_signin",{alert:true,text:"you have signed out sign in again as an admin to access this section "})
  }
  Emp.find()
    .then((result) => {
      console.log(result)
      res.render('dashboard-employees', { employees: result });
    })
    .catch((err) => {
      console.log(err);
    });
  }catch(err){

  }
};











//get sections in menu
const sectionsdetails = async (req, res) => {


if(req.session.employee===null||req.session.employee==undefined){
  res.render("admin_signin",{alert:true,text:false});
}



  let sections_names;
  let selected_section=req.params.sec_name;
await  Sec.find()
    .then((result) => {
      console.log(result)
      sections_names=result;
    })
    .catch((err) => {
      console.log(err);
    });
    let found =false;
    let items=new Array();
    for(let i=0;i<sections_names.length;i++){
      if(sections_names[i].name===selected_section){
found=true;
for(let j=0;j<sections_names[i].items.length;j++){
  const v=await All.findById(sections_names[i].items[j].id);
  items.push(v);
}
break;
      }
    }
    if(!found){
      res.render("error-page");
    }else{
      res.render("admin-dashboard-menu",{sections:sections_names,"items":items,selected:req.params.sec_name});
    }
};









//get products in menu in menu
const GetAllproducts = (req, res) => {
  if(req.session.employee===null||req.session.employee===undefined){
    res.render("amdin_signin",{alert:true,text:"You have to sign in first to accesss this section "});
  }
  All.find()
     .then((result) => {
       console.log(result)
       res.render('admin-dashboard-menu', {produc: result });
     })
     .catch((err) => {
       console.log(err);
     });
 };
 





 const GetAllcustomers = (req, res) => {
  customers.find()
     .then((result) => {
       
       res.render('recent-customers', {custt: result });
     })
     .catch((err) => {
       console.log(err);
     });
 };
 const emplogout = async (req, res) => {
  if(req.session.employee===null||req.session.employee===undefined){
    res.render("admin_signin",{alert:true,text:"You already logged out "})
  }else{
  req.session.employee= null;
  res.render("admin_signin", { alert: false});
  }
}

const seremp= async (req,res)=>{
const word=req.body.empsearch;
console.log(word);
const emp=await Emp.findOne({Email:word});
if(emp!==null){
  let arr=new Array();
  arr.push(emp)
  res.render('dashboard-employees', { employees: arr });
}else{
  res.redirect("/employees/profile/user")
}



}
const switchtoadd= async (req,res)=>{
  // if(req.session.employee===null||req.session.employee===undefined){
  //   res.render("admin_signin",{alert:true,text:"You have to sign in first before this action "})
  // }else if (!req.session.employee.isadmin){
  //   req.session.employee=null;
  //   res.render("admin_signin",{alert:true,text:"You have to sign in as admin first before this action "})
  // }else{
    
  // }
  res.render("add-employee");
}
const getorder= async (req,res)=>{
  try{
  const num=req.body.ordernum;
  const mail=req.body.cusmail;
  const ord=await orders.findOne({"num":num,customermail:mail});
  if(ord===null){
    res.redirect("/employees/profile/orders");
  }else{
    let arr=new Array();
    arr.push(ord);
    res.render("dashboard-orders",{orders:arr});
  }

}catch(err){

}
}
export { getallchatssel, getemployees, postemployees, confirmmail, empprof, changepass, getallchats ,emporder,GetAllemps,sectionsdetails,GetAllproducts,GetAllcustomers,emplogout,seremp,
  switchtoadd,getorder};
//formated


