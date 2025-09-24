export const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_-])[A-Za-z\d@$!%*?&#^_-]{8,}$/;
export const userNameRegex = /^[a-zA-Z0-9_]{3,16}$/;
export const phoneNumberRegex = /^\d{10}$/;
export const allowSingleSpace = /^(?!.* {2,}).*$/;
export const onlyNumber = /^\d*$/;
export const onlyAlphaWithSpace = /^[A-Za-z ]+$/;
export const userName = /^[a-zA-Z0-9_]{3,}$/
