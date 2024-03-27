import { Goal } from "./goal";

export interface Summary extends Goal {
    hoursDone: number
}

export interface SummaryDisplay extends Summary {
    hoursDoneStyle?: string;
    goalStyle?: string;
}
