import _ from "lodash";
import { Product, ProductStatus } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";
import ExcelJS, { Workbook, Worksheet } from "exceljs";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    async export(filename: string, products: Product[]): Promise<void> {
        // Create workbook
        const workBook = new ExcelJS.Workbook();

        const sortedUniqueProducts: Product[] = filterUniqueProductsSorted(products);

        const activeProducts = filterProductsByStatus(sortedUniqueProducts, "active");
        const activeProductWorkSheet = addWorkSheet(workBook, "Active Products");

        addRowHeader(activeProductWorkSheet);
        addRows(activeProductWorkSheet, activeProducts);

        const inactiveProducts = filterProductsByStatus(sortedUniqueProducts, "inactive");
        const inactiveProductWorkSheet = addWorkSheet(workBook, "Inactive Products");

        addRowHeader(inactiveProductWorkSheet);
        addRows(inactiveProductWorkSheet, inactiveProducts);

        const summaryWorkSheet = workBook.addWorksheet("Summary");

        summaryWorkSheet.addRow([
            "# Products",
            "# Items total",
            "# Items active",
            "# Items inactive",
        ]);

        const totalQuantityProducts = getTotalQuantityProducts(sortedUniqueProducts);

        const totalQuantityInactiveProducts = getTotalQuantityProducts(inactiveProducts);

        const totalQuantityActiveProducts = getTotalQuantityProducts(activeProducts);

        summaryWorkSheet.addRow([
            changeZeroToUndefined(sortedUniqueProducts.length),
            changeZeroToUndefined(totalQuantityProducts),
            changeZeroToUndefined(totalQuantityActiveProducts),
            changeZeroToUndefined(totalQuantityInactiveProducts),
        ]);

        // Write xlsx file
        await workBook.xlsx.writeFile(filename);

        console.log(sortedUniqueProducts.length);
        console.log(sortedUniqueProducts);
        console.log(totalQuantityProducts);
    }
}

function changeZeroToUndefined(quantity: number) {
    return quantity > 0 ? quantity : undefined;
}

function addRowHeader(sheet: ExcelJS.Worksheet) {
    sheet.addRow(["Id", "Title", "Quantity", "Status"]);
}

function addRow(sheet: ExcelJS.Worksheet, product: Product) {
    sheet.addRow([product.id, product.title, product.quantity.value, product.status]);
}

function addRows(sheet: ExcelJS.Worksheet, products: Product[]) {
    for (const product of products) {
        //addRow(sheet, product)
        sheet.addRow([product.id, product.title, product.quantity.value, product.status]);
    }
}

function addWorkSheet(workBook: Workbook, title: string): Worksheet {
    return workBook.addWorksheet(title);
}
function filterProductsByStatus(products: Product[], status: ProductStatus): Product[] {
    return products.filter(product => product.status === status);
}

function filterUniqueProductsSorted(products: Product[]) {
    return _.sortBy(
        _.uniqBy([...products], product => product.id),
        ["title"]
    );
}

function getTotalQuantityProducts(products: Product[]): number {
    return products.reduce((acumulativeTotal, p) => {
        return acumulativeTotal + p.quantity.value;
    }, 0);
}
