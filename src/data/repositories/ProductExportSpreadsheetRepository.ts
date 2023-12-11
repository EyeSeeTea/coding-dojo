import ExcelJS, { Workbook, Worksheet } from "exceljs";
import _ from "lodash";
import { Product } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    async export(name: string, products: Product[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        // Get unique products
        const uniqueProducts = _.uniqWith(products, (productA, productB) =>
            productA.equals(productB)
        );

        // Sort products by title
        const sortedUniqueProducts = _.sortBy(uniqueProducts, product => product.title);

        // add worksheet for active products
        const activeProductsRows = products
            .filter(product => product.status === "active")
            .map(product => [product.id, product.title, product.quantity.value, product.status]);
        const activeProductsSheet = this.addSheet(
            "Active Products",
            ["Id", "Title", "Quantity", "Status"],
            activeProductsRows,
            workbook
        );

        // add worksheet for inactive products
        const inactiveProductsRows = products
            .filter(product => product.status === "inactive")
            .map(product => [product.id, product.title, product.quantity.value, product.status]);
        const inactiveProductsSheet = this.addSheet(
            "Inactive Products",
            ["Id", "Title", "Quantity", "Status"],
            inactiveProductsRows,
            workbook
        );

        // Add sheet summary
        const summarySheet = workbook.addWorksheet("Summary");

        let total = 0;
        let active = 0;
        let inactive = 0;

        sortedUniqueProducts.forEach(product => {
            total += product.quantity.value;
            if (product.status === "active") {
                active += product.quantity.value;
            }
            if (product.status === "inactive") {
                inactive += product.quantity.value;
            }
        });

        summarySheet.addRow(["# Products", "# Items total", "# Items active", "# Items inactive"]);
        summarySheet.addRow([
            // If a value is zero, render an empty cell instead
            sortedUniqueProducts.length > 0 ? sortedUniqueProducts.length : undefined,
            total > 0 ? total : undefined,
            active > 0 ? active : undefined,
            inactive > 0 ? active : undefined,
        ]);

        // Write xlsx file
        await workbook.xlsx.writeFile(name);
    }

    private addRowByStatus(sheet: Worksheet, products: Product[], status: "active" | "inactive") {
        products.forEach(product => {
            if (product.status === status) {
                sheet.addRow([product.id, product.title, product.quantity.value, product.status]);
            }
        });

        return sheet;
    }

    private addSheet(name: string, headers: string[], rows: any[], workbook: Workbook) {
        const sheet = workbook.addWorksheet(name);
        sheet.addRow(headers);
        rows.forEach(item => sheet.addRow(item));

        return sheet;
    }
}
