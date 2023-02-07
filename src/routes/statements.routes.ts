import { Router } from 'express';

import { CreateStatementController } from '../modules/statements/useCases/createStatement/CreateStatementController';
import { GetBalanceController } from '../modules/statements/useCases/getBalance/GetBalanceController';
import { GetStatementOperationController } from '../modules/statements/useCases/getStatementOperation/GetStatementOperationController';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';
import { CreateTransferController } from '../modules/statements/useCases/createTransfer/CreateTransferController';

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const getStatementOperationController = new GetStatementOperationController();
const createStatementController = new CreateStatementController();
const createTransferController = new CreateTransferController();

statementRouter.use(ensureAuthenticated);

statementRouter.get('/balance', getBalanceController.execute);
statementRouter.post('/deposit', createStatementController.execute);
statementRouter.post('/withdraw', createStatementController.execute);
statementRouter.post('/transfer/:sender_id', createTransferController.execute);
statementRouter.get('/:statement_id', getStatementOperationController.execute);

export { statementRouter };
