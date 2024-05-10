import { FutureData } from "../../../data/api-futures";
import { DataElement } from "../../entities/DataElement";
import { User } from "../../entities/User";
import { createAdminUser, createNonAdminUser } from "../../entities/__tests__/userFixtures";
import { Future } from "../../entities/generic/Future";
import { DataElementRepository } from "../../repositories/DataElementRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { GetDataElementsUseCase } from "../GetDataElementsUseCase";

export function createDataElement(): DataElement {
    return DataElement.create({ id: "kVOiLDV4OC6", name: "ART entry4" });
}

class DataElementStubRepository implements DataElementRepository {
    get(): FutureData<DataElement[]> {
        return Future.success([createDataElement()]);
    }
}

export class UserAdminStubRepository implements UserRepository {
    getCurrent(): FutureData<User> {
        return Future.success(createAdminUser());
    }
}

export class UserNonAdminStubRepository implements UserRepository {
    getCurrent(): FutureData<User> {
        return Future.success(createNonAdminUser());
    }
}

describe("GetDataElementsStubUseCase", () => {
    it("should return dataElements if user is admin", async () => {
        const userRepository = new UserAdminStubRepository();
        const dataElementRepository = new DataElementStubRepository();

        const result = await new GetDataElementsUseCase(userRepository, dataElementRepository)
            .execute()
            .toPromise();

        expect(result.length).toBe(1);
    });

    it("should return an error if user is not an admin", () => {
        const userRepository = new UserNonAdminStubRepository();
        const dataElementRepository = new DataElementStubRepository();

        new GetDataElementsUseCase(userRepository, dataElementRepository).execute().run(
            () => {},
            error => {
                expect(error.message).toMatch(/user is not an admin/i);
            }
        );
    });
});
