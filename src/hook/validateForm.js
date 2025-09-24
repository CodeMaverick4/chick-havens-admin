// // validateForm.js
// const validateForm = ({ formData = {}, skipFields = [] }) => {
//   const updatedErrors = {};
//   const updatedFormData = {};

//   // Build trimmed data and collect errors at the same time
//   for (const key in formData) {
//     if (skipFields.includes(key)) {
//       // keep as-is for skipped fields
//       updatedFormData[key] = formData[key];
//       continue;
//     }

//     const trimmed = String(formData[key] ?? "").trim();
//     updatedFormData[key] = trimmed;

//     if (trimmed === "") {
//       updatedErrors[key] = "This field is required";
//     }
//   }

//   const hasError = Object.keys(updatedErrors).length > 0;
//   return { updatedErrors, updatedFormData, hasError };
// };

// export default validateForm;

const validateForm = ({ formData, skipFields }) => {
    let updatedErrors = {}
    let updatedFormData = {}

    // check empty 
    let hasError = false;
    for (let key in formData) {
        if (!skipFields.includes(key) && formData[key] == "") {
            updatedErrors[key] = `This field is required`;
            hasError = true;
        }
    }
    if (hasError) return { updatedErrors, updatedFormData, hasError }

    // trim data 
    for (let key in formData) {
        if (!skipFields.includes(key)) {
            updatedFormData[key] = String(formData[key])
                .trim()
                .replace(/\s+/g, " ");
        }
    }


    return { updatedErrors, updatedFormData, hasError }
}
export default validateForm