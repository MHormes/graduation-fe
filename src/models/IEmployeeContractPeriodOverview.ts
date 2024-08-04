import {IMonthOverview} from "./IMonthOverview.ts";

export interface IEmployeeContractPeriodOverview {
    employeeName: string;
    monthOverviews: IMonthOverview[];
}