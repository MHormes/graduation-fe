import PropTypes from "prop-types";

//@ts-ignore
const CardButton = (props) => {

    const handleClick = () => {
        props.buttonAction();
    }

    return (
        <div className={`card-actions ${props.alignLeft ? "justify-start" : "justify-end"} ${props.alignCenter ? "justify-center" : "justify-start"}`}>
            <button className={"btn text-white m-1 text-xs"}
                    onClick={() => handleClick()}>
                {props.buttonText}
            </button>
        </div>
    );
}

CardButton.propTypes = {
    alignCenter: PropTypes.bool,
    alignLeft: PropTypes.bool,
    buttonText: PropTypes.string.isRequired,
    buttonAction: PropTypes.func.isRequired
}

export default CardButton;