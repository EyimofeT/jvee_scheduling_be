import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";
import { JWT } from 'google-auth-library'
// import crypto 
// import { getenv } from "../apis/core/helper.js";
import { customAlphabet } from 'nanoid';
import { nanoid } from "nanoid";
import { getenv } from "../../core/helper.js";
import { createDateFromString, formatDate, getDaysOfMonthFromDate, generate_time_slots, extract_hour_from_datetime, filter_times_by_hour , create_date_time_string, is_today, filter_by_current_hour, validate_and_update_date} from "./helper_function.js";


const CREDENTIALS = JSON.parse(fs.readFileSync('jvee-431218-70c41f8e44e2.json'))
const RESPONSE_SHEET_ID = getenv('RESPONSE_SHEET_ID')
const serviceAccountAuth = new JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets'
  ]
})
export const doc = new GoogleSpreadsheet(RESPONSE_SHEET_ID, serviceAccountAuth)


export const get_services_from_google_sheet = async () => {

  try {
    await doc.loadInfo()
    const sheet_title = "SERVICES"
    const sheet = doc.sheetsByTitle[sheet_title]

    let rows = await sheet.getRows()
    let row_data = []

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      let row_data_entry = row._rawData
      let entry = {
        id: row_data_entry[0],
        category: row_data_entry[1],
        service: row_data_entry[2],
        price: row_data_entry[3],
        specific_duration: row_data_entry[4] !== null && row_data_entry[4] !== undefined && row_data_entry[4].toLowerCase() !== 'false'
      }
      row_data.push(entry)
    }
    // console.log(rows.data.values)
    return row_data

  } catch (err) {
    console.log("error trying to get services :" + err)
    return false
  }
  finally {
  }
}

export const get_services_from_google_sheet_by_service_id = async (service_id) => {

  try {
    await doc.loadInfo()
    const sheet_title = "SERVICES"
    const sheet = doc.sheetsByTitle[sheet_title]

    let rows = await sheet.getRows()
    let service

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      let row_data_entry = row._rawData
      if (row_data_entry[0] == service_id) {
        service = {
          id: row_data_entry[0],
          category: row_data_entry[1],
          service: row_data_entry[2],
          price: row_data_entry[3],
          specific_duration: row_data_entry[4] !== null && row_data_entry[4] !== undefined && row_data_entry[4].toLowerCase() !== 'false'
        }
        break
      }

    }

    return service

  } catch (err) {
    console.log("error trying to get services :" + err)
    return false
  }
  finally {
  }
}


export const write_newsletter = async (email) => {

  try {
    await doc.loadInfo()

    const sheet_title = "NEWSLETTER"
    const sheet = doc.sheetsByTitle[sheet_title]
    let date_created = formatDate(new Date())
    let data = {
      EMAIL: email,
      DATE_CREATED: date_created
    }
    const add_row = await sheet.addRow(data);
    return true
  } catch (err) {
    console.log("error trying to subscribe newsletter :" + err)
    return false
  }
  finally {
  }
}

export const write_leads = async (name, phone, service) => {

  try {
    await doc.loadInfo()

    const sheet_title = "LEADS"
    const sheet = doc.sheetsByTitle[sheet_title]
    let date_created = formatDate(new Date())
    let data = {
      NAME: name,
      PHONE: phone,
      SERVICE: service,
      DATE_CREATED: date_created
    }
    const add_row = await sheet.addRow(data);
    return true
  } catch (err) {
    console.log("error trying to get services :" + err)
    return false
  }
  finally {
  }
}


export const get_available_time_slots = async (start_date, days, start_time, end_time, service_id, month_plus = 0) => {
  try {
    // Load the Google Sheets document
    await doc.loadInfo();
    
    // Define sheet and helper functions
    const sheet_title = "BOOKINGS";
    const sheet = doc.sheetsByTitle[sheet_title];
    start_date = validate_and_update_date(start_date)
    const new_start_date = createDateFromString(start_date, start_time, month_plus);
    const service = await get_services_from_google_sheet_by_service_id(service_id);
    let general_time = generate_time_slots(days);

    // console.log(new_start_date)

    // Add additional time slots if no specific duration is set
    if (!service.specific_duration) {
      general_time.push('19:15', '19:30');
    }

    // Get days of the month based on the start date and specified days
    const select_days = getDaysOfMonthFromDate(new_start_date, days);

    let available_slots = [];

    for (let select_day of select_days) {
      const date = new Date(select_day).toISOString().split('T')[0];
      let booked_time = [];
      let available_times = [...general_time];
      
      // Fetch all rows and filter by the specific date
      const rows = await sheet.getRows();
      const filteredRows = rows
        .filter(row => new Date(row._rawData[8]).toISOString().split('T')[0] === date)
        .map(row => row._rawData[8]);

      // Collect booked times
      booked_time = filteredRows;


      if(is_today(select_day)){
        available_times = filter_by_current_hour(available_times)
      }
     
      // If no booked times, all times are available
      if (booked_time.length === 0) {
        available_slots.push({
          date,
          time_slots: available_times
        });
        continue;
      }

      // Remove times that are booked
      for (let time of booked_time) {
        available_times = await filter_times_by_hour(available_times, extract_hour_from_datetime(time));
      }

      available_slots.push({
        date,
        time_slots: available_times
      });
    }
    return available_slots;
  } catch (err) {
    console.error("Error trying to get available time slots:", err);
    return false;
  }
};


