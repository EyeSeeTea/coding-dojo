import { Future } from "../../entities/generic/Future";
import { DataElementRepository } from "../../repositories/DataElementRepository";
import { UserRepository } from "../../repositories/UserRepository";
import dataElements from "./data/dataElements.json";
import nonAdminUser from "./data/nonAdminUser.json";
import adminUser from "./data/adminUser.json";
import { User } from "../../entities/User";
import { GetDataElementsUseCase, NonAdminUserError } from "../GetDataElementsUseCase";
import { expectTypeOf } from "vitest";
import { instance, mock, when } from "ts-mockito";
import { DataElementD2Repository } from "../../../data/repositories/DataElementD2Repository";
import { UserD2Repository } from "../../../data/repositories/UserD2Repository";

let stubUserRepository: UserRepository;
let stubDataElementRepository: DataElementRepository;

describe("GetCurrentUserUseCase", () => {
    it("returns data elements if user is admin", async () => {
        const useCase = givenAnAdminUserScenario();

        const response = useCase.execute();

        const dataElements = await response.toPromise();

        expect(dataElements.length).toEqual(2);
    });
    it("returns data elements if user is admin", () => {
        const useCase = givenANonAdminUserScenario();

        useCase.execute().run(
            () => fail("Should not reach here"),
            error => {
                expectTypeOf(error).toEqualTypeOf<NonAdminUserError>();
                expect(error.message).toBe("User is not an admin");
            }
        );
    });
});

function givenAnAdminUserScenario() {
    givenADataElements();
    givenAnUser(new User(adminUser));

    return new GetDataElementsUseCase(stubDataElementRepository, stubUserRepository);
}

function givenANonAdminUserScenario() {
    givenADataElements();
    givenAnUser(new User(nonAdminUser));

    return new GetDataElementsUseCase(stubDataElementRepository, stubUserRepository);
}

function givenADataElements() {
    const mockedRepository = mock(DataElementD2Repository);

    when(mockedRepository.get()).thenReturn(Future.success(dataElements));

    stubDataElementRepository = instance(mockedRepository);
}

function givenAnUser(user: User) {
    const mockedRepository = mock(UserD2Repository);

    when(mockedRepository.getCurrent()).thenReturn(Future.success(user));

    stubUserRepository = instance(mockedRepository);
}
