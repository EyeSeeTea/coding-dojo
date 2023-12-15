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
                this.getProductSheet("Active Products", activeProducts),
                this.getProductSheet("Inactive Products", inactiveProducts),
                this.getSummarySheet(totalNumberProducts, activeProducts, inactiveProducts),
            ],
        };
    }

    private getSummarySheet(
        totalNumberProducts: number,
        activeProducts: Product[],
        inactiveProducts: Product[]
    ): SpreadSheet {
        return {
            columns: ["# Products", "# Items total", "# Items active", "# Items inactive"],
            name: "Summary",
            rows: [
                [
                    this.getValueOrEmpty(totalNumberProducts),
                    this.getValueOrEmpty(
                        this.getTotalQuantityOfProducts([...activeProducts, ...inactiveProducts])
                    ),
                    this.getValueOrEmpty(this.getTotalQuantityOfProducts(activeProducts)),
                    this.getValueOrEmpty(this.getTotalQuantityOfProducts(inactiveProducts)),
                ],
            ],
        };
    }

    private getValueOrEmpty(value: number): number | undefined {
        return value || undefined;
    }

    private getProductSheet(name: string, products: Product[]): SpreadSheet {
        return {
            columns: DEFAULT_COLUMNS,
            name: name,
            rows: products.map(p => [p.id, p.title, p.quantity.value, p.status]),
        };
    }

    private exportToSpreadSheet(spreadSheetDocument: SpreadSheetDocument): FutureData<void> {
        const workbook = new ExcelJS.Workbook();

        spreadSheetDocument.sheets.forEach(sheet => {
            const sh = workbook.addWorksheet(sheet.name);
            sh.addRow(sheet.columns);
            sh.addRows(sheet.rows);
        });

        return Future.fromPromise<Error, void>(workbook.xlsx.writeFile(spreadSheetDocument.name));
    }

    private getUniqueProducts(products: Product[]): Product[] {
        return _(products)
            .uniqWith((product1, product2) => {
                return product1.equals(product2);
            })
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
        return _(products)
            .map(product => product.quantity.value)
            .sum();
    }
}

type SpreadSheetDocument = {
    name: string;
    sheets: SpreadSheet[];
};

type SpreadSheet = {
    name: SpreadSheetName;
    columns: string[];
    rows: (string | number | undefined)[][];
};

type SpreadSheetName = string;
