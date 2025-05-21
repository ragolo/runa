import { Transaction } from "../../domain/entities/Transaction";

export interface DepositCalculator {
  calculate(deposits: Transaction[], customerAddresses: Record<string, string>): Record<string, string>;
}

export class CustomerDepositsCalculator implements DepositCalculator {
  calculate(deposits: Transaction[], customerAddresses: Record<string, string>): Record<string, string> {
    const summary: Record<string, { count: number, sum: number }> = {};
    Object.keys(customerAddresses).forEach(name => {
      summary[name] = { count: 0, sum: 0 };
    });

    for (const deposit of deposits) {
      for (const [name, addr] of Object.entries(customerAddresses)) {
        if (deposit.address === addr) {
          summary[name].count += 1;
          summary[name].sum += Number(deposit.amount) || 0;
        }
      }
    }

    const result: Record<string, string> = {};
    for (const name of Object.keys(customerAddresses)) {
      result[`Deposited for ${name}`] = `count=${summary[name].count} sum=${summary[name].sum.toFixed(8)}`;
    }
    return result;
  }
}

export class SmallestDepositCalculator implements DepositCalculator {
  calculate(deposits: Transaction[]): Record<string, string> {
    let smallest = Number.POSITIVE_INFINITY;
    for (const deposit of deposits) {
      const amount = Number(deposit.amount) || 0;
      if (amount < smallest) smallest = amount;
    }
    return {
      "Smallest valid deposit": smallest === Number.POSITIVE_INFINITY ? '0.00000000' : smallest.toFixed(8)
    };
  }
}

export class LargestDepositCalculator implements DepositCalculator {
  calculate(deposits: Transaction[]): Record<string, string> {
    let largest = 0;
    for (const deposit of deposits) {
      const amount = Number(deposit.amount) || 0;
      if (amount > largest) largest = amount;
    }
    return {
      "Largest valid deposit": largest.toFixed(8)
    };
  }
}

export class WithoutReferenceCalculator implements DepositCalculator {
  calculate(deposits: Transaction[], customerAddresses: Record<string, string>): Record<string, string> {
    let count = 0;
    let sum = 0;
    const knownAddresses = new Set(Object.values(customerAddresses));
    for (const deposit of deposits) {
      if (!knownAddresses.has(deposit.address)) {
        count += 1;
        sum += Number(deposit.amount) || 0;
      }
    }
    return {
      "Deposited without reference": `count=${count} sum=${sum.toFixed(8)}`
    };
  }
}