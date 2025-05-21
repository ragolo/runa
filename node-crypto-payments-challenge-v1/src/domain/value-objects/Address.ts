export class Address {
    private readonly value: string;

    constructor(value: string) {
        this.validate(value);
        this.value = value;
    }

    private validate(value: string): void {
        const addressPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // Basic pattern for Bitcoin addresses
        if (!addressPattern.test(value)) {
            throw new Error('Invalid Bitcoin address');
        }
    }

    public getValue(): string {
        return this.value;
    }
}