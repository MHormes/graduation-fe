import axios, {AxiosResponse} from "axios";
import {IHourEntry} from "../../models/IHourEntry.ts";

export interface IGeneralHoliday {
    date: string,
    localName: string
    hours: number;
    types: string[]
}

export default class GeneralHolidayApi {

    handleResponse = (response: AxiosResponse)  => {
        let processedResponse = [] as IHourEntry[];
        if (response && response.data) {
            response.data.map((holiday: IGeneralHoliday) => {
                if (holiday.types.includes("Public") && new Date(holiday.date).getDay() !== 0 && new Date(holiday.date).getDay() !== 6) {
                    processedResponse.push({
                        accDate: "",
                        activityName: "Nationale Feestdag",
                        approvalDate: "",
                        id: "",
                        lastEdited: "",
                        projectName: "",
                        remark: "",
                        typeOfHours: "",
                        date: holiday.date,
                        hours: 8
                    });
                }
            });
        }else{
            console.log("No data found in response");
            throw new Error("No data found in response");
        }
        return processedResponse;
    }

    handleError = (error: any) => {
        console.log(error);
        throw error;
    }


    getGeneralHolidaysInRange = async (startDate: Date, endDate: Date) => {
        let holidayHourEntries = [] as IHourEntry[];
        let yearsToFetch = [startDate.getFullYear(), endDate.getFullYear()];
        if (yearsToFetch[0] == yearsToFetch[1]) {
            await axios.get(`https://date.nager.at/Api/v3/publicholidays/${yearsToFetch[0]}/NL`)
                .then((response) => {
                    holidayHourEntries = this.handleResponse(response);
                })
                .catch((error) => {
                    this.handleError(error);
                });
        } else {
            for (let year of yearsToFetch) {
                await axios.get(`https://date.nager.at/Api/v3/publicholidays/${year}/NL`)
                    .then((response) => {
                        holidayHourEntries = holidayHourEntries.concat(this.handleResponse(response));
                    })
                    .catch((error) => {
                        this.handleError(error);
                    });
            }
        }
        return holidayHourEntries;
    }

    getGeneralHolidaysForYear = async (year: number) => {
        let holidayHourEntries = [] as IHourEntry[];
        try {
            const response = await axios.get(`https://date.nager.at/Api/v3/publicholidays/${year}/NL`);
            holidayHourEntries = this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
        return holidayHourEntries;
    }
}