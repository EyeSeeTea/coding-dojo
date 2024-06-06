import { getTestCompositionRoot } from "../../../CompositionRoot";

describe("test GetDataElements", () => {
    it("should return data elements if admin user", async () => {
        const compositionRoot = getTestCompositionRoot(true);

        const dataElements = await compositionRoot.dataElements.getAll.execute().toPromise();

        expect(dataElements).toBeDefined();
        expect(dataElements).toHaveLength(3);
    });
    it("should return error message if not admin user", async () => {
        const compositionRoot = getTestCompositionRoot(false);

        const promise = compositionRoot.dataElements.getAll.execute().toPromise();

        await expect(promise).rejects.toThrow(new Error("User is not admin"));
    });
});