export const write_reservation = async (name, phone, email, notes, service_id, date , time) => {

  try {
    await doc.loadInfo()
    const sheet_title = "BOOKINGS"
    const sheet = doc.sheetsByTitle[sheet_title]
    let date_created = formatDate(new Date())

    const alphabet = 'abcdefghijklmnpqrstuvwxyz123456789';
    let nanoid =customAlphabet(alphabet, 9); 

    const service = await get_services_from_google_sheet_by_service_id(service_id);
    // console.log(service)

    let data = {
      ID : nanoid().toLowerCase(),
      NAME: name,
      PHONE: phone,
      EMAIL : email,
      NOTES : notes,
      DATE : date, 
      TIME : time,
      DATETIME : create_date_time_string(date,time),
      SERVICE: service.service,
      SERVICE_ID : service.id,
      DATE_CREATED: date_created
    }
    const add_row = await sheet.addRow(data);
    return true
  } catch (err) {
    console.log("error trying to get services :" + err)
    return false
  }
  finally {
  }
}

// get_available_time_slots(start_date, days, start_time, end_time, service_id)
// export const get_available_time_slots = async (start_date, days, start_time, end_time, service_id, month_plus) => {
//   //month_plus generates for next month
//   try {
//     await doc.loadInfo()
//     if (!month_plus) month_plus = 0

//     const sheet_title = "BOOKINGS"
//     const sheet = doc.sheetsByTitle[sheet_title]

//     let new_start_date = createDateFromString(start_date, start_time, month_plus)
//     let service = await get_services_from_google_sheet_by_service_id(service_id)
//     let generaL_time = generate_time_slots(days)

//     if (!service.specific_duration) {
//       generaL_time.push('19:15')
//       generaL_time.push('19:30')
//     }
//     // console.log(generaL_time)


//     // let new_end_date = createDateFromString(start_date, start_time)

//     // console.log(new_start_date)
//     // console.log(service)
//     // console.log(days)

//     // let days_of_month = await getDaysOfMonthFromDate('2024-08-04T08:00:00.000Z', days)

//     //  const new_start_date = '2024-08-02T08:00:00.000Z';
//     // const days = ['monday', 'wednesday'];
//     const select_days = getDaysOfMonthFromDate(new_start_date, days);
//     // console.log(select_days)


//     let available_slots = []

//     for (let select_day of select_days) {
//       let booked_time = []
//       let date = new Date(select_day).toISOString().split('T')[0]
//       let generaL_time_copy = generaL_time
//       const rows = await sheet.getRows();
//       let new_general_time = generaL_time

//       // Filter rows based on whether the date part of DATETIME column matches today's date
//       const filteredRows = rows
//         .filter(row => {
//           const rowDate = new Date(row._rawData[8]).toISOString().split('T')[0];
//           return rowDate === date;
//         })
//         .map(row => row._rawData);

//       for (let filtered_row of filteredRows) {
//         booked_time.push(filtered_row[8])
//       }


//       if (booked_time.length < 1) {
//         //assumes no booked time, so all days are free
//         let slots = {
//           date,
//           time_slots : new_general_time
//         }
  
//         available_slots.push(slots)
//         continue
//       }
//       console.log(booked_time)

      
//       for (let time of booked_time) {
//         new_general_time = await filter_times_by_hour(new_general_time, extract_hour_from_datetime(time))
//       }

//       let slots = {
//         date,
//         time_slots : new_general_time
//       }

//       available_slots.push(slots)

//     }
//     return available_slots
//   } catch (err) {
//     console.log("error trying to get services :" + err)
//     return false
//   }
//   finally {
//   }
// }


