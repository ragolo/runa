import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "transactions" })
export class TransactionEntity {
    @PrimaryColumn({ type: "text" })
    txid!: string;

    @Column()
    address!: string;

    @Column("numeric")
    amount!: number;

    @Column()
    confirmations!: number;

    @Column({ nullable: true, type: "text" })
    lastblock: string | undefined;

    @Column({ nullable: true, type: "text" })
    sourcefile: string | undefined;

    @Column({ nullable: true, type: "text" })
    category: string | undefined;

    @Column({ nullable: true, type: "text" })
    blockhash: string | undefined;

    @Column({ nullable: true, type: "int", name: "blockindex" })
    blockindex: number | undefined;

    @Column({ nullable: true, type: "bigint", name: "blocktime" })
    blocktime: number | undefined;

    @Column({ nullable: true, type: "int", name: "vout" })
    vout: number | undefined;

    @Column({ type: "jsonb", nullable: true })
    walletconflicts: any[] | undefined;

    @Column({ nullable: true, type: "bigint" })
    time: number | undefined;

    @Column({ nullable: true, type: "bigint" })
    timereceived: number | undefined;

    @Column({ nullable: true, type: "text", name: "bip125_replaceable" })
    bip125Replaceable: string | undefined;

    @Column({ name: "involveswatchonly", nullable: true, type: "boolean" })
    involvesWatchonly: boolean | undefined;

    @Column({ nullable: true, type: "text" })
    account: string | undefined;

    @Column({ nullable: true, type: "text" })
    label: string | undefined;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date | undefined;
}