import { Product, ProductStatus } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";
import _ from "../../domain/entities/generic/Collection";
import ExcelJS from "exceljs";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    export(name: string, products: Product[]): FutureData<void> {
        const wb = new ExcelJS.Workbook();
        const uniqueProducts = this.getUniqueProducts(products);
        const sortedProducts = this.sortProducts(uniqueProducts);

        const activeProductsSheet = wb.addWorksheet("Active Products");
        const activeProducts = this.getProductsByStatus(sortedProducts, "active");
        this.generateSheet(activeProductsSheet, activeProducts);

        const inactiveProductsSheet = wb.addWorksheet("Inactive Products");
        const inactiveProducts = this.getProductsByStatus(sortedProducts, "inactive");
        this.generateSheet(inactiveProductsSheet, inactiveProducts);

        const summarySheet = wb.addWorksheet("Summary");

        this.generateSheetSummary(summarySheet, activeProducts, inactiveProducts);

        return Future.fromPromise<Error, void>(wb.xlsx.writeFile(name));
    }

    private getValueOrEmpty(value: number): number | undefined {
        return value || undefined;
    }

    private getUniqueProducts(products: Product[]): Product[] {
        return _(products).uniq().value();
    }

    private sortProducts(products: Product[]): Product[] {
        return _(products)
            .sortBy(product => product.title)
            .value();
    }

    private getProductsByStatus(products: Product[], status: ProductStatus): Product[] {
        return _(products)
            .filter(product => product.status === status)
            .value();
    }

    private generateSheet(sheet: ExcelJS.Worksheet, products: Product[]) {
        sheet.addRow(["Id", "Title", "Quantity", "Status"]);
        products.forEach(p =>
            sheet.addRow([p.id, p.title, this.getValueOrEmpty(p.quantity.value), p.status])
        );
    }

    private generateSheetSummary(
        sheet: ExcelJS.Worksheet,
        activeProducts: Product[],
        inactiveProducts: Product[]
    ) {
        sheet.addRow(["# Products", "# Items total", "# Items active", "# Items inactive"]);

        const productsNumber = activeProducts.length + inactiveProducts.length;
        const itemsTotal =
            activeProducts.reduce((acc, curr) => acc + curr.quantity.value, 0) +
            inactiveProducts.reduce((acc, curr) => acc + curr.quantity.value, 0);
        sheet.addRow([
            this.getValueOrEmpty(productsNumber),
            this.getValueOrEmpty(itemsTotal),
            this.getValueOrEmpty(activeProducts.length),
            this.getValueOrEmpty(inactiveProducts.length),
        ]);
    }
}
