import { FutureData } from "../../../data/api-futures";
import { DataElement } from "../../entities/DataElement";
import { User } from "../../entities/User";
import { Future } from "../../entities/generic/Future";
import { DataElementRepository } from "../../repositories/DataElementRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { GetAllDataElementsUseCase, NonAdminError } from "../GetAllDataElementsUseCase";

class UserStubRepository implements UserRepository {
    getCurrent(): FutureData<User> {
        return Future.success(dummyUser);
    }
}

class AdminStubRepository implements UserRepository {
    getCurrent(): FutureData<User> {
        return Future.success(adminUser);
    }
}

class DataElementStubRepository implements DataElementRepository {
    getAll(): FutureData<DataElement[]> {
        return Future.success(dataElements);
    }
}

class DataElementDummyRepository implements DataElementRepository {
    getAll(): FutureData<DataElement[]> {
        throw new Error("Method not implemented");
    }
}

describe("getDataElements", () => {
    it("should return an array of data elements", async () => {
        const useCase = new GetAllDataElementsUseCase(
            new AdminStubRepository(),
            new DataElementStubRepository()
        );

        const result = await useCase.execute().toPromise();

        expect(result).toBe(dataElements);
    });

    it("should throw NonAdminError if user is not admin", async () => {
        const useCase = new GetAllDataElementsUseCase(
            new UserStubRepository(),
            new DataElementDummyRepository()
        );

        const request = useCase.execute().toPromise();

        await expect(request).rejects.toThrow(NonAdminError);
    });
});

const dummyUser: User = new User({
    id: "123",
    name: "John Doe",
    username: "johndoe",
    userRoles: [
        {
            id: "role1",
            name: "role1",
            authorities: ["authority1", "authority2"],
        },
        {
            id: "role2",
            name: "role2",
            authorities: ["authority3", "authority4"],
        },
    ],
    userGroups: [],
});

const adminUser: User = new User({
    id: "123",
    name: "John Doe",
    username: "johndoe",
    userRoles: [
        {
            id: "role1",
            name: "role1",
            authorities: ["ALL"],
        },
    ],
    userGroups: [],
});

const dataElements: DataElement[] = [
    { id: "test1", name: "Test 1 Data Element" },
    { id: "test2", name: "Test 2 Data Element" },
];
