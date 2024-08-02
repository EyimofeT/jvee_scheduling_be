export function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters from the input
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the number starts with "234"
  if (cleanPhoneNumber.startsWith('234')) {
    return cleanPhoneNumber;
  } else if (cleanPhoneNumber.length >= 10) {
    // If not, ensure the number is at least 10 digits long (including the country code)
    return '234' + cleanPhoneNumber.slice(-10);
  } else {
    // Handle cases where the input is not valid
    return 'Invalid phone number';
  }
}

export function convertPhoneNumber(phoneNumber) {
  // Remove the "+234" prefix if present
  if (phoneNumber.startsWith("+234")) {
    return '0'+phoneNumber.slice(4);
  }
  // Return the input as-is if it doesn't start with "+234"
  return phoneNumber;
}

export function hideMiddleDigits(phoneNumber) {
  const countryCode = phoneNumber.slice(0, 3);
  const middleDigits = '******';
  const lastDigits = phoneNumber.slice(-4);
  
  return countryCode + middleDigits + lastDigits;
}

export function hashBvn(bvn){
  // if (typeof phoneNumber !== 'string' || phoneNumber.length !== 11) {
  //   return 'Invalid phone number';
  // }
  // bvn = parseInt(bvn)
  
  const firstDigits = bvn.slice(0, 3);
  const lastDigits = bvn.slice(-4);
  
  return `${firstDigits}****${lastDigits}`;
}