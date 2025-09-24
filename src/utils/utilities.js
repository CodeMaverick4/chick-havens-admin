import CryptoJS from "crypto-js";
const secretKey = "aslkdjad"

export const encryptStringtoAES = (str) => {
  if (!str) return false;
  const encrypted = CryptoJS.AES.encrypt(str, process.env.REACT_APP_SECRET_KEY).toString();
  const urlSafeEncrypted = encodeURIComponent(encrypted); 
  return urlSafeEncrypted;
};


export const decryptAEStoString = (str) => {
  if (!str) return false;
  try {
    const decodedStr = decodeURIComponent(str); 
    const bytes = CryptoJS.AES.decrypt(decodedStr, process.env.REACT_APP_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return false;
  }
};
