
import {Emp} from "../models/Employees.js";
 


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



  const postemployees = async (req, res)=> {
    const obj={Name:req.body.Name,
   Email:req.body.Email,
    Address:req.body.Address,
    Phone:req.body.Phone
    }
        const employee=new Emp(obj);
    
    try{
    await employee.save();
    console.log("saved successfully");
    }catch(err){
    console.log(err);
    }

  }



  const getemployees= (req, res) => {
 
    employee.find()
      .then((result) => {
        res.render("index", { arrEmp: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }





  // const getemployees= async (req, res) => {
 
  //   let  current_employee;
  //   console.log(req.body.phone);
  //   console.log(req.body.Address);
  //    await Emp.findOne({Phone:req.body.phone,Address:req.body.Address}).then((result)=>{
  //     current_employee=result;
  //    })
  //    console.log(current_employee);
  //    if(current_employee===undefined||current_employee===null){
  //     res.send("invalid phone or address ");
  //    }else{
  //     req.session.signed_employee=current_employee;
  //     res.redirect("/products/All");
  //    }
  //    }

  export {getemployees,postemployees};