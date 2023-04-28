import _ from "lodash";
import { NamedRef } from "./Ref";

export interface UserRoleData extends NamedRef {
    authorities: string[];
}

export class UserRole {
    public readonly id: string;
    public readonly name: string;
    public readonly authorities: string[];

    static requiredAuthorities = ["ALL", "F_METADATA_IMPORT"];

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
