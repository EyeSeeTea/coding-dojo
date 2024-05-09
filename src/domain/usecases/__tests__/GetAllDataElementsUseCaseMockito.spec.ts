import { instance, mock, when } from "ts-mockito";
import { UserD2Repository } from "../../../data/repositories/UserD2Repository";
import { DataElementD2Repository } from "../../../data/repositories/DataElementD2Repository";
import { Future } from "../../entities/generic/Future";
import { createAdminUser, createNonAdminUser } from "../../entities/__tests__/userFixtures";
import { GetAllDataElementsUseCase } from "../GetAllDataElementsUseCase";

describe("GetAllDataElementsUseCaseMockito", () => {
    it("returns all data elements for admin user", async () => {
        const mockedUserRepository = mock(UserD2Repository);
        when(mockedUserRepository.getCurrent()).thenReturn(Future.success(createAdminUser()));
        const mockedUserRepoInstance = instance(mockedUserRepository);

        const mockedDataElementRepository = mock(DataElementD2Repository);
        when(mockedDataElementRepository.getAll()).thenReturn(
            Future.success([
                { id: "1", name: "Data Element 1" },
                { id: "2", name: "Data Element 2" },
            ])
        );
        const mockedDataElementRepoInstance = instance(mockedDataElementRepository);

        const dataElements = await new GetAllDataElementsUseCase(
            mockedUserRepoInstance,
            mockedDataElementRepoInstance
        )
            .execute()
            .toPromise();

        expect(dataElements).toHaveLength(2);
        expect(dataElements[0]?.name).toEqual("Data Element 1");
        expect(dataElements[1]?.name).toEqual("Data Element 2");
    });

    it("returns error for non-admin user", async () => {
        try {
            const mockedUserRepository = mock(UserD2Repository);
            when(mockedUserRepository.getCurrent()).thenReturn(
                Future.success(createNonAdminUser())
            );
            const mockedUserRepoInstance = instance(mockedUserRepository);

            const mockedDataElementRepository = mock(DataElementD2Repository);
            const mockedDataElementRepoInstance = instance(mockedDataElementRepository);

            const _dataElements = await new GetAllDataElementsUseCase(
                mockedUserRepoInstance,
                mockedDataElementRepoInstance
            )
                .execute()
                .toPromise();
        } catch (error: any) {
            expect(error.message).toEqual("Non admin users cannot fetch data elements");
        }
    });
});
