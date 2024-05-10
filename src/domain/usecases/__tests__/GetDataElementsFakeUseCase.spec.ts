import { FutureData } from "../../../data/api-futures";
import { DataElement } from "../../entities/DataElement";
import { Future } from "../../entities/generic/Future";
import { DataElementRepository } from "../../repositories/DataElementRepository";
import { GetDataElementsUseCase } from "../GetDataElementsUseCase";
import {
    UserAdminStubRepository,
    UserNonAdminStubRepository,
    createDataElement,
} from "./GetDataElementsStubUseCase.spec";

class DataElementFakeRepository implements DataElementRepository {
    private dataElements: DataElement[] = [];
    get(): FutureData<DataElement[]> {
        this.dataElements = [...this.dataElements, createDataElement()];
        return Future.success(this.dataElements);
    }
}

describe("GetDataElementsFakeUseCase", () => {
    it("should return dataElements if user is admin", async () => {
        const userRepository = new UserAdminStubRepository();
        const dataElementRepository = new DataElementFakeRepository();

        const result = await new GetDataElementsUseCase(userRepository, dataElementRepository)
            .execute()
            .toPromise();

        expect(result.length).toBe(1);
    });

    it("should return an error if user is not an admin", () => {
        const userRepository = new UserNonAdminStubRepository();
        const dataElementRepository = new DataElementFakeRepository();

        new GetDataElementsUseCase(userRepository, dataElementRepository).execute().run(
            () => {},
            error => {
                expect(error.message).toMatch(/user is not an admin/i);
            }
        );
    });
});
