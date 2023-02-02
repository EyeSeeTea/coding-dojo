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
    userRoles: UserRole[];
    userGroups: NamedRef[];
    isActive: boolean;
    disabledDate?: Date;

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

    disable = (): void => {
        if (!this.isAdmin()) {
            this.isActive = false;
            this.disabledDate = new Date();
        }
    };

    isDisabled = (): boolean => {
        return !this.isActive;
    };

    getDisabledDaysCount = (): number => {
        return dayjs().diff(this.disabledDate, "days");
    };
}

export interface UserRole extends NamedRef {
    authorities: string[];
}
