import axios from "axios";

//Axios Post Request Function- takes in url, data and headers
export async function sendPostRequest(url, data, headers) {
  try {
    // console.log("url: " +url)
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    // console.log("error")
    // console.log(error.response)
    // throw error;
    return error.response.data;
  }
}