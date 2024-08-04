import {IEmployeeContractPeriodOverview} from "./IEmployeeContractPeriodOverview.ts";

export interface IProjectionOverview {
    projectionTotalClientHours: number;
    employeeProjections: IEmployeeContractPeriodOverview[];
}