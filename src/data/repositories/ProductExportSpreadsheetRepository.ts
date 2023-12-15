import _ from "lodash";
import ExcelJS, { Workbook } from "exceljs";
import { Product } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/repositories/ProductExportRepository";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    async export(name: string, products: Product[]): Promise<void> {
        const uniqueProducts = _.uniqWith(products, (productA, productB) =>
            productA.equals(productB)
        );

        const sortedUniqueProducts = _.sortBy(uniqueProducts, product => product.title);

        const activeProductsRows = this.getRowsByStatus(sortedUniqueProducts, "active");
        const activeProductsSheet = {
            title: "Active Products",
            headers: headers.status,
            rows: activeProductsRows,
        };

        const inactiveProductsRows = this.getRowsByStatus(sortedUniqueProducts, "inactive");
        const inactiveProductsSheet = {
            title: "Inactive Products",
            headers: headers.status,
            rows: inactiveProductsRows,
        };

        const totalProductsQuantity = _.sum(uniqueProducts.map(product => product.quantity.value));
        const activeProductsQuantity = this.getSumByStatus(uniqueProducts, "active");
        const inactiveProductsQuantity = this.getSumByStatus(uniqueProducts, "inactive");

        const summaryRow = [
            this.emptyCellIfZero(uniqueProducts.length),
            this.emptyCellIfZero(totalProductsQuantity),
            this.emptyCellIfZero(activeProductsQuantity),
            this.emptyCellIfZero(inactiveProductsQuantity),
        ];

        const summarySheet = { title: "Summary", headers: headers.summary, rows: [summaryRow] };

        this.createWorkbook(name, [activeProductsSheet, inactiveProductsSheet, summarySheet]);
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

    private async createWorkbook(name: string, sheets: Sheet[]) {
        const workbook = new ExcelJS.Workbook();
        sheets.forEach(sheet =>
            this.addSheetToWorkbook(sheet.title, sheet.headers, sheet.rows, workbook)
        );
        await workbook.xlsx.writeFile(name);
    }
}

type Row = any[];

interface Sheet {
    title: string;
    headers: Row;
    rows: Row[];
}

const headers = {
    status: ["Id", "Title", "Quantity", "Status"],
    summary: ["# Products", "# Items total", "# Items active", "# Items inactive"],
};
