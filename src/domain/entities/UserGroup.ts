export interface UserGroupData {
    id: string;
    name: string;
}

export class UserGroup {
    public readonly id: string;
    public readonly name: string;

    constructor(data: UserGroupData) {
        this.id = data.id;
        this.name = data.name;
    }

    isAdmin(): boolean {
        return this.name === "Administrators";
    }

    static hasAdmin(userGroups: UserGroup[]): boolean {
        return userGroups.some(userGroup => userGroup.isAdmin());
    }
}
