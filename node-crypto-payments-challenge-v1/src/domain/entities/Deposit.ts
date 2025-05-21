export class Deposit {
    constructor(
        public amount: number,
        public address: string,
        public confirmations: number,
        public category: string
    ) {}
}