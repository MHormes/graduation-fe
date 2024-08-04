import {IEmployeeContractPeriodOverview} from "./IEmployeeContractPeriodOverview.ts";

export interface IContractPeriodOverview {
    periodTotalClientHours: number;
    lastFoundDate: Date;
    employeeOverviews: IEmployeeContractPeriodOverview[];
}