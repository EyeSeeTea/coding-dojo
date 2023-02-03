import _ from "lodash";
import { NamedRef } from "./Ref";

export class User {
    private id: number;
    private name: string;
    public username: string;
    private userRoles: UserRole[];
    private userGroups: NamedRef[];
    private disabled: boolean;
    private dateWhenDisabled?: Date;

    constructor(
        id: number,
        name: string,
        username: string,
        userRoles: UserRole[] = [],
        userGroups: NamedRef[] = [],
        disabled = false,
        dateWhenDisabled?: Date
    ) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.userRoles = userRoles;
        this.userGroups = userGroups;
        this.disabled = disabled;
        this.dateWhenDisabled = dateWhenDisabled;
    }

    public disable(): boolean {
        if (!this.isAdmin()) {
            this.disabled = true;
            this.dateWhenDisabled = new Date();
        }
        return this.disabled;
    }

    public enable(): boolean {
        if (this.disabled) this.disabled = false;
        return this.disabled;
    }

    public isDisabled(): boolean {
        return this.disabled;
    }

    public daysDisabled(): number | undefined {
        if (this.dateWhenDisabled) {
            const diff = Math.abs(new Date().getTime() - this.dateWhenDisabled.getTime());
            return Math.ceil(diff / (1000 * 3600 * 24));
        } else return this.dateWhenDisabled;
    }

    public isAdmin(): boolean {
        return _.some(this.userRoles, ({ authorities }) => authorities.includes("ALL"));
    }
}

export interface UserRole extends NamedRef {
    authorities: string[];
}
