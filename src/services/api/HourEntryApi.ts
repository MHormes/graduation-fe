import {AxiosInstance, AxiosResponse} from "axios";
import apiInstance from "./ApiInstance";
import {IContractPeriodOverview} from "../../models/IContractPeriodOverview.ts";
import {IProjectionOverview} from "../../models/IProjectionOverview.ts";
import {IPeriodAndProjectionOverview} from "../../models/IPeriodAndProjectionOverview.ts";

let api: AxiosInstance;
const prefix = "/hour-entries"


const debug = false;
export default class HourEntryApi {

    constructor() {
        api = apiInstance.init();
    }

    getContractPeriodAndProjectionOverview = async () => {
        let period = await this.getContractPeriodOverview();
        let projections = await this.getProjectionOverview();

        if (period && projections) {
            let overview: IPeriodAndProjectionOverview = {
                periodTotalClientHours: period.periodTotalClientHours,
                lastFoundDate: period.lastFoundDate,
                employeeOverviews: period.employeeOverviews,
                projections: projections
            }
            return overview;
        }
    }

    getContractPeriodOverview = async () => {
        let body = {
            startDate: "2023-10-04",
            endDate: "2024-04-04",
        }

        return api
            .post(prefix + "/period-overview", body)
            .then((response: AxiosResponse<IContractPeriodOverview>) => {
                if (debug) console.log(response.data);
                if (response.status === 200) {
                    return response.data;
                }
            })
            .catch((error) => {
                console.log(error)
                throw error;
            });
    }

    getProjectionOverview = async () => {
        let periods = {
            projectionPeriods: [
                {
                    startDate: "2024-04-04",
                    endDate: "2024-08-30",
                },
                {
                    startDate: "2024-08-31",
                    endDate: "2025-02-28",
                },
                {
                    startDate: "2025-03-01",
                    endDate: "2025-07-30",
                }
            ]
        }

        let responseList: IProjectionOverview[] = [];
        for(let period of periods.projectionPeriods) {

            let data = {
                projectionPeriods: [
                    {
                        startDate: period.startDate,
                        endDate: period.endDate,
                    }
                ]
            }

            let response = await api
                .post(prefix + "/projection-overview", data)
                .then((response: AxiosResponse<IProjectionOverview[]>) => {
                    if (debug) console.log(response.data);
                    if (response.status === 200) {
                        return response.data;
                    }
                })
                .catch((error) => {
                    console.log(error)
                    throw error;
                });
            if(response)
            responseList.push(response[0]);
        }

        return responseList;
        //todo use combined call after BE bug is resolved

        // return api
        //     .post(prefix + "/projection-overview", periods)
        //     .then((response: AxiosResponse<IProjectionOverview[]>) => {
        //         if (debug) console.log(response.data);
        //         if (response.status === 200) {
        //             return response.data;
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         throw error;
        //     });
    }
}