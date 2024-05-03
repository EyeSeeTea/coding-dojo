import { FutureData } from "../../../data/api-futures";
import { DataElement } from "../../entities/DataElement";
import { Future } from "../../entities/generic/Future";
import { DataElementRepository } from "../../repositories/DataElementRepository";
import { UserRepository } from "../../repositories/UserRepository";
import dataElements from "./data/dataElements.json";
import nonAdminUser from "./data/nonAdminUser.json";
import adminUser from "./data/adminUser.json";
import { User } from "../../entities/User";
import { GetDataElementsUseCase, NonAdminUserError } from "../GetDataElementsUseCase";
import { assertType, expectTypeOf } from "vitest";
import { error } from "console";

describe("GetCurrentUserUseCase", () => {
    it("returns data elements if user is admin", async () => {
        const useCase = givenAnAdminUser();

        const response = useCase.execute();

        const dataElements = await response.toPromise();

        expect(dataElements.length).toEqual(2);
    });
    it("returns data elements if user is admin", () => {
        const useCase = givenANonAdminUser();

        useCase.execute().run(
            () => fail("Should not reach here"),
            error => {
                expectTypeOf(error).toEqualTypeOf<NonAdminUserError>();
                expect(error.message).toBe("User is not an admin");
            }
        );
    });
});

function givenAnAdminUser() {
    return new GetDataElementsUseCase(
        new DataElementStubRepository(),
        new AdminUserStubRepository()
    );
}

function givenANonAdminUser() {
    return new GetDataElementsUseCase(
        new DataElementStubRepository(),
        new NonAdminUserStubRepository()
    );
}

class DataElementStubRepository implements DataElementRepository {
    get(): FutureData<DataElement[]> {
        return Future.success(dataElements);
    }
}

class AdminUserStubRepository implements UserRepository {
    user = new User(adminUser);

    getCurrent(): FutureData<User> {
        return Future.success(this.user);
    }

    get(): FutureData<User[]> {
        return Future.success([this.user]);
    }
}

class NonAdminUserStubRepository implements UserRepository {
    user = new User(nonAdminUser);

    getCurrent(): FutureData<User> {
        return Future.success(this.user);
    }

    get(): FutureData<User[]> {
        return Future.success([this.user]);
    }
}
