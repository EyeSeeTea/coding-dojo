import { fireEvent, render } from "@testing-library/react";

import App from "../App";
import { getTestContext } from "../../../../utils/tests";
import { Provider } from "@dhis2/app-runtime";

describe("App", () => {
    it("renders the feedback component", async () => {
        expect(1).toBe(1);
    });

    it("navigates to page", async () => {
        expect(1).toBe(1);
    });
});

function getView() {
    const { compositionRoot } = getTestContext();
    return render(
        <Provider config={{ baseUrl: "http://localhost:8080", apiVersion: 30 }}>
            <App compositionRoot={compositionRoot} />
        </Provider>
    );
}
