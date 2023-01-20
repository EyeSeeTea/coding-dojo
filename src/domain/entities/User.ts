import _ from "lodash";
import { NamedRef } from "./Ref";
import { boolean } from "purify-ts";

export interface User {
    id: string;
    name: string;
    username: string;
    disabled: boolean;
    lastDisabledUpdated: Date | undefined;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    getDisabledDays(): number;
    isAdmin(): boolean;
    disableUser(): boolean;
}

class UserInstance {
    id: string;
    name: string;
    username: string;
    disabled: boolean;
    lastDisabledUpdated: Date | undefined;
    userRoles: UserRoleInstance;
    userGroups: NamedRef[];

    constructor(
        id: string,
        name: string,
        username: string,
        disabled: boolean,
        userRoles: UserRoleInstance,
        userGroups: NamedRef[],
        lastDisabledUpdated?: Date
    ) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.disabled = disabled;
        this.lastDisabledUpdated = lastDisabledUpdated;
        this.userRoles = userRoles;
        this.userGroups = userGroups;
    }

    getDisabledDays(): number {
        if (this.disabled && this.lastDisabledUpdated) {
            return Math.floor((new Date().getTime() - this.lastDisabledUpdated.getTime()) / (1000 * 3600 * 24));
        } else {
            return 0;
        }
    }

    isAdmin(): boolean {
        return this.userRoles.isAdmin();
    }
    disableUser(): boolean {
        if (this.userRoles.isAdmin()) {
            this.disabled = true;
            this.lastDisabledUpdated = new Date();
        }
        return this.disabled;
    }
}

export interface UserRole extends NamedRef {
    authorities: string[];
    isAdmin(): boolean;
}

export class UserRoleInstance implements UserRole {
    name: string;
    id: string;
    authorities: string[];

    constructor(name: string, id: string, authorities: string[]) {
        this.id = id;
        this.name = name;
        this.authorities = authorities;
    }

    isAdmin(): boolean {
        return this.authorities.includes("ALL");
    }
}
