import _ from "lodash";
import { NamedRef } from "./Ref";

interface UserProps {
    id: number;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    dateWhenDisabled?: Date;
}

export class User {
    private id: number;
    private name: string;
    public username: string;
    private userRoles: UserRole[];
    private userGroups: NamedRef[];
    private dateWhenDisabled?: Date;

    constructor(props: UserProps) {
        const { id, name, username, userRoles, userGroups, dateWhenDisabled } = props;
        this.id = id;
        this.name = name;
        this.username = username;
        if (User.userRolesHaveAuthorityAll(userRoles) && dateWhenDisabled)
            throw new Error("Admin user can't be disabled.");
        this.userRoles = userRoles ?? [];
        this.userGroups = userGroups ?? [];
        if (dateWhenDisabled && new Date() < dateWhenDisabled)
            throw new Error("Date when user was disabled can't be newer than the current date.");
        this.dateWhenDisabled = dateWhenDisabled;
    }

    public disable(dateWhenDisabled?: Date): Date | boolean {
        if (dateWhenDisabled && new Date() < dateWhenDisabled)
            throw new Error("Date when user was disabled can't be newer than the current date.");
        if (this.dateWhenDisabled) return this.dateWhenDisabled;
        else if (!this.isAdmin()) {
            this.dateWhenDisabled = dateWhenDisabled ?? new Date();
            return this.dateWhenDisabled;
        } else return this.dateWhenDisabled == undefined;
    }

    public enable(): boolean {
        if (this.dateWhenDisabled) this.dateWhenDisabled = undefined;
        return this.dateWhenDisabled == undefined;
    }

    public isDisabled(): boolean {
        return this.dateWhenDisabled != undefined;
    }

    public daysDisabled(): number | undefined {
        if (this.dateWhenDisabled) {
            const diff = Math.abs(new Date().getTime() - this.dateWhenDisabled.getTime());
            return Math.floor(diff / (1000 * 3600 * 24));
        } else return this.dateWhenDisabled;
    }

    public isAdmin(): boolean {
        return _.some(this.userRoles, ({ authorities }) => authorities.includes("ALL"));
    }

    private static userRolesHaveAuthorityAll(userRoles: UserRole[]): boolean {
        return _.some(userRoles, ({ authorities }) => authorities.includes("ALL"));
    }
}

export interface UserRole extends NamedRef {
    authorities: string[];
}
