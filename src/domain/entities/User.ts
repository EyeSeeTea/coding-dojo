import { NamedRef } from "./Ref";
import dayjs from "dayjs";

export interface UserData {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export class User {
    public readonly id: string;
    public readonly name: string;
    public readonly username: string;

    private readonly userGroups: NamedRef[];
    private readonly userRoles: UserRole[];

    private isActive: boolean;
    private disabledDate?: Date;

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.userRoles = data.userRoles;
        this.userGroups = data.userGroups;
        this.isActive = true;
    }

    belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.userRoles.some(({ authorities }) => authorities.includes("ALL"));
    }

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
