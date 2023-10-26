import {
    ConfirmationDialog,
    ObjectsList,
    TableConfig,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";

import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import i18n from "../../../utils/i18n";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useProducts } from "../../hooks/useProducts";
import { Product } from "../../../domain/entities/Product";

type ProductStatus = "active" | "inactive";

export const ProductsPage: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const [editedQuantity, setEditedQuantity] = useState<string | undefined>(undefined);
    const [quantityError, setQuantityError] = useState<string | undefined>(undefined);
    const [selectedProduct, setSelectedProduct] = useState<Product>();

    const { getProductById, getProducts, reload, saveProduct } = useProducts();

    const updatingQuantity = useCallback(
        (id: string) => {
            getProductById(id).run(
                product => {
                    setEditedQuantity(product.quantity.toString());
                    setSelectedProduct(product);
                },
                err => snackbar.error(err.message)
            );
        },
        [snackbar, getProductById]
    );

    const baseConfig: TableConfig<Product> = useMemo(
        () => ({
            columns: [
                {
                    name: "title",
                    text: i18n.t("Title"),
                    sortable: false,
                },
                {
                    name: "imageUrl",
                    text: i18n.t("Image"),
                    sortable: false,
                    getValue: product => {
                        return <img src={product.imageUrl} alt={product.title} width={100} />;
                    },
                },

                {
                    name: "quantity",
                    text: i18n.t("Quantity"),
                    sortable: false,
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
                    onClick: async (selectedIds: string[]) => {
                        updatingQuantity(selectedIds[0] || "");
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
        [updatingQuantity]
    );

    const tableProps = useObjectsTable(baseConfig, getProducts);

    function cancelEditQuantity(): void {
        setEditedQuantity(undefined);
        setQuantityError(undefined);
        setSelectedProduct(undefined);
    }

    function saveEditQuantity() {
        if (selectedProduct) {
            saveProduct(selectedProduct, +(editedQuantity || "0")).run(
                product => {
                    snackbar.success(
                        `Quantity ${product.quantity} for ${selectedProduct.title} saved`
                    );
                    setSelectedProduct(undefined);
                    setEditedQuantity(undefined);
                    reload();
                },
                err => {
                    snackbar.error(
                        `An error has ocurred saving quantity ${editedQuantity} for ${selectedProduct.title}: ${err.message}`
                    );
                }
            );
        }
    }

    function handleChangeQuantity(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
        setEditedQuantity(event.target.value);
        compositionRoot.products.validateQuantity.execute(Number(event.target.value)).run(
            () => {
                setQuantityError(undefined);
            },
            err => {
                setQuantityError(err.message);
            }
        );
    }

    return (
        <Container>
            <Typography variant="h4">{i18n.t("Products")}</Typography>

            <ObjectsList<Product>
                {...tableProps}
                columns={tableProps.columns}
                onChangeSearch={undefined}
            />
            <ConfirmationDialog
                isOpen={Boolean(selectedProduct)}
                title={i18n.t("Update Quantity")}
                onCancel={cancelEditQuantity}
                cancelText={i18n.t("Cancel")}
                onSave={saveEditQuantity}
                saveText={i18n.t("Save")}
                maxWidth="xs"
                fullWidth
                disableSave={quantityError !== undefined}
            >
                <TextField
                    label={i18n.t("Quantity")}
                    defaultValue={editedQuantity}
                    onChange={handleChangeQuantity}
                    error={quantityError !== undefined}
                    helperText={quantityError}
                    required
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
