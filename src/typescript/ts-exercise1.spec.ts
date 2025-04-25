import { expect, test } from "vitest";
import { Either } from "../domain/entities/generic/Either";

/*
EXERCISE: Beware of unsafe "as" castings.

Refactor the function `getRequestFromString` so:

1) The tests pass.
2) It's 100% type-safe.
*/

export type Request = {
    id: string;
    status: RequestStatus;
};

type RequestStatus = "pending" | "success" | "error";

function isRequestStatus(value: unknown): value is RequestStatus {
    return (
        typeof value === "string" &&
        (value === "pending" || value === "success" || value === "error")
    );
}

function isRequest(obj: unknown): obj is Request {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    const hasIdProperty = "id" in obj && typeof obj.id === "string";
    const hasRequestStatusProperty = "status" in obj && isRequestStatus(obj.status);

    return hasIdProperty && hasRequestStatusProperty;
}

function getRequestFromString(value: string): Either<Error, Request> {
    const parsedValue = JSON.parse(value);
    if (isRequest(parsedValue)) {
        return Either.success(parsedValue);
    } else {
        return Either.error(new Error("Invalid request"));
    }
}

/* Tests */

test("request with invalid status", () => {
    const requestE = getRequestFromString(`{"id": "123", "status": "WRONG"}`);
    expect(requestE.isSuccess()).toBe(false);
});

test("request with valid status", () => {
    const requestE = getRequestFromString(`{"id": "123", "status": "pending"}`);
    expect(requestE.isSuccess()).toBe(true);
    expect(getSuccess(requestE)).toEqual({ id: "123", status: "pending" });
});

// Get the success value from an Either or throw an error
function getSuccess<E, D>(value: Either<E, D>): D {
    return value.match({
        success: data => {
            return data;
        },
        error: () => {
            throw new Error("Expected success");
        },
    });
}
