import "reflect-metadata";
import { DepositService } from './DepositService';
import { CustomerDepositsCalculator, SmallestDepositCalculator, LargestDepositCalculator, WithoutReferenceCalculator } from './DepositCalculatorsStrategy';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionRepositoryInterface } from '../../domain/repositories/TransactionRepositoryInterface';

const mockTransactions: Transaction[] = [
  {
    involvesWatchonly: false,
    account: '',
    address: 'addr1',
    category: 'receive',
    amount: 1.5,
    label: '',
    confirmations: 10,
    blockhash: '',
    blockindex: 0,
    blocktime: 0,
    txid: 'tx1',
    vout: 0,
    walletconflicts: [],
    time: 0,
    timereceived: 0,
    bip125Replaceable: '',
    lastblock: '',
    sourcefile: ''
  }
];

const mockRepo: TransactionRepositoryInterface = {
  getValidDeposits: jest.fn().mockResolvedValue(mockTransactions),
  saveOrUpdate: jest.fn(),
  saveOrUpdateBulk: jest.fn(),
  findByTxid: jest.fn(),
  findAll: jest.fn()
};

const customerAddresses = { Alice: 'addr1', Bob: 'addr2' };
const deposits: Transaction[] = [
  { involvesWatchonly: false, account: '', address: 'addr1', category: 'receive', amount: 0.6, label: '', confirmations: 10, blockhash: '', blockindex: 0, blocktime: 0, txid: 'tx1', vout: 0, walletconflicts: [], time: 0, timereceived: 0, bip125Replaceable: '', lastblock: '', sourcefile: '' },
  { involvesWatchonly: false, account: '', address: 'addr1', category: 'receive', amount: 0.2, label: '', confirmations: 10, blockhash: '', blockindex: 0, blocktime: 0, txid: 'tx4', vout: 0, walletconflicts: [], time: 0, timereceived: 0, bip125Replaceable: '', lastblock: '', sourcefile: '' },
  { involvesWatchonly: false, account: '', address: 'addr2', category: 'receive', amount: 2.5, label: '', confirmations: 10, blockhash: '', blockindex: 0, blocktime: 0, txid: 'tx2', vout: 0, walletconflicts: [], time: 0, timereceived: 0, bip125Replaceable: '', lastblock: '', sourcefile: '' },
  { involvesWatchonly: false, account: '', address: 'unknown', category: 'receive', amount: 0.5, label: '', confirmations: 10, blockhash: '', blockindex: 0, blocktime: 0, txid: 'tx3', vout: 0, walletconflicts: [], time: 0, timereceived: 0, bip125Replaceable: '', lastblock: '', sourcefile: '' }
];

describe('DepositService', () => {
  it('should summarize deposits correctly', async () => {
    const service = new DepositService(mockRepo);
    service.setCustomerAddresses(customerAddresses);
    service.setCalculators([
      new CustomerDepositsCalculator(),
      new SmallestDepositCalculator(),
      new LargestDepositCalculator(),
      new WithoutReferenceCalculator()
    ]);
    const summary = await service.getDepositSummary();
    expect(summary["Deposited for Alice"]).toContain("count=1");
    expect(summary["Deposited for Alice"]).toContain("sum=1.50000000");
  });
});

describe('CustomerDepositsCalculator', () => {
  it('should count and sum valid deposits for known customers', () => {
    const calc = new CustomerDepositsCalculator();
    const result = calc.calculate(deposits, customerAddresses);
    expect(result['Deposited for Alice']).toBe('count=2 sum=0.80000000');
    expect(result['Deposited for Bob']).toBe('count=1 sum=2.50000000');
  });
});

describe('SmallestDepositCalculator', () => {
  it('should find the smallest valid deposit', () => {
    const calc = new SmallestDepositCalculator();
    const result = calc.calculate(deposits);
    expect(result['Smallest valid deposit']).toBe('0.20000000');
  });
});

describe('LargestDepositCalculator', () => {
  it('should find the largest valid deposit', () => {
    const calc = new LargestDepositCalculator();
    const result = calc.calculate(deposits);
    expect(result['Largest valid deposit']).toBe('2.50000000');
  });
});

describe('WithoutReferenceCalculator', () => {
  it('should count and sum deposits without reference', () => {
    const calc = new WithoutReferenceCalculator();
    const result = calc.calculate(deposits, customerAddresses);
    expect(result['Deposited without reference']).toBe('count=1 sum=0.50000000');
  });
});