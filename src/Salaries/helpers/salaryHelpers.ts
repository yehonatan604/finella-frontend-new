import { Dispatch } from "react";
import { TSalaryHours } from "../types/TSalaryHours";
import { THoursFromExcel } from "../../Common/types/THoursFromExcel";
import { TSalary } from "../types/TSalary";
import { TWorkplace } from "../../Workplaces/types/TWorkplace";

const calcTotalHours = (hours: TSalaryHours[]) => {
    return hours.reduce((acc, curr) => {
        const startTime = new Date(`2022-01-${curr.day}T${curr.startTime}`);
        const endTime = new Date(`2022-01-${curr.day}T${curr.endTime}`);
        const diff = endTime.getTime() - startTime.getTime();
        const hours = diff / 1000 / 60 / 60;
        return acc + hours;
    }, 0);
};

const addNewSalaryHour = (setSalaryHours: Dispatch<React.SetStateAction<TSalaryHours[]>>) => {
    setSalaryHours((prev: TSalaryHours[]) => {
        return [
            ...prev,
            {
                day: "",
                startTime: "",
                endTime: "",
                notes: "",
            },
        ];
    });
};

const removeSalaryHour = (index: number, setSalaryHours: Dispatch<React.SetStateAction<TSalaryHours[]>>) => {
    setSalaryHours((prev: TSalaryHours[]) => {
        const newSalaryHours = [...prev];
        newSalaryHours.splice(index, 1);
        return newSalaryHours;
    });
};

const addSalaryFromExcel = (data: unknown, setSalaryHours: Dispatch<React.SetStateAction<TSalaryHours[]>>) => {
    console.log(data);

    setSalaryHours(
        (data as THoursFromExcel[]).map((item: THoursFromExcel) => {
            return {
                day: item.date.split("/")[0],
                startTime: item.start,
                endTime: item.end,
                notes: "",
            };
        })
    );
};

const calcTotalSum = (salary: TSalary, workplaces: TWorkplace[]) => {
    const price =
        workplaces?.find((workplace) => workplace._id === salary.workPlaceId)
            ?.pricePerHour || 0;
    return price * calcTotalHours(salary.hours);
};

const getFullDate = (data: TSalary) => {
    const [month, year] = (data.date as string).split("-").map(Number);
    const today = new Date();
    return new Date(year, month - 1, today.getDate());
}

export { addNewSalaryHour, removeSalaryHour, addSalaryFromExcel, calcTotalHours, calcTotalSum, getFullDate };