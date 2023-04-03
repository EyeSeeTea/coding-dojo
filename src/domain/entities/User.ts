import { NamedRef } from "./Ref";

export interface UserData {
    id: string;
    name: string;
    isDisabled: boolean;
    username: string;
    userRoles: UserRole[];
    userGroups: NamedRef[];
}

export interface UserRole extends NamedRef {
    authorities: string[];
}

export class UserRoles {
    constructor(data: UserRole) {
        this.authorities = data.authorities;
    }

    public readonly authorities: string[];
    //For later exercises.
    public hasAuthorityAllOrImportMetdata(): boolean {
        return this.authorities.includes("ALL") || this.authorities.includes("F_METADATA_IMPORT");
    }
}

export class User {
    public readonly id: string;
    public readonly name: string;
    public readonly username: string;
    public readonly isDisabled: boolean;

    private readonly userGroups: NamedRef[];
    private readonly userRoles: UserRole[];

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

    belongToUserGroupByName(userGroupName: string): boolean {
        return this.userGroups.some(({ name }) => name === userGroupName);
    }

    isAdmin(): boolean {
        const hasFullAuthority =
            this.userRoles.some(({ authorities }) => authorities.includes("ALL")) &&
            this.userRoles.some(({ authorities }) => authorities.includes("F_METADATA_IMPORT"));
        return hasFullAuthority && this.belongToUserGroupByName("Administrators") && !this.isDisabled;
    }
}
