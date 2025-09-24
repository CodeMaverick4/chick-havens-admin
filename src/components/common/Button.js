import React from "react";
import ButtonLoader from "./Loader"

const Button = ({ isLoading = false, buttonType = 'button', type = "secondary", extraCss = "", icon = "", label = "", onClick = () => { } }) => {
    // console.log("button rendring");
    return (
        <>
            <button type={buttonType}
                className={`${type === "primary" ? "button-primary" : "button-secondary"} button-base ${extraCss}`} onClick={onClick}>
                {isLoading ? <ButtonLoader /> : <>{icon} {label}</> }
            </button>

        </>
    )
}
export default React.memo(Button)