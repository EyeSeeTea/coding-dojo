import { describe, expect, it } from "vitest";
import { Day } from "../Day";

describe("Day", () => {
    describe("constructor", () => {
        it("should throw an error if the date is invalid", () => {
            expect(() => new Day(2025, 2, 29)).toThrowError("Invalid date");
        });
        it("should have the correct properties", () => {
            const day = new Day(2025, 2, 28);
            expect(day.year).toBe(2025);
            expect(day.month).toBe(2);
            expect(day.day).toBe(28);
        });
    });
    describe("fromDate", () => {
        it("should create a Day from a Date", () => {
            const date = new Date(2025, 0, 27);
            const day = Day.fromDate(date);
            expect(day.year).toBe(2025);
            expect(day.month).toBe(1);
            expect(day.day).toBe(27);
        });
    });
    describe("toString", () => {
        it("should return a string representation in format YYYY-MM-DD", () => {
            const day = new Day(2025, 2, 28);
            expect(day.toString()).toBe("2025-02-28");
        });
    });
});
