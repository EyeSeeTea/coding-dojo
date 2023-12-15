import ExcelJS from "exceljs";

import { Product, ProductStatus } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";
import _ from "./../../domain/entities/generic/Collection";
import { FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";

const DEFAULT_COLUMNS = ["Id", "Title", "Quantity", "Status"];

export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    export(name: string, products: Product[]): FutureData<void> {
        const uniqueProducts = this.getUniqueProducts(products);
        const productsSortedByTitle = this.sortProductsByTitle(uniqueProducts);
        const activeProducts = this.getProductsByStatus(productsSortedByTitle, "active");
        const inactiveProducts = this.getProductsByStatus(productsSortedByTitle, "inactive");

        const spreadSheetDocument = this.generateProductSpreadSheet(
            name,
            activeProducts,
            inactiveProducts
        );

        return this.exportToSpreadSheet(spreadSheetDocument);
    }

    private generateProductSpreadSheet(
        name: string,
        activeProducts: Product[],
        inactiveProducts: Product[]
    ): SpreadSheetDocument {
        const totalNumberProducts = activeProducts.length + inactiveProducts.length;
        return {
            name: name,
            sheets: [
                {
                    columns: DEFAULT_COLUMNS,
                    name: "Active Products",
                    rows: activeProducts.map(p => [p.id, p.title, p.quantity.value, p.status]),
                },
                {
                    columns: DEFAULT_COLUMNS,
                    name: "Inactive Products",
                    rows: inactiveProducts.map(p => [p.id, p.title, p.quantity.value, p.status]),
                },
                {
                    columns: ["# Products", "# Items total", "# Items active", "# Items inactive"],
                    name: "Summary",
                    rows: [
                        [
                            totalNumberProducts || "",
                            this.getTotalQuantityOfProducts([
                                ...activeProducts,
                                ...inactiveProducts,
                            ]) || "",
                            this.getTotalQuantityOfProducts(activeProducts) || "",
                            this.getTotalQuantityOfProducts(inactiveProducts) || "",
                        ],
                    ],
                },
            ],
        };
    }

    private exportToSpreadSheet(spreadSheetDocument: SpreadSheetDocument): FutureData<void> {
        const workbook = new ExcelJS.Workbook();

        spreadSheetDocument.sheets.forEach(sheet => {
            const sh = workbook.addWorksheet(sheet.name);
            sh.addRow(sheet.columns);
            sh.addRows(sheet.rows);
        });

        workbook.xlsx.writeFile(spreadSheetDocument.name);
        return Future.success(undefined);
    }

    private getUniqueProducts(products: Product[]): Product[] {
        return _(products)
            .uniqBy(product => product.id)
            .value();
    }

    private sortProductsByTitle(products: Product[]): Product[] {
        return _(products)
            .sortBy(product => product.title)
            .value();
    }

    private getProductsByStatus(products: Product[], status: ProductStatus): Product[] {
        return _(products)
            .filter(product => product.status === status)
            .value();
    }

    private getTotalQuantityOfProducts(products: Product[]): number {
        const totalQuantity = products.reduce(
            (total, product) => total + product.quantity.value,
            0
        );
        return totalQuantity;
    }
}

type SpreadSheetDocument = {
    name: string;
    sheets: SpreadSheet[];
};

type SpreadSheet = {
    name: SpreadSheetName;
    columns: string[];
    rows: (string | number)[][];
};

type SpreadSheetName = string;
