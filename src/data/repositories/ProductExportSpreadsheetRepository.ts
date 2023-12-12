import _ from "lodash";
import ExcelJS, { Workbook } from "exceljs";
import { Product } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/repositories/ProductExportRepository";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    async export(name: string, products: Product[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        const uniqueProducts = _.uniqWith(products, (productA, productB) =>
            productA.equals(productB)
        );

        const sortedUniqueProducts = _.sortBy(uniqueProducts, product => product.title);

        const activeProductsRows = this.getRowsByStatus(sortedUniqueProducts, "active");
        this.addSheetToWorkbook("Active Products", headers.status, activeProductsRows, workbook);

        const inactiveProductsRows = this.getRowsByStatus(sortedUniqueProducts, "inactive");
        this.addSheetToWorkbook(
            "Inactive Products",
            headers.status,
            inactiveProductsRows,
            workbook
        );

        const totalProductsQuantity = _.sum(uniqueProducts.map(product => product.quantity.value));
        const activeProductsQuantity = this.getSumByStatus(uniqueProducts, "active");
        const inactiveProductsQuantity = this.getSumByStatus(uniqueProducts, "inactive");

        const summaryRow = [
            this.emptyCellIfZero(uniqueProducts.length),
            this.emptyCellIfZero(totalProductsQuantity),
            this.emptyCellIfZero(activeProductsQuantity),
            this.emptyCellIfZero(inactiveProductsQuantity),
        ];

        this.addSheetToWorkbook("Summary", headers.summary, [summaryRow], workbook);

        await workbook.xlsx.writeFile(name);
    }

    private getRowsByStatus(products: Product[], status: "active" | "inactive") {
        return products
            .filter(product => product.status === status)
            .map(product => [product.id, product.title, product.quantity.value, product.status]);
    }

    private addSheetToWorkbook(name: string, headers: string[], rows: any[], workbook: Workbook) {
        const sheet = workbook.addWorksheet(name);
        sheet.addRow(headers);
        rows.forEach(item => sheet.addRow(item));

        return sheet;
    }

    private emptyCellIfZero(value: number) {
        return value > 0 ? value : undefined;
    }

    private getSumByStatus(products: Product[], status: "active" | "inactive") {
        return _.sum(
            products
                .filter(product => product.status === status)
                .map(product => product.quantity.value)
        );
    }
}

const headers = {
    status: ["Id", "Title", "Quantity", "Status"],
    summary: ["# Products", "# Items total", "# Items active", "# Items inactive"],
};
