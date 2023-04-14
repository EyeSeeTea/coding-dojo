import _ from "lodash";
import { NamedRef } from "./Ref";

export interface UserData {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
    isDisabled: boolean;
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
    private readonly isDisabled: boolean;

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.userRoles = data.userRoles;
        this.userGroups = data.userGroups;
        this.isDisabled = data.isDisabled;
    }

    belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        const authorities = this.userRoles.flatMap(userRole => userRole.authorities);
        const requiredAuthorities = ["ALL", "F_METADATA_IMPORT"];
        const hasAuthorities = _.difference(requiredAuthorities, authorities).length === 0;
        const isInAdminUserGroup = this.userGroups.some(({ name }) => name === "Administrators");

        return hasAuthorities && isInAdminUserGroup && !this.isDisabled;
    }
}
