import "reflect-metadata";
import { container } from "tsyringe";
import { TransactionRepositoryInterface } from "../../domain/repositories/TransactionRepositoryInterface";
import { TransactionRepositoryTypeORM } from "../database/TransactionRepositoryTypeORM";



// Registra la implementación concreta con el token "TransactionRepository"
container.register<TransactionRepositoryInterface>(
  "TransactionRepository",
  { useClass: TransactionRepositoryTypeORM }
);

// Puedes registrar otros servicios aquí si lo necesitas