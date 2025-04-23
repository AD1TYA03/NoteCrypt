import CryptoJS from "crypto-js";



const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encrypt=(text)=>{
    if(!text) return '';
    
    return CryptoJS.AES.encrypt(text,SECRET_KEY).toString();
} 

export const decrypt = (cipherText)=>{
    if(!cipherText) return '';

    try{
        const bytes = CryptoJS.AES.decrypt(cipherText,SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
    }
    catch(error){
        console.error("Error Decrypting text",error)
        return '';
    }
    

}