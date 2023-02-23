import _ from "lodash";
import { NamedRef } from "./Ref";
import dayjs from "dayjs";

export interface User {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
}

export class UserModel {
    id: string;
    name: string;
    username: string;
    private userRoles: UserRole[];
    private userGroups: NamedRef[];
    private isActive: boolean;
    private disabledDate?: Date;

    constructor({ id, name, username, userRoles, userGroups }: User) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.userRoles = userRoles;
        this.userGroups = userGroups;
        this.isActive = true;
    }

    isAdmin = (): boolean => {
        return _.some(this.userRoles, ({ authorities }) => authorities.includes("ALL"));
    };

    disable = (date?: Date): void => {
        if (!this.isAdmin()) {
            this.isActive = false;
            this.disabledDate = date || new Date();
        }
    };

    isDisabled = (): boolean => {
        return !this.isActive;
    };

    getDisabledDaysCount = (): number | undefined => {
        if (this.disabledDate) {
            return dayjs().diff(this.disabledDate, "days");
        } else {
            return undefined;
        }
    };
}

export interface UserRole extends NamedRef {
    authorities: string[];
}
