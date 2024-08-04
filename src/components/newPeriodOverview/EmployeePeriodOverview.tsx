import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {IMonthOverview} from "../../models/IMonthOverview.ts";
//@ts-ignore
import {faBoxesPacking, faClock, faHeadSideCough, faUmbrellaBeach} from "@fortawesome/free-solid-svg-icons";
//@ts-ignore
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IProjectionOverview} from "../../models/IProjectionOverview.ts";

//@ts-ignore
const EmployeePeriodOverview = (props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [overview, setOverview] = useState(props.overview);
    const [projections, setProjections] = useState(props.projections);
    const [initialHours, setInitialHours] = useState<number>(props.periodTotalClientHours);
    const [projectionsInitialHours, setProjectionsInitialHours] = useState<number[]>([]);

    useEffect(() => {
        setInitialHours(props.periodTotalClientHours);
        setProjectionsInitialHours(props.projections.map((projection: IProjectionOverview) => projection.projectionTotalClientHours));
        setOverview(props.overview)
        setProjections(props.projections)
    }, [props.periodTotalClientHours, props.overview, props.projections]);

    const calculateHoursLeft = (index: number) => {
        //get period total hours
        let totalHours = props.periodTotalClientHours;

        //go over each month passed for supplied index
        for (let i = 0; i <= index; i++) {
            const currentYear = overview.monthOverviews[i].year;
            const currentMonthIndex = overview.monthOverviews[i].monthIndex;

            let toDeduct = overview.monthOverviews[i].workedHours;

            // if we already have a toDeductValue, there is no need to look at other values than the user input
            if (overview.monthOverviews[i].toDeductValue !== undefined) {
                toDeduct = overview.monthOverviews[i].toDeductValue;
            }
            // if we do not have a toDeductValue, we check if the date is in the future to take the max hours instead of the worked hours
            else if (currentYear > props.lastFoundDate.getFullYear() ||
                (currentYear === props.lastFoundDate.getFullYear() && currentMonthIndex >= (props.lastFoundDate.getMonth() + 1))) {
                toDeduct = overview.monthOverviews[i].maxWorkableHoursInMonth
                    - overview.monthOverviews[i].sickHours
                    - overview.monthOverviews[i].personalHours
                    - overview.monthOverviews[i].publicHolidayHours;

                overview.monthOverviews[i].toDeductValue = toDeduct;
            }

            totalHours -= toDeduct;


        }
        return totalHours;
    };

    const calculateHoursLeftProjection = (projectionIndex: number, monthIndex: number) => {
        let totalHours = props.projections[projectionIndex].projectionTotalClientHours;

        for (let i = 0; i <= monthIndex; i++) {
            let toDeduct;
            // if we already have a toDeductValue, there is no need to look at other values than the user input
            if (projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].toDeductValue !== undefined) {
                toDeduct = projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].toDeductValue;
            } else {
                toDeduct = projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].maxWorkableHoursInMonth
                    - projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].sickHours
                    - projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].personalHours
                    - projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].publicHolidayHours;

                projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews[i].toDeductValue = toDeduct;

            }

            totalHours -= toDeduct;
        }
        return totalHours;
    }

    const setHoursLeftStyling = (index: number) => {
        if (index === overview.monthOverviews.length - 1) {
            let hoursLeft = calculateHoursLeft(index);
            switch (true) {
                case hoursLeft > 0:
                    return "text-red-500";
                case hoursLeft < 0:
                    return "text-green-500";
                default:
                    return "text-grey-200";
            }
        }
    };

    const setHoursLeftStylingProjection = (projectionIndex: number, monthIndex: number) => {
        if (monthIndex === projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews.length - 1) {
            let hoursLeft = calculateHoursLeftProjection(projectionIndex, monthIndex);
            switch (true) {
                case hoursLeft > 0:
                    return "text-red-500";
                case hoursLeft < 0:
                    return "text-green-500";
                default:
                    return "text-grey-200";
            }
        }
    }

    // @ts-ignore
    const onFutureMonthChangePeriod = (index: number) => (event) => {
        const updatedMonthOverviews = overview.monthOverviews.map((monthOverview: IMonthOverview, i: number) => {
            if (i === index) {
                return {...monthOverview, toDeductValue: event.target.value};
            }
            return monthOverview;
        });
        console.log(updatedMonthOverviews)
        setOverview({...overview, monthOverviews: updatedMonthOverviews});
    }

    // @ts-ignore
    const onFutureMonthChangeProjection = (projectionIndex, monthIndex: number) => (event) => {
        const updatedMonthOverviews = projections[projectionIndex].employeeProjections[props.employeeIndex].monthOverviews.map((monthOverview: IMonthOverview, i: number) => {
            if (i === monthIndex) {
                return {...monthOverview, toDeductValue: event.target.value};
            }
            return monthOverview;
        });
        console.log(updatedMonthOverviews)
        setProjections(projections.map((projection: IProjectionOverview, projIndex: number) => {
            if (projIndex === projectionIndex) {
                return {
                    ...projection,
                    employeeProjections: projection.employeeProjections.map((employeeProjection, empProjIndex) =>
                        empProjIndex === props.employeeIndex
                            ? {...employeeProjection, monthOverviews: updatedMonthOverviews}
                            : employeeProjection
                    )
                };
            }
            return projection;
        }));
    }

    return (
        <div className={"flex rounded-xl bg-gray-800 w-fit lg:w-full"}>

            {/*dataHolder for first row just containing the months*/}
            {props.dataHolder ? (
                    <>
                        <span className={"w-48 text-lg p-2 bg-gray-700 rounded-l-lg"}>
                            Period total: {initialHours}
                            <br/>
                            (monthly max)
                        </span>

                        {overview.monthOverviews.map((monthOverview: IMonthOverview) => (
                            <span className={"w-28 p-2 bg-gray-700"} key={`${monthOverview.monthIndex}-${monthOverview.year}`}>
                            <p className={`text-lg ${(props.lastFoundDate.getFullYear() == monthOverview.year && props.lastFoundDate.getMonth() + 1 <= monthOverview.monthIndex) || props.lastFoundDate.getFullYear() < monthOverview.year ? "italic text-cyan-300" : ""}`}>
                                {monthOverview.monthIndex}/{monthOverview.year}
                                <br/>
                                ({monthOverview.maxWorkableHoursInMonth})
                            </p>
                            </span>
                        ))}

                        {projections.map((projection: IProjectionOverview, index:number) => (
                            <>
                                <span className={`p-2 w-48 text-lg italic text-cyan-500 ${index % 2 === 0 ? "" : "bg-gray-700"}`}>
                                    Period total: {projectionsInitialHours[index]}
                                </span>
                                {projection.employeeProjections[props.employeeIndex].monthOverviews.map((monthOverview: IMonthOverview) => (
                                    <span className={`p-2 w-28 ${index % 2 === 0 ? "" : "bg-gray-700"}`} key={`${monthOverview.monthIndex}-${monthOverview.year}`}>
                                    <p className={`text-lg ${(props.lastFoundDate.getFullYear() == monthOverview.year && props.lastFoundDate.getMonth() + 1 <= monthOverview.monthIndex) || props.lastFoundDate.getFullYear() ? "italic text-cyan-500" : ""}`}>
                                        {monthOverview.monthIndex}/{monthOverview.year}
                                        <br/>
                                        ({monthOverview.maxWorkableHoursInMonth})
                                    </p>
                                    </span>
                                ))}
                            </>
                        ))}
                    </>
                ) :

                // return overview of employee, aligning with the dataHolder header
                (
                    <>
                        {/*First column, containing name and explanation of values*/}
                        <span className={"sticky left-0 w-48 bg-gray-700 p-2 rounded-l-lg"} onClick={() => setShowDetails(!showDetails)}>
                        <h1 className={""}>{overview.employeeName}</h1>
                            {/*hide text on default, show on click*/}
                            {showDetails &&
                                <>

                                    <p>Worked:</p>
                                    <p>Sick:</p>
                                    <p>Personal:</p>
                                    <p>Public holiday:</p>
                                </>}

                            <p>Hours left:</p>
                        </span>

                        {/*map every month of the employee overview*/}
                        {overview.monthOverviews.map((monthOverview: IMonthOverview, index: number) => (
                            <span className={"p-2 w-28 bg-gray-700"} key={`${monthOverview.monthIndex}-${monthOverview.year}`}>

                                {/*placeholder to align content*/}
                                <br/>
                                {/*hide extra info on default, show on click*/}
                                {showDetails &&
                                    <>

                                        {props.lastFoundDate.getFullYear() <= monthOverview.year && props.lastFoundDate.getMonth() + 1 <= monthOverview.monthIndex ?
                                            <input className={"pr-1 w-2/3 rounded-sm bg-gray-600"} type={"number"}
                                                   max={200} min={0}
                                                   value={overview.monthOverviews[index].toDeductValue}
                                                   onChange={onFutureMonthChangePeriod(index)}>
                                            </input>
                                            :
                                            <p>{monthOverview.workedHours}</p>
                                        }
                                        <p>{monthOverview.sickHours}</p>
                                        <p>{monthOverview.personalHours}</p>
                                        <p>{monthOverview.publicHolidayHours}</p>
                                    </>}
                                {/*display the amount of hours left after this specific month*/}
                                <p className={setHoursLeftStyling(index)}>{calculateHoursLeft(index)}</p>
                        </span>
                        ))}

                        {projections.map((projection: IProjectionOverview, projectionIndex: number) => (
                            <>
                                <span className={`p-2 w-48 ${projectionIndex % 2 === 0 ? "" : "bg-gray-700"} `}>
                                {/*<br/>*/}
                                {/*    {showDetails &&*/}
                                {/*        <>*/}
                                {/*            <p>Worked:</p>*/}
                                {/*            <p>Sick:</p>*/}
                                {/*            <p>Personal:</p>*/}
                                {/*            <p>Public holiday:</p>*/}

                                {/*            /!*<p><FontAwesomeIcon icon={faClock}/></p>*!/*/}
                                {/*            /!*<p><FontAwesomeIcon icon={faHeadSideCough}/></p>*!/*/}
                                {/*            /!*<p><FontAwesomeIcon icon={faUmbrellaBeach}/></p>*!/*/}
                                {/*            /!*<p><FontAwesomeIcon icon={faBoxesPacking}/></p>*!/*/}
                                {/*        </>*/}
                                {/*    }*/}

                                {/*    <p>Hours left:</p>*/}
                                </span>

                                {/*map every month of the employee projection*/}
                                {projection.employeeProjections[props.employeeIndex].monthOverviews.map((monthOverview: IMonthOverview, monthIndex: number) => (
                                    <span className={`p-2 w-28 ${projectionIndex % 2 === 0 ? "" : "bg-gray-700"}`}
                                          key={`${monthOverview.monthIndex}-${monthOverview.year}`}>

                                        {/*placeholder to align content*/}
                                        <br/>
                                        {/*hide extra info on default, show on click*/}
                                        {showDetails &&
                                            <>

                                                <input className={"pr-1 w-2/3 rounded-sm bg-gray-600"} type={"number"}
                                                       max={200} min={0}
                                                       value={projection.employeeProjections[props.employeeIndex].monthOverviews[monthIndex].toDeductValue}
                                                       onChange={onFutureMonthChangeProjection(projectionIndex, monthIndex)}>
                                                </input>
                                                <p>{monthOverview.sickHours}</p>
                                                <p>{monthOverview.personalHours}</p>
                                                <p>{monthOverview.publicHolidayHours}</p>
                                            </>}
                                        {/*display the amount of hours left in the period*/}
                                        <p className={setHoursLeftStylingProjection(projectionIndex, monthIndex)}>{calculateHoursLeftProjection(projectionIndex, monthIndex)}</p>

                                    </span>
                                ))}
                            </>
                        ))}
                    </>
                )}
        </div>
    )
};

EmployeePeriodOverview.propTypes = {
    lastFoundDate: PropTypes.object.isRequired,
    overview: PropTypes.object.isRequired,
    periodTotalClientHours: PropTypes.number.isRequired,
    projections: PropTypes.array.isRequired,
    employeeIndex: PropTypes.number.isRequired,
    dataHolder: PropTypes.bool.isRequired
};

export default EmployeePeriodOverview;
