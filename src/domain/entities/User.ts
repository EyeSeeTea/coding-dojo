import _ from "lodash";
import { NamedRef } from "./Ref";

export interface UserProps {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    disabled?: boolean;
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export class User {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    private disabled!: boolean;
    private disabledTimestamp!: number | null;
    private admin: boolean;

    constructor(props: UserProps) {
        this.id = props.id;
        this.name = props.name;
        this.username = props.username;
        this.userRoles = props.userRoles;
        this.userGroups = props.userGroups;
        this.admin = this.isSuperAdmin();
        this.setDisabled(props.disabled);
    }

    private isSuperAdmin(): boolean {
        return _.some(this.userRoles, ({ authorities }) => authorities.includes("ALL"));
    }

    isAdmin(): boolean {
        return this.admin;
    }

    setUserRoles(value: UserRole[]) {
        this.userRoles = value;
        this.admin = this.isSuperAdmin();
    }

    isDisabled(): boolean {
        return this.disabled;
    }

    setDisabled(value: boolean | undefined) {
        if (this.admin && value) throw new Error("Admins users can't be disabled");
        this.disabledTimestamp = value ? Date.now() : null;
        this.disabled = value ? true : false;
    }

    getDaysDisabled(): number | null {
        if (!this.disabled || !this.disabledTimestamp) return null;
        const now = Date.now();
        if (now < this.disabledTimestamp) throw new Error("Time travel not yet possible");
        return Math.ceil(Math.abs(Date.now() - this.disabledTimestamp) / 86400000);
    }
}
