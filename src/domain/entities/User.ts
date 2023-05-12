import { UserGroup } from "./UserGroup";
import { UserRole } from "./UserRole";

export interface UserData {
    id: string;
    name: string;
    isDisabled: boolean;
    username: string;
    userRoles: UserRole[];
    userGroups: UserGroup[];
}

export class User {
    public readonly id: string;
    public readonly name: string;
    public readonly username: string;
    public readonly isDisabled: boolean;

    private readonly userGroups: UserGroup[];
    private readonly userRoles: UserRole[];

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.userRoles = data.userRoles;
        this.userGroups = data.userGroups;
        this.isDisabled = data.isDisabled;
    }

    isAdmin(): boolean {
        return UserRole.haveFullAuthority(this.userRoles) && UserGroup.hasAnyAdmin(this.userGroups) && !this.isDisabled;
    }
}
