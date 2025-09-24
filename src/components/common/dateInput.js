import { useRef } from "react"

const DateInput = ({
    name = "",
    label,
    onChange=()=>{},
    required = false,
    min = '',
    max = '',
    value=""

}) => {
    const inputRef = useRef(null);
    const handleClick = () => {
        inputRef.current?.showPicker();
    }
    return (
        <div className="input_container cursor-pointer" onClick={handleClick}>
            <span className="input_label_pos">{label}{required && <span className="required-star"> * </span>}</span>
            <input type="Date" className=" cursor-pointer" name={name} value={value} ref={inputRef} min={min} max={max} onChange={onChange}/>
        </div>
    )
}
export default DateInput