import PropTypes from "prop-types";

//@ts-ignore
const CardTitle = (props) => {
    return (
        <>
            <h1 className={`card-title text-md ${props.centered?'justify-center':'justify-left'}`}>
                {props.cardTitle}
            </h1>
        </>
    );
};

CardTitle.propTypes = {
    centered: PropTypes.bool,
    cardTitle: PropTypes.string.isRequired,
};

CardTitle.defaultProps = {
    centered: false,
};

export default CardTitle;