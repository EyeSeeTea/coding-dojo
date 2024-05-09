import { mock, when } from "ts-mockito";
import { DataElementD2Repository } from "../../../data/repositories/DataElementD2Repository";
import { Future } from "../../entities/generic/Future";

describe("Test GetDataElements Mockito", () => {
    it("should return data elements if admin user", async () => {
        givenADataElements();
    });

    it("should return error message if not admin user", async () => {});
});

const givenADataElements = () => {
    const DataElements = [
        {
            id: "1",
            name: "DataElement1",
        },
    ];
    const mockedRepository = mock(DataElementD2Repository);

    when(mockedRepository.getAll()).thenReturn(Future.success(DataElements));
};
