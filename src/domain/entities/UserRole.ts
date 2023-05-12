import { NamedRef } from "./Ref";

export interface UserRoleData extends NamedRef {
    authorities: string[];
}

export class UserRole {
    private readonly authorities: string[];

    constructor(data: UserRoleData) {
        this.authorities = data.authorities;
    }

    public hasFullAuthority(): boolean {
        return (
            this.authorities.some(authority => authority.includes("ALL")) &&
            this.authorities.some(authority => authority.includes("F_METADATA_IMPORT"))
        );
    }

    static haveFullAuthority(userRoles: UserRole[]): boolean {
        return userRoles.some(role => role.hasFullAuthority());
    }
}
