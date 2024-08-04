import {IEmployeeContractPeriodOverview} from "./IEmployeeContractPeriodOverview.ts";
import {IProjectionOverview} from "./IProjectionOverview.ts";

export interface IPeriodAndProjectionOverview {
    periodTotalClientHours: number;
    lastFoundDate: Date;
    employeeOverviews: IEmployeeContractPeriodOverview[];
    projections: IProjectionOverview[];
}