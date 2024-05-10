import { DataElementD2Repository } from "../../../data/repositories/DataElementD2Repository";
import { UserD2Repository } from "../../../data/repositories/UserD2Repository";
import { createAdminUser, createNonAdminUser } from "../../entities/__tests__/userFixtures";
import { Future } from "../../entities/generic/Future";
import { GetDataElementsUseCase } from "../GetDataElementsUseCase";
import { instance, mock, verify, when } from "ts-mockito";
import { createDataElement } from "./GetDataElementsStubUseCase.spec";
import { User } from "../../entities/User";

function mockRepositories(user: User): {
    userRepository: UserD2Repository;
    dataElementRepository: DataElementD2Repository;
    dataElementMock: DataElementD2Repository;
    userMock: UserD2Repository;
} {
    const userMock = mock(UserD2Repository);
    const userRepository = instance(userMock);

    const dataElementMock = mock(DataElementD2Repository);
    const dataElementRepository = instance(dataElementMock);

    when(userMock.getCurrent()).thenReturn(Future.success(user));
    when(dataElementMock.get()).thenReturn(Future.success([createDataElement()]));

    return { userRepository, dataElementRepository, dataElementMock, userMock };
}

describe("GetDataElementsMockitoUseCase", () => {
    it("should return dataElements if user is admin", async () => {
        const { userRepository, dataElementRepository, dataElementMock, userMock } =
            mockRepositories(createAdminUser());

        await new GetDataElementsUseCase(userRepository, dataElementRepository)
            .execute()
            .toPromise();

        verify(userMock.getCurrent()).called();
        verify(dataElementMock.get()).called();
    });

    it("should return an error if user is not an admin", () => {
        const { userRepository, dataElementRepository, dataElementMock, userMock } =
            mockRepositories(createNonAdminUser());

        new GetDataElementsUseCase(userRepository, dataElementRepository).execute().run(
            () => {},
            () => {
                verify(userMock.getCurrent()).called();
                verify(dataElementMock.get()).never();
            }
        );
    });
});
