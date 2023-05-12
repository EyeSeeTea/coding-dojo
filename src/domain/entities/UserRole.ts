import { NamedRef } from "./Ref";

export type Authority = "superadmin" | "import";

export interface UserRoleData extends NamedRef {
    authorities: Authority[];
}

export class UserRole {
    private readonly authorities: Authority[];

    constructor(data: UserRoleData) {
        this.authorities = data.authorities;
    }

    public hasFullAuthority(): boolean {
        return (
            this.authorities.some(authority => authority === "superadmin") &&
            this.authorities.some(authority => authority === "import")
        );
    }

    static haveFullAuthority(userRoles: UserRole[]): boolean {
        return userRoles.some(role => role.hasFullAuthority());
    }
}
