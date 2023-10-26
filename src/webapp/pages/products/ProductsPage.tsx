import {
    ConfirmationDialog,
    GetRows,
    ObjectsList,
    TableConfig,
    TablePagination,
    TableSorting,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";

import React, { ChangeEvent, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import i18n from "../../../utils/i18n";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Product, ProductStatus } from "../../../domain/entities/Product";
import { useProducts } from "../../hooks/useProducts";

export const ProductsPage: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const products = useProducts();

    const [showEditQuantityDialog, setShowEditQuantityDialog] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<string | undefined>(undefined);
    const [quantityError, setQuantityError] = useState<string | undefined>(undefined);

    const baseConfig: TableConfig<Product> = useMemo(
        () => ({
            columns: [
                {
                    name: "title",
                    text: i18n.t("Title"),
                    sortable: false,
                    getValue: product => product.title,
                },
                {
                    name: "image",
                    text: i18n.t("Image"),
                    sortable: false,
                    getValue: product => (
                        <img src={product.image} alt={product.title} width={100} />
                    ),
                },

                {
                    name: "quantity",
                    text: i18n.t("Quantity"),
                    sortable: false,
                    getValue: product => product.quantity,
                },
                {
                    name: "status",
                    text: i18n.t("Status"),
                    sortable: false,
                    getValue: product => {
                        return (
                            <StatusContainer status={product.status}>
                                <Typography variant="body1">{product.status}</Typography>
                            </StatusContainer>
                        );
                    },
                },
            ],
            actions: [
                {
                    name: "updateQuantity",
                    text: i18n.t("Update Quantity"),
                    icon: <SystemUpdateAltIcon />,
                    onClick: (selectedIds: string[]) => {
                        if (selectedIds[0]) handleClick(selectedIds[0]);
                    },
                },
            ],
            initialSorting: {
                field: "title" as const,
                order: "asc" as const,
            },
            paginationOptions: {
                pageSizeOptions: [10, 20, 50],
                pageSizeInitialValue: 10,
            },
        }),
        []
    );

    const handleClick = (productId: string) => {
        setShowEditQuantityDialog(true);
        setEditingProductId(productId);
    };

    function cancelEditQuantity(): void {
        setShowEditQuantityDialog(false);
        setEditingProductId(undefined);
        setEditedQuantity(undefined);
        setQuantityError(undefined);
    }

    const getRows: GetRows<Product> = useMemo(
        () =>
            async (_search: string, _paging: TablePagination, _sorting: TableSorting<Product>) => {
                const emptyPager = {
                    page: 1,
                    pageCount: 1,
                    total: 0,
                    pageSize: 10,
                };

                return {
                    pager: emptyPager,
                    objects: products || [],
                };
            },
        [products]
    );

    const tableProps = useObjectsTable(baseConfig, getRows);

    function handleChangeQuantity(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
        const isValidNumber = !isNaN(+event.target.value);

        if (!isValidNumber) {
            setQuantityError("Only numbers are allowed");
            setEditedQuantity(event.target.value);
        } else {
            const value = Number(event.target.value);

            if (value < 0) {
                setQuantityError("Only positive numbers are allowed");
            } else {
                setQuantityError(undefined);
            }

            setEditedQuantity(event.target.value);
        }
    }

    const handleSave = () => {
        const product = products.find(product => product.id === editingProductId);
        if (product && editedQuantity) {
            product.quantity = parseInt(editedQuantity);
            compositionRoot.products.saveProduct.execute(product).run(
                () => {
                    setShowEditQuantityDialog(false);
                },
                err => {
                    snackbar.error(err.message);
                    setShowEditQuantityDialog(false);
                }
            );
        }
    };

    return (
        <Container>
            <Typography variant="h4">{i18n.t("Products")}</Typography>

            <ObjectsList<Product>
                {...tableProps}
                columns={tableProps.columns}
                onChangeSearch={undefined}
            />
            <ConfirmationDialog
                isOpen={showEditQuantityDialog}
                title={i18n.t("Update Quantity")}
                onCancel={cancelEditQuantity}
                cancelText={i18n.t("Cancel")}
                onSave={handleSave}
                saveText={i18n.t("Save")}
                maxWidth="xs"
                fullWidth
                disableSave={quantityError !== undefined}
            >
                <TextField
                    label={i18n.t("Quantity")}
                    value={editedQuantity}
                    onChange={handleChangeQuantity}
                    error={quantityError !== undefined}
                    helperText={quantityError}
                />
            </ConfirmationDialog>
        </Container>
    );
});

const Container = styled.div`
    padding: 32px;
`;

const StatusContainer = styled.div<{ status: ProductStatus }>`
    background: ${props => (props.status === "inactive" ? "red" : "green")};
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding: 8px;
    border-radius: 20px;
    width: 100px;
`;
