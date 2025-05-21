import "reflect-metadata";
import "./infrastructure/ioc/container";

import app from './interfaces/api/app';
import { AppDataSource } from './infrastructure/database/typeorm-data-source';
import { PeriodicProcessor } from './interfaces/cron/PeriodicProcessor';

const PORT = process.env.PORT || 3000;
const ENABLE_PERIODIC_PROCESSOR = process.env.ENABLE_PERIODIC_PROCESSOR === 'true';

AppDataSource.initialize()
  .then(async () => {
    console.log("Database initialized");
    await AppDataSource.runMigrations();
    console.log("Migrations executed");

    if (ENABLE_PERIODIC_PROCESSOR) {
      console.log("Periodic deposit processing is enabled.");
      const periodicProcessor = new PeriodicProcessor(process.env.CRON_EXPRESSION); 
      periodicProcessor.start();
      console.log("Periodic deposit processing enabled.");
    } else {
      console.log("Periodic deposit processing is disabled.");
    }

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed", error);
    process.exit(1);
  });