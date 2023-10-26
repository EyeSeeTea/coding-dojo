import { useEffect, useState } from "react";
import { Product } from "../../domain/entities/Product";
import { useAppContext } from "../contexts/app-context";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";

export const useProducts = () => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [products, setProduts] = useState<Product[]>([]);

    useEffect(() => {
        compositionRoot.products.getProducts.execute().run(
            products => {
                setProduts(products);
            },
            () => {
                snackbar.error(i18n.t("Error fetching Products"));
            }
        );
    }, [compositionRoot.products.getProducts, snackbar]);

    return products;
};
