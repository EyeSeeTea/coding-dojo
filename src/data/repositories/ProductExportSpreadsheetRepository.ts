import { Product, ProductStatus } from "../../domain/entities/Product";
import { ProductExportRepository } from "../../domain/entities/ProductExportRepository";
import ExcelJS from "exceljs";
import _ from "../../domain/entities/generic/Collection";
import { Id } from "@eyeseetea/d2-api";

type ProductRow = [Id, string, number, ProductStatus];
export class ProductExportSpreadsheetRepository implements ProductExportRepository {
    createAndPopulateProductWorksheet(
        workbook: ExcelJS.Workbook,
        worksheetName: string,
        headerColumns: string[],
        rows: ProductRow[]
    ) {
        const sheet = workbook.addWorksheet(worksheetName);
        sheet.addRow(headerColumns);
        sheet.addRows(rows);
    }

    createAndPopulateSummaryWorksheet(
        workbook: ExcelJS.Workbook,
        worksheetName: string,
        headerColumns: string[],
        row: (number | undefined)[]
    ) {
        const sheet = workbook.addWorksheet(worksheetName);
        sheet.addRow(headerColumns);
        sheet.addRow(row);
    }

    async export(name: string, products: Product[]): Promise<void> {
        console.debug("products:" + products.map(p => p.title));
        // Create workbook
        const wb = new ExcelJS.Workbook();

        const sortedUniqueProducts: Product[] = _(products)
            .uniqBy(product => product.id)
            .sortBy(product => product.title)
            .value();

        console.debug("sortedUniqueProducts: " + sortedUniqueProducts.map(p => p.title));
        const activeProducts = sortedUniqueProducts
            .filter(product => product.status === "active")
            .map(product => {
                return [
                    product.id,
                    product.title,
                    product.quantity.value,
                    product.status,
                ] as ProductRow;
            });
        console.debug("activeProducts:" + activeProducts.map(p => p));
        this.createAndPopulateProductWorksheet(
            wb,
            "Active Products",
            ["Id", "Title", "Quantity", "Status"],
            activeProducts
        );

        const inactiveProducts = sortedUniqueProducts
            .filter(product => product.status === "inactive")
            .map(product => {
                return [
                    product.id,
                    product.title,
                    product.quantity.value,
                    product.status,
                ] as ProductRow;
            });
        console.debug("inactiveProducts:" + inactiveProducts.map(p => p));
        this.createAndPopulateProductWorksheet(
            wb,
            "Inactive Products",
            ["Id", "Title", "Quantity", "Status"],
            inactiveProducts
        );

        const noOfProducts = sortedUniqueProducts.length ? sortedUniqueProducts.length : undefined;
        const total = sortedUniqueProducts.reduce((aggregator, val) => {
            return aggregator + val.quantity.value;
        }, 0);
        const activeTotal = activeProducts.reduce((aggregator, val) => {
            return aggregator + val[2];
        }, 0);
        const inactiveTotal = inactiveProducts.reduce((aggregator, val) => {
            return aggregator + val[2];
        }, 0);

        const summaryRow = [
            noOfProducts,
            total ? total : undefined,
            activeTotal ? activeTotal : undefined,
            inactiveTotal ? inactiveTotal : undefined,
        ];

        console.debug("summaryRow: " + summaryRow);
        this.createAndPopulateSummaryWorksheet(
            wb,
            "Summary",
            ["# Products", "# Items total", "# Items active", "# Items inactive"],
            summaryRow
        );

        // Write xlsx file
        await wb.xlsx.writeFile(name);
    }
}
