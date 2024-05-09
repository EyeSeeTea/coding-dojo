import { getTestCompositionRoot } from "../../../CompositionRoot";

describe("GetAllDataElementsUseCase", () => {
    it("returns all data elements for admin user", async () => {
        const compositionRoot = getTestCompositionRoot();
        const dataElements = await compositionRoot.dataElements.getAll.execute().toPromise();

        expect(dataElements).toHaveLength(2);
        expect(dataElements[0]?.name).toEqual("Data Element 1");
        expect(dataElements[1]?.name).toEqual("Data Element 2");
    });

    it("returns error for non-admin user", async () => {
        try {
            const compositionRoot = getTestCompositionRoot(false);
            const _dataElements = await compositionRoot.dataElements.getAll.execute().toPromise();
        } catch (error: any) {
            expect(error.message).toEqual("Non admin users cannot fetch data elements");
        }
    });
});
