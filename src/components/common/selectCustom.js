import Select from "react-select";
const customStyles = {
  control: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    height: "100%",
    width: "100%",
    fontSize: "14px"
  }),
  container: (base) => ({
    ...base,
    height: "100%",
    width: "100%",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 2,
    fontSize: "14px"
  }),
  // input:(base)=>({
  //   ...base,
  //   fontSize: '10px'
  // })
};

const SelectCustom = ({ options, label, name = "", value = "", onChange = () => { }, onInputChange=()=>{} , parentDivCss, required = false }) => {
  // console.log(value)
  const handleChange = (selectedOption) => {
    
    onChange(selectedOption.value,name)
  };

  return (
    <div className={`input_container px-1 ${parentDivCss}`}>
      <span className="input_label_pos">{label}{required && <span className="required-star"> * </span>}</span>
      <Select value={value} options={options} className={""} name={name} onChange={handleChange} onInputChange={onInputChange} styles={customStyles} />
    </div>
  )
}

export default SelectCustom