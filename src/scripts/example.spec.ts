import { describe, test, expect } from "vitest";
import { UserRepository } from "../domain/repositories/UserRepository";
import { DataElementRepository } from "../domain/repositories/DataElementRepository";
import { FutureData } from "../data/api-futures";
import { User } from "../domain/entities/User";
import { Future } from "../domain/entities/generic/Future";
import { DataElement } from "../domain/entities/DataElement";
import { GetDataElementsUseCase } from "../domain/usecases/GetDataElementsUseCase";

const adminUser = new User({
    id: "admin",
    name: "admin",
    username: "admin",
    userRoles: [{ authorities: ["ALL"], name: "admin", id: "admin" }],
    userGroups: [],
});

const noAdminUser = new User({
    id: "noAdmin",
    name: "noAdmin",
    username: "noAdmin",
    userRoles: [{ authorities: ["basic_access"], name: "noAdmin", id: "noAdmin" }],
    userGroups: [],
});

class UserStubRepository implements UserRepository {
    private user;
    constructor(user: User) {
        this.user = user;
    }

    getCurrent(): FutureData<User> {
        return Future.success(this.user);
    }
}

const dataElements = [
    {
        id: "dataElement1",
        name: "dataElement1",
    },
    {
        id: "dataElement2",
        name: "dataElement2",
    },
];

class DataElementStubRepository implements DataElementRepository {
    get(): FutureData<DataElement[]> {
        return Future.success(dataElements);
    }
}

describe("Get data elements", () => {
    test("if user is an admin should return the data elements", async () => {
        const dataElementResponse = await new GetDataElementsUseCase(
            new DataElementStubRepository(),
            new UserStubRepository(adminUser)
        )
            .execute()
            .toPromise();

        expect(dataElementResponse).toBe(dataElements);
    });

    test("if user is not an admin should return nothing", async () => {
        const dataElementResponse = await new GetDataElementsUseCase(
            new DataElementStubRepository(),
            new UserStubRepository(noAdminUser)
        )
            .execute()
            .toPromise();

        expect(dataElementResponse).toBe(undefined);
    });
});
