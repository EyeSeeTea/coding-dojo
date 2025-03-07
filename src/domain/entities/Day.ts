export class Day {
    constructor(public year: number, public month: number, public day: number) {}

    static fromString(dateString: string): Day {
        const [year, month, day] = dateString.split("-").map(Number);
        if (
            !this.isValidYear(year) ||
            !this.isValidMonth(month) ||
            !this.isValidDay(year, month, day)
        ) {
            throw new Error("Invalid date string");
        }
        return new Day(year, month, day);
    }

    toString(): string {
        const pad = (num: number) => num.toString().padStart(2, "0");
        return `${this.year}-${pad(this.month)}-${pad(this.day)}`;
    }

    static isValidYear(year: number): boolean {
        return year > 0;
    }

    static isValidMonth(month: number): boolean {
        return month >= 1 && month <= 12;
    }

    static isValidDay(year: number, month: number, day: number): boolean {
        const daysInMonth = [
            31,
            Day.isLeapYear(year) ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31,
        ];

        return day >= 1 && day <= (daysInMonth[month - 1] ?? 0);
    }

    private static isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }
}
