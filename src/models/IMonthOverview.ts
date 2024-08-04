export interface IMonthOverview {
    monthIndex: number;
    year: number
    workedHours: number;
    sickHours: number;
    personalHours: number;
    publicHolidayHours: number;
    clientHoursInMonth: number;
    maxWorkableHoursInMonth: number;
    toDeductValue: number;
}
