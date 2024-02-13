import React, { ChangeEvent, useCallback, useMemo } from "react";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import i18n from "../../../utils/i18n";
import { CurrentProduct } from "./ProductsState";
import { TextField, Typography } from "@material-ui/core";
import moment from "moment";

interface EditQuantityProductDialogProps {
    currentProduct: CurrentProduct;
    cancelEditQuantity: () => void;
    saveEditQuantity: () => void;
    onChangeQuantity: (quantity: string) => void;
}

export const EditQuantityProductDialog: React.FC<EditQuantityProductDialogProps> = React.memo(
    ({ currentProduct, cancelEditQuantity, saveEditQuantity, onChangeQuantity }) => {
        const lastUpdatedCurrentProduct = useMemo(
            () =>
                currentProduct
                    ? `${i18n.t("Last updated")}: ${moment(currentProduct.lastUpdated).format(
                          "yyyy-MM-DD HH:mm"
                      )}`
                    : undefined,
            [currentProduct]
        );

        const handleChangeQuantity = useCallback(
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChangeQuantity(event.target.value),
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
                <Typography style={{ marginBottom: 10 }}>{lastUpdatedCurrentProduct}</Typography>

                <TextField
                    label={i18n.t("Quantity")}
                    value={currentProduct.quantity}
                    onChange={handleChangeQuantity}
                    error={currentProduct.error !== undefined}
                    helperText={currentProduct.error}
                />
            </ConfirmationDialog>
        );
    }
);
