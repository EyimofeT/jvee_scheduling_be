import { get_services_from_google_sheet, write_leads, get_available_time_slots,write_newsletter, write_reservation } from "../../api_services/google_sheet/connect.js";

export const get_services = async (req, res) => {
   try{
    let services = await get_services_from_google_sheet()

    return res.status(200).json({
        code: 200,
        responseCode: "00",
        status: "success",
        message: "Services fetched successfully",
        data: {services},
      });


   } catch (err) {
      return res.status(200).json({
        code: 400,
        responseCode: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } 
    finally {
    }
  }


export const post_leads = async (req, res) => {
    try{

      let {name, phone, service} = req.body
     let store_leads = await write_leads(name, phone, service)
 
     return res.status(200).json({
         code: 200,
         responseCode: "00",
         status: "success",
         message: "Lead stored successfully",
         data: {name, phone, service}
       });
 
 
    } catch (err) {
       return res.status(200).json({
         code: 400,
         responseCode: err.code,
         status: "failed",
         message: err.message,
         error: "An Error Occured!",
       });
     } 
     finally {
     }
   }
 
   export const get_available_time = async (req, res) => {
    try{

    let {start_date, days, start_time, end_time, service_id,month_plus} = req.body
    
    let available_time = await get_available_time_slots(start_date, days, start_time, end_time, service_id,month_plus)
 
     return res.status(200).json({
         code: 200,
         responseCode: "00",
         status: "success",
         message: "Available slots fetched successfully",
         data: {available_time}
       });
 
 
    } catch (err) {
       return res.status(200).json({
         code: 400,
         responseCode: err.code,
         status: "failed",
         message: err.message,
         error: "An Error Occured!",
       });
     } 
     finally {
     }
   }

   export const post_newsletter = async (req, res) => {
    try{

      let {email} = req.body
     let store_leads = await write_newsletter(email)
 
     return res.status(200).json({
         code: 200,
         responseCode: "00",
         status: "success",
         message: "Subscription successful",
         data: {email}
       });
 
 
    } catch (err) {
       return res.status(200).json({
         code: 400,
         responseCode: err.code,
         status: "failed",
         message: err.message,
         error: "An Error Occured!",
       });
     } 
     finally {
     }
   }

// reserve_available_time
   export const reserve_available_time = async (req, res) => {
    try{

    let {name, phone, email, notes, service_id, date, time} = req.body
    // console.log("calling write")
    let reservation = await write_reservation(name, phone, email, notes, service_id, date , time)
 
    return res.status(200).json({
        code: 200,
        responseCode: "00",
        status: "success",
        message: "Reservation created successfully",
        data: {reservation}
      });
 
 
    } catch (err) {
       return res.status(200).json({
         code: 400,
         responseCode: err.code,
         status: "failed",
         message: err.message,
         error: "An Error Occured!",
       });
     } 
     finally {
     }
   }