import { NamedRef } from "./Ref";

export class UserGroup {
    public readonly id: string;
    public readonly name: string;

    constructor(data: NamedRef) {
        this.id = data.id;
        this.name = data.name;
    }

    isAdmin() {
        return this.name === "Administrators";
    }

    static isAdmin(userGroups: UserGroup[]) {
        return userGroups.some(ug => ug.isAdmin());
    }
}
