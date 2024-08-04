import {useEffect, useState} from "react";
import HourEntryApi from "../../services/api/HourEntryApi.ts";
import EmployeePeriodOverview from "../../components/newPeriodOverview/EmployeePeriodOverview.tsx";
import {IPeriodAndProjectionOverview} from "../../models/IPeriodAndProjectionOverview.ts";

const hourApi = new HourEntryApi();

const ContractPeriodsOverview = () => {
    const [periodAndProjectionOverview, setPeriodAndProjectionOverview] = useState<IPeriodAndProjectionOverview>({
        periodTotalClientHours: 576,
        lastFoundDate: new Date(),
        employeeOverviews: [],
        projections: [
            {
                projectionTotalClientHours: 0,
                employeeProjections: [],
            },
        ],
    });

    const fetchContractPeriodsOverviews = async () => {
        const overview = await hourApi.getContractPeriodAndProjectionOverview()
            .catch((error) => {
                console.error(error);
                alert(error.message);
            });
        if (overview) {
            setPeriodAndProjectionOverview(overview);
        }
    };

    useEffect(() => {
        console.log("Periods overview page loaded");
        //@ts-ignore
        fetchContractPeriodsOverviews().then(r => console.log("Fetched period overviews"));
    }, []);

    const renderDataHolder = () => {
        if (periodAndProjectionOverview.employeeOverviews.length > 0) {
            const firstEmployeeOverview = periodAndProjectionOverview.employeeOverviews[0];
            const firstEmployeeProjection = periodAndProjectionOverview.projections;
            return (
                <div className={"p-2"}>
                    <EmployeePeriodOverview
                        lastFoundDate={new Date(periodAndProjectionOverview.lastFoundDate)}
                        periodTotalClientHours={periodAndProjectionOverview.periodTotalClientHours}
                        projections={firstEmployeeProjection}
                        employeeIndex={0}
                        overview={firstEmployeeOverview}
                        dataHolder={true}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className={"card bg-base-300 m-1 w-fit"}>
                <div className="card-body text-white">

                    <div className={"absolute top-0 left-0 w-fit bg-gray-600 rounded-lg p-2 m-2 ml-10"}>
                        <p className={"font-bold text-md p-1"}>{`Last hour entry: ${periodAndProjectionOverview.lastFoundDate}`}</p>
                    </div>
                    {/*todo replace with iterative blocks instead of hardcode*/}
                    {/*period holder*/}
                    <div className={"flex"}>
                        <div className={"mt-10 mr-96 w-fit bg-gray-600 rounded-lg p-2 m-2"}>
                            <p className={"font-bold text-md p-1"}>{`Period: 2023-10-04 / 2024-04-03`}</p>
                        </div>
                        {/*projection period holders*/}
                        <div className={"mt-10 ml-80 mr-96 w-fit bg-gray-600 rounded-lg p-2 m-2"}>
                            <p className={"font-bold text-md p-1"}>{`Projection: 2024-04-04 / 2024-08-30`}</p>
                        </div>
                        <div className={"mt-10 ml-20 mr-96 w-fit bg-gray-600 rounded-lg p-2 m-2"}>
                            <p className={"font-bold text-md p-1"}>{`Projection: 2024-08-31 / 2025-02-28`}</p>
                        </div>
                        <div className={"mt-10 ml-72 w-fit bg-gray-600 rounded-lg p-2 m-2"}>
                            <p className={"font-bold text-md p-1"}>{`Projection: 2024-03-01 / 2025-07-30`}</p>
                        </div>
                    </div>

                    {renderDataHolder()}

                    {periodAndProjectionOverview && periodAndProjectionOverview.employeeOverviews.length > 0 &&
                        periodAndProjectionOverview.employeeOverviews.map((overview, index) => (
                            <div key={overview.employeeName} className={"p-2"}>
                                <EmployeePeriodOverview
                                    lastFoundDate={new Date(periodAndProjectionOverview.lastFoundDate)}
                                    periodTotalClientHours={periodAndProjectionOverview.periodTotalClientHours}
                                    overview={overview}
                                    projections={periodAndProjectionOverview.projections}
                                    employeeIndex={index}
                                    dataHolder={false}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
};

export default ContractPeriodsOverview;
