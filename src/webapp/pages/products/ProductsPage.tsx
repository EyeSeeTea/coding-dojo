import {
    ConfirmationDialog,
    ObjectsList,
    TableConfig,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";

import React, { ChangeEvent, useEffect, useMemo } from "react";
import i18n from "../../../utils/i18n";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useProducts } from "./useProducts";
import { Product, ProductStatus } from "../../../domain/entities/Product";
import { CurrentProduct } from "./ProductsState";

export const ProductsPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();

    const {
        getProducts,
        pagination,
        initialSorting,
        globalMessage,
        currentProduct,
        updateProductQuantity,
        cancelEditQuantity,
        onChangeQuantity,
        saveEditQuantity,
    } = useProducts();

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    const baseConfig: TableConfig<Product> = useMemo(
        () => ({
            columns: [
                {
                    name: "title",
                    text: i18n.t("Title"),
                    sortable: false,
                },
                {
                    name: "image",
                    text: i18n.t("Image"),
                    sortable: false,
                    getValue: product => {
                        return <img src={product.image} alt={product.title} width={100} />;
                    },
                },

                {
                    name: "quantity",
                    text: i18n.t("Quantity"),
                    sortable: false,
                    getValue: product => product.quantity.value,
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
                        updateProductQuantity(selectedIds[0] || "");
                    },
                },
            ],
            initialSorting,
            paginationOptions: {
                pageSizeOptions: pagination.pageSizeOptions,
                pageSizeInitialValue: pagination.pageSizeInitialValue,
            },
        }),
        [initialSorting, pagination, updateProductQuantity]
    );

    const tableProps = useObjectsTable(baseConfig, getProducts);

    const currentProductLastUpdated = React.useMemo(
        () => currentProduct && currentProduct.lastUpdated.toLocaleString(),
        [currentProduct]
    );

    return (
        <Container>
            <Typography variant="h4">{i18n.t("Products")}</Typography>

            <ObjectsList<Product>
                {...tableProps}
                columns={tableProps.columns}
                onChangeSearch={undefined}
            />
            {currentProduct !== undefined && (
                <EditQuantityProductDialog
                    cancelEditQuantity={cancelEditQuantity}
                    saveEditQuantity={saveEditQuantity}
                    currentProduct={currentProduct}
                    currentProductLastUpdated={currentProductLastUpdated}
                    onChangeQuantity={onChangeQuantity}
                />
            )}
        </Container>
    );
});

interface EditQuantityProductDialogProps {
    onChangeQuantity: (quantity: string) => void;
    cancelEditQuantity: () => void;
    saveEditQuantity: () => Promise<void>;
    currentProduct: CurrentProduct;
    currentProductLastUpdated: string | undefined;
}

const EditQuantityProductDialog: React.FC<EditQuantityProductDialogProps> = React.memo(props => {
    const {
        cancelEditQuantity,
        saveEditQuantity,
        currentProduct,
        currentProductLastUpdated,
        onChangeQuantity,
    } = props;

    const handleChangeQuantity = React.useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onChangeQuantity(event.target.value);
        },
        [onChangeQuantity]
    );

    return (
        <ConfirmationDialog
            isOpen={true}
            title={i18n.t("Update Quantity")}
            onCancel={cancelEditQuantity}
            cancelText={i18n.t("Cancel")}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSave={saveEditQuantity}
            saveText={i18n.t("Save")}
            maxWidth="xs"
            fullWidth
            disableSave={currentProduct.error !== undefined}
        >
            <Typography variant="h6">
                {i18n.t("Last updated: ")}
                {currentProductLastUpdated}
            </Typography>
            <TextField
                label={i18n.t("Quantity")}
                value={currentProduct.quantity}
                onChange={handleChangeQuantity}
                error={currentProduct.error !== undefined}
                helperText={currentProduct.error}
            />
        </ConfirmationDialog>
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
