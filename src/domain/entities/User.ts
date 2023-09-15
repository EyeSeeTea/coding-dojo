import { UserGroup } from "./UserGroup";
import { UserRole } from "./UserRole";

export interface UserData {
    id: string;
    name: string;
    username: string;
    userRoles: UserRole[];
    userGroups: UserGroup[];
    isDisabled: boolean;
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

    isAdmin(): boolean {
        return UserRole.haveAdminAuthorities(this.userRoles) && UserGroup.hasAdmin(this.userGroups) && !this.isDisabled;
    }
}
