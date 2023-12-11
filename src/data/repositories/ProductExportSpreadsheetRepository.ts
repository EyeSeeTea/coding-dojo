import { Product } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";
import ExcelJS from "exceljs";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    async export(name: string, products: Product[]): Promise<void> {
        // Create workbook
        const workbook = new ExcelJS.Workbook();

        // Get unique products
        const uniqueProducts: Product[] = [];
        products.forEach(product => {
            if (uniqueProducts.some(product => product.equals(product))) return;
            uniqueProducts.push(product);
        });

        // Sort products by title
        uniqueProducts.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });

        // add worksheet for active products
        const activeProductsSheet = workbook.addWorksheet("Active Products");

        // Add row header
        activeProductsSheet.addRow(["Id", "Title", "Quantity", "Status"]);

        uniqueProducts.forEach(p => {
            if (p.status === "active") {
                activeProductsSheet.addRow([p.id, p.title, p.quantity.value, p.status]);
            }
        });

        // add worksheet for inactive products
        const inactiveProductsSheet = workbook.addWorksheet("Inactive Products");

        // Add row header
        inactiveProductsSheet.addRow(["Id", "Title", "Quantity", "Status"]);

        uniqueProducts.forEach(p => {
            if (p.status === "inactive") {
                inactiveProductsSheet.addRow([p.id, p.title, p.quantity.value, p.status]);
            }
        });

        // Add sheet summary
        const summarySheet = workbook.addWorksheet("Summary");

        let total = 0;
        let active = 0;
        let inactive = 0;

        uniqueProducts.forEach(product => {
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
            uniqueProducts.length > 0 ? uniqueProducts.length : undefined,
            total > 0 ? total : undefined,
            active > 0 ? active : undefined,
            inactive > 0 ? active : undefined,
        ]);

        // Write xlsx file
        await workbook.xlsx.writeFile(name);
    }
}
