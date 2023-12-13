import { Product } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";
import ExcelJS from "exceljs";
import _ from "lodash";

type Status = "active" | "inactive";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    async export(name: string, products: Product[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();

        const uniqueProducts = this.getUniqueProducts(products, "id");
        const sortedProducts = this.sortProducts(uniqueProducts, "title");

        const activeSheet = this.addWorksheet(workbook, "Active Products");
        this.addProductsToSheet(activeSheet, sortedProducts, "active");

        const inactiveSheet = this.addWorksheet(workbook, "Inactive Products");
        this.addProductsToSheet(inactiveSheet, sortedProducts, "inactive");

        const summarySheet = this.addWorksheet(workbook, "Summary");
        this.addSummaryToSheet(summarySheet, sortedProducts);

        const fileName = `${name}.xlsx`;
        await workbook.xlsx.writeFile(fileName);
    }

    private getUniqueProducts(products: Product[], property: keyof Product): Product[] {
        return _.uniqBy(products, property);
    }

    private sortProducts(products: Product[], property: keyof Product): Product[] {
        return _.orderBy(products, [property]);
    }

    private addProductsToSheet(
        worksheet: ExcelJS.Worksheet,
        products: Product[],
        status: Status
    ): void {
        this.addRow(worksheet, productSheetTitle);

        _(products)
            .filter(product => product.status === status)
            .forEach(product =>
                worksheet.addRow([
                    product.id,
                    product.title,
                    product.quantity.value,
                    product.status,
                ])
            );
    }

    private addSummaryToSheet(worksheet: ExcelJS.Worksheet, products: Product[]): void {
        const totalProducts = this.sumProductQuantities(products);

        const activeProducts = this.getProductsByStatus(products, "active");
        const inactiveProducts = this.getProductsByStatus(products, "inactive");

        const totalActiveProducts = this.sumProductQuantities(activeProducts);
        const totalInactiveProducts = this.sumProductQuantities(inactiveProducts);

        this.addRow(worksheet, summarySheetTitle);
        this.addRow(worksheet, [
            products.length,
            totalProducts,
            totalActiveProducts,
            totalInactiveProducts,
        ]);
    }

    private sumProductQuantities(products: Product[]): number {
        return _.sumBy(products, product => product.quantity.value);
    }

    private getProductsByStatus(products: Product[], status: Status): Product[] {
        return _.filter(products, { status: status });
    }

    private addWorksheet(workbook: ExcelJS.Workbook, name: string): ExcelJS.Worksheet {
        return workbook.addWorksheet(name);
    }

    private addRow(worksheet: ExcelJS.Worksheet, rowItems: (string | number)[]): void {
        worksheet.addRow(rowItems);
    }
}

const productSheetTitle = ["Id", "Title", "Quantity", "Status"];
const summarySheetTitle = ["# Products", "# Items total", "# Items active", "# Items inactive"];
