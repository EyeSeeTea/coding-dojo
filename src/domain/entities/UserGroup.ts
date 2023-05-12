import { Id } from "@eyeseetea/d2-api";

export interface UserGroupData {
    id: Id;
    name: string;
}

export class UserGroup {
    private id: Id;
    private name: string;

    constructor(data: UserGroupData) {
        this.id = data.id;
        this.name = data.name;
    }

    public isAdmin(): boolean {
        return this.name === "Administrators";
    }

    static hasAnyAdmin(userGroups: UserGroup[]): boolean {
        return userGroups.some(ug => ug.isAdmin());
    }
}
