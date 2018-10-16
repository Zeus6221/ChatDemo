import { Status } from "./status";

export interface User {
    Uid: any;
    Nick: string;
    Avatar: string;
    Email: string;
    Age?: number;
    IsFriend?: boolean;
    Password?: string;
    Active?: boolean;
    Status?: Status;
    Friends?: any;

}