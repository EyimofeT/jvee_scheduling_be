import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import { dirname } from "path";

//this function returns the value of the key specified in the env_config.json file
export function getenv(variable) {
  const value = readJSONFile(variable);
return value
}

//this function is the business logic behind getting the value of key specified in the getenv function
function readJSONFile(key) {
  // Get the current working directory
    const currentDirectory = process.cwd();
  // Navigate upwards by multiple levels
    const rootDirectory = path.dirname(path.dirname(path.dirname(currentDirectory)));
    // console.log(process.cwd())

  try {
    // __filename=fileURLToPath(import.meta.url)
    const __dirname=dirname(fileURLToPath(import.meta.url))
    
    const filePath= path.resolve(__dirname,'..','..','env_config.json')

    // const filePath = path.join(rootDirectory, "/env_config.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);
    return jsonData[key];
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

export const format_req_body = (req, res) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].replace(/\s/g, "");
    }
  }
}
