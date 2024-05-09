import { mock, when, instance } from "ts-mockito";
import { DataElementsD2Repository } from "../../../data/repositories/DataElementsD2Repository";
import { DataElement } from "../../entities/DataElement";
import { User } from "../../entities/User";
import { Future } from "../../entities/generic/Future";
import { GetAllDataElementsUseCase, NonAdminError } from "../GetAllDataElementsUseCase";
import { UserD2Repository } from "../../../data/repositories/UserD2Repository";

function givenAStubUserRepository() {
    const mockedRepository = mock(UserD2Repository);
    when(mockedRepository.getCurrent()).thenReturn(Future.success(dummyUser));
    const userRepository = instance(mockedRepository);

    return userRepository;
}

function givenAStubAdminRepository() {
    const mockedRepository = mock(UserD2Repository);
    when(mockedRepository.getCurrent()).thenReturn(Future.success(adminUser));
    const userRepository = instance(mockedRepository);

    return userRepository;
}

function givenAStubDataElementRepository() {
    const mockedRepository = mock(DataElementsD2Repository);
    when(mockedRepository.getAll()).thenReturn(Future.success(dataElements));
    const dataElementRepository = instance(mockedRepository);

    return dataElementRepository;
}

function givenADummyDataElementRepository() {
    const dataElementRepository = mock(DataElementsD2Repository);
    const dataElementsDummyRepository = instance(dataElementRepository);

    return dataElementsDummyRepository;
}

describe("getDataElements", () => {
    it("should return an array of data elements", async () => {
        const useCase = new GetAllDataElementsUseCase(
            givenAStubAdminRepository(),
            givenAStubDataElementRepository()
        );

        const result = await useCase.execute().toPromise();

        expect(result).toBe(dataElements);
    });

    it("should throw NonAdminError if user is not admin", async () => {
        const useCase = new GetAllDataElementsUseCase(
            givenAStubUserRepository(),
            givenADummyDataElementRepository()
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
