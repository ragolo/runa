import { Router, Request, Response, NextFunction } from 'express';
import { DepositController } from '../controllers/DepositController';

const router = Router();

const depositController = new DepositController();

// Fix: Use async handler and pass only (req, res, next) to Express
router.post('/deposits/process', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await depositController.processDeposits(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/deposits/summary', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await depositController.getDepositSummary(req, res);
    } catch (err) {
        next(err);
    }
});

export const routes = router;