import _ from "lodash";
import { NamedRef } from "./Ref";

export interface UserData {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: UserGroup[];
    isDisabled: boolean;
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export interface UserGroup {
    id: string;
    name: string;
}

export class User {
    public readonly id: string;
    public readonly name: string;
    public readonly username: string;

    private readonly userGroups: UserGroup[];
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

    hasRequiredAuthorities(requiredAuthorities: string[]): boolean {
        const authorities = this.userRoles.flatMap(userRole => userRole.authorities);
        return _.difference(requiredAuthorities, authorities).length === 0;
    }

    belongToAdminUserGroup(userGroupName: string): boolean {
        return this.userGroups.some(({ name }) => name === userGroupName);
    }

    isActive(): boolean {
        return !this.isDisabled;
    }
}
