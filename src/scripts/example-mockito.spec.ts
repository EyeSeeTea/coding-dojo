import { describe, test, expect } from "vitest";
import { instance, mock, when } from "ts-mockito";
import { UserRepository } from "../domain/repositories/UserRepository";
import { DataElementRepository } from "../domain/repositories/DataElementRepository";
import { User } from "../domain/entities/User";
import { Future } from "../domain/entities/generic/Future";
import { GetDataElementsUseCase } from "../domain/usecases/GetDataElementsUseCase";
import { UserD2Repository } from "../data/repositories/UserD2Repository";
import { DataElementD2Repository } from "../data/repositories/DataElementD2Repository";

let userRepo: UserRepository;
let dataElementRepo: DataElementRepository;

describe("Get data elements", () => {
    test("if user is an admin should return the data elements", async () => {
        givenAdminUser();
        const dataElements = givenDataElements();

        const dataElementResponse = await new GetDataElementsUseCase(dataElementRepo, userRepo)
            .execute()
            .toPromise();

        expect(dataElementResponse).toEqual(dataElements);
    });

    test("if user is not an admin should return an error", async () => {
        try {
            givenNoAdminUser();
            givenDataElements();

            const _dataElementResponse = await new GetDataElementsUseCase(dataElementRepo, userRepo)
                .execute()
                .toPromise();
        } catch (e) {
            expect(e).toEqual(new Error("This action is not allowed"));
        }
    });
});

function givenAdminUser() {
    const adminUser = new User({
        id: "admin",
        name: "admin",
        username: "admin",
        userRoles: [{ authorities: ["ALL"], name: "admin", id: "admin" }],
        userGroups: [],
    });

    const mockedUserRepo = mock(UserD2Repository);
    when(mockedUserRepo.getCurrent()).thenReturn(Future.success(adminUser));
    userRepo = instance(mockedUserRepo);

    return adminUser;
}

function givenNoAdminUser() {
    const noAdminUser = new User({
        id: "noAdmin",
        name: "noAdmin",
        username: "noAdmin",
        userRoles: [{ authorities: ["basic_access"], name: "noAdmin", id: "noAdmin" }],
        userGroups: [],
    });

    const mockedUserRepo = mock(UserD2Repository);
    when(mockedUserRepo.getCurrent()).thenReturn(Future.success(noAdminUser));
    userRepo = instance(mockedUserRepo);

    return noAdminUser;
}

function givenDataElements() {
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

    const mockedDataElementRepo = mock(DataElementD2Repository);
    when(mockedDataElementRepo.get()).thenReturn(Future.success(dataElements));
    dataElementRepo = instance(mockedDataElementRepo);

    return dataElements;
}
