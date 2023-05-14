import _ from "lodash";
import { NamedRef } from "./Ref";

export type Authority = "superadmin" | "import";

export interface UserRoleData extends NamedRef {
    authorities: Authority[];
}

export class UserRole {
    public readonly id: string;
    public readonly name: string;
    public readonly authorities: Authority[];

    static requiredAuthorities: Authority[] = ["superadmin", "import"];

    constructor(data: UserRoleData) {
        this.id = data.id;
        this.name = data.name;
        this.authorities = data.authorities;
    }

    static haveAdminAuthorities(userRoles: UserRole[]): boolean {
        const authorities = userRoles.flatMap(userRole => userRole.authorities);

        return _.difference(this.requiredAuthorities, authorities).length === 0;
    }
}
