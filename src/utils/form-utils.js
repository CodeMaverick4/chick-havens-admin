
// const capitalizingKey = (key)=>{
//   return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) 
// }

const capitalizingKey = (key) => {
  return key
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Insert spaces before capital letters (for camelCase or PascalCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Capitalize the first letter of each word
    .replace(/\b\w/g, char => char.toUpperCase());
};



export const trimFormData = (formData)=>{
  let newFormData = {}
  for (let key in formData) {    
    newFormData[key] = String(formData[key]).trim();
  }
  // setFormData(newFormData)
  return newFormData;

}

export const checkEmpty = (formData,formError,setFormError, skip = []) => {  
  let errors = {}
  for (let key in formData) {    
    if (!skip.includes(key) && formData[key] == "") {
      errors[key] = `${capitalizingKey(key)} is required`;
    }
  }
  setFormError(prev=> ({...prev,...errors}))
  return {...formError,...errors}
}

export const checkError = (formError) => {
  const errors = Object.values(formError)
  for (let err of errors) {
    if (err !== "") {
      return true
    }
  }
  return false
}

export const handleFormInput = (
  e,
  formData,
  errorData = null,
  validate = null,
  errorMessage = "",
  fieldRequired=true
) => {
  
  if (validate && !validate.test(e.target.value)) {
    return {
      updatedValues: { ...formData, [e.target.name]: e.target.value },
      updatedError: {
        ...errorData,
        [e.target.name]:
          e.target.value === "" ? fieldRequired ? `${capitalizingKey(e.target.name)} is required`:'' : errorMessage,
      },
    };
  }

  return {
    updatedValues: { ...formData, [e.target.name]: e.target.value },
    updatedError: {
      ...errorData,
      [e.target.name]:
        e.target.value === "" ? fieldRequired ? `${capitalizingKey(e.target.name)} is required` : '' : "",
    },
  };
};

export const handleFormPreRequisite = (formData,setFormData,formError,setFormError,skipField=[])=>{
  const updatedFormData = trimFormData(formData);
  setFormData(updatedFormData)  
  const updatedFormError = checkEmpty(updatedFormData,formError,setFormError,skipField);  
  return checkError(updatedFormError)
}