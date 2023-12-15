import { ProductExportSpreadsheetRepository } from "../data/repositories/ProductExportSpreadsheetRepository";
import { Product } from "../domain/entities/Product";

import _ from "../domain/entities/generic/Collection";
// Usage:
// npx ts-node src/scripts/ProductExport.ts -u "https://dev.eyeseetea.com/play" -a admin:district

function main() {
    const productExport = new ProductExportSpreadsheetRepository();

    const activeProduct1 = Product.create("1", "Product 1", "image1", "10").match({
        success: product => product,
        error: err => {
            console.debug(err);
            return null;
        },
    });

    const activeProduct2 = Product.create("2", "Product 2", "image2", "20").match({
        success: product => product,
        error: err => {
            console.debug(err);
            return null;
        },
    });
    const inactiveProduct1 = Product.create("3", "Product 3", "image3", "0").match({
        success: product => product,
        error: err => {
            console.debug(err);
            return null;
        },
    });

    const duplicateProduct1 = Product.create("1", "Product 1", "image1", "0").match({
        success: product => product,
        error: err => {
            console.debug(err);
            return null;
        },
    });

    productExport.export(
        "productExcel.xlsx",
        _([activeProduct1, activeProduct2, inactiveProduct1, duplicateProduct1]).compact().value()
    );
}
main();
