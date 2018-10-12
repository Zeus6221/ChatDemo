import { Status } from "./status.enum";

export interface User {
    Uid: any;
    Nick: string;
    Avatar: string;
    Email: string;
    Age?: number;
    Friend?: boolean;
    Password?: string;
    active?: boolean;
    status?: Status;
}
