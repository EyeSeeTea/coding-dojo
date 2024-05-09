import { getTestCompositionRoot } from "../../../CompositionRoot";

describe("test GetDataElements", () => {
    it("should return data elements if admin user", async () => {
        const compositionRoot = getTestCompositionRoot(true);

        const dataElements = await compositionRoot.dataElements.getAll.execute().toPromise();

        expect(dataElements).toBeDefined();
    });
    it("should return error message if not admin user", async () => {
        const compositionRoot = getTestCompositionRoot(false);

        try {
            await compositionRoot.dataElements.getAll.execute().toPromise();
        } catch (err: any) {
            expect(err.message).toBe("User is not admin");
        }
    });
});
