import { describe, expect, it } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
    it("should be inactive when quantity is 0", () => {
        const product = createProduct(0);
        expect(product.status).toBe("inactive");
    });

    it("should be active when quantity is greater than 0", () => {
        const product = createProduct(10);
        expect(product.status).toBe("active");
    });

    it("should be active if new quantity is greater than zero", () => {
        const initialQuantity = 0;
        const product = createProduct(initialQuantity);

        expect(product.quantity).toBe(initialQuantity);
        expect(product.status).toBe("inactive");

        const increasedQuantity = 5;
        const productWithNewQuantity = product.update(increasedQuantity);

        expect(productWithNewQuantity.quantity).toBe(initialQuantity + increasedQuantity);
        expect(productWithNewQuantity.status).toBe("active");
    });

    it("should be inactive if new quantity is zero", () => {
        const initialQuantity = 20;
        const product = createProduct(initialQuantity);

        expect(product.quantity).toBe(initialQuantity);
        expect(product.status).toBe("active");

        const productWithNewQuantity = product.update(0);

        expect(productWithNewQuantity.quantity).toBe(0);
        expect(productWithNewQuantity.status).toBe("inactive");
    });
});

function createProduct(quantity: number): Product {
    return new Product({
        id: "1",
        imageUrl: "",
        quantity,
        title: "Product One",
    });
}
