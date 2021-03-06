import { StatusCodes } from 'http-status-codes';
import {
  Controller,
  Middleware,
  Get,
  Post,
  Delete,
  ClassMiddleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middlewares/validationError';
import { Message } from '../db/models/message';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';

@Controller('api/message')
@ClassMiddleware([currentUser, requireAuth])
export class MessageController {
  @Get(':senderId')
  @Middleware([
    param('senderId').isString().withMessage('senderId is required'),
    validateRequest,
  ])
  private async getAllMessages(req: Request, res: Response) {
    const { senderId } = req.params;
    const sendedMessages = await Message.find({ senderId });
    const reccivedMessages = await Message.find({ recciverId: senderId });
    return res
      .status(StatusCodes.OK)
      .send({ sended: sendedMessages, reccived: reccivedMessages });
  }
  @Post('create')
  @Middleware([
    body('senderId').not().isEmpty(),
    body('recciverId').not().isEmpty(),
    body('message').not().isEmpty(),
    body('subject').isLength({ max: 30 }),
    validateRequest,
  ])
  private async createMessage(req: Request, res: Response): Promise<Response> {
    const { senderId, recciverId, message, subject } = req.body;
    const messageDoc = Message.build({
      senderId,
      recciverId,
      message,
      subject,
    });
    await messageDoc.save();
    return res.status(StatusCodes.CREATED).send({ message: messageDoc });
  }

  @Delete('delete/:messageId')
  @Middleware([
    param('messageId').isString().withMessage('messageId is required'),
  ])
  private async deleteMessage(req: Request, res: Response) {
    const { messageId } = req.params;
    const doc = await Message.findOneAndRemove({ _id: messageId });
    res.send(doc ? 'Message was deleted sucessufly' : {});
  }
}
