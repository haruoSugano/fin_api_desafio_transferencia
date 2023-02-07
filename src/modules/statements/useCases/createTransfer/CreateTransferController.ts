import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { sender_id } = request.params;
    const { amount, description, receive_id } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      user_id,
      type,
      amount,
      description,
      sender_id: sender_id,
      receive_id
    });

    return response.status(201).json(statement);
  }
}
