import { Observable } from "rx";
import { IMessage } from "./types";
import { logger } from "../log";
import { getInstance, SendRequest } from "./SendRequest";
import GeneralError from "../errors/GeneralError";
import UriNotFound from "../errors/UriNotFound";
import IResponse, { createFailResponse } from "../models/IResponse";
import { ForwardError } from "../errors";
import { Logger } from '../..';
import { IKafkaMessage } from './StreamHandler';
import NoForwardResponseError from "../errors/NoForwardResponseError";

declare type HandleResult = Observable<any> | Promise<any> | boolean;
declare type Handle = (msg: IMessage, originalMessage?: IKafkaMessage) => HandleResult;

class MessageHandler {
  protected activeRequestMap: {[k: string]: IMessage} = {};
  private timeoutinMs?: number;
  private requestId: number = new Date().getTime();
  constructor(private sendRequest: SendRequest = null, timeoutinMs?: number) {
    if (this.sendRequest == null) {
      this.sendRequest = getInstance();
    }
    this.timeoutinMs = timeoutinMs;
    if (this.timeoutinMs == null && process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT != null  && process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT !== '') {
      try {
        this.timeoutinMs = parseInt(process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT, 10);
      } catch (e) {
        Logger.error("wrong timeout setting", process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT);
      }
    }
  }

  public getActiveMessage: (msgId: string) => IMessage | undefined = (msgId: string) => {
    return this.activeRequestMap[msgId];
  };

  public handle: (message: IKafkaMessage, func: Handle) => void = (message: IKafkaMessage, func: Handle) => {
    if (message.value == null) {
      return;
    }
    const msgString: string = message.value.toString();
    try {
      const startTime: [number, number] = process.hrtime();
      let diff: [number, number] = null;
      Logger.info(`receive msg: ${msgString}`);
      const msg: IMessage = JSON.parse(msgString);
      if (msg.t != null && this.timeoutinMs != null && new Date().getTime() - msg.t > this.timeoutinMs) {
        Logger.warn(`ignore ${msg.uri} ${msg.transactionId} - ${msg.messageId} since it's time out`);
        return;
      }
      if (msg.et != null && new Date().getTime() > msg.et) {
        Logger.warn(`ignore ${msg.uri} ${msg.transactionId} - ${msg.messageId} since it's time out`);
        return;
      }
      const shouldResponse = this.shouldResponse(msg);
      if (shouldResponse && msg.uri === "/healthcheck") {
        this.sendRequest.sendResponse(
          msg.transactionId,
          msg.messageId,
          msg.responseDestination.topic,
          msg.responseDestination.uri,
          {
            status: "ON",
          }
        );
      }
      this.requestId += 1;
      msg.msgHandlerUniqueId = `${msg.transactionId}_${msg.messageId}_${this.requestId}`;
      this.activeRequestMap[msg.msgHandlerUniqueId] = msg;
      const obs: HandleResult = func(msg, message);
      if (obs === false) {
        if (shouldResponse) {
          diff = process.hrtime(startTime);
          Logger.info(`process request ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
          this.sendRequest.sendResponse(
            msg.transactionId,
            msg.messageId,
            msg.responseDestination.topic,
            msg.responseDestination.uri,
            this.getErrorMessage(new UriNotFound())
          );
        }
        delete this.activeRequestMap[msg.msgHandlerUniqueId];
        return;
      } else if (obs === true) {
        diff = process.hrtime(startTime);
        Logger.info(`forward request ${msg.transactionId} ${msg.messageId} ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
        delete this.activeRequestMap[msg.msgHandlerUniqueId];
        return; // forwarding. do nothing
      } else {
        const handleError = (err: Error) => {
          logger.logError(`error while processing request ${msg.transactionId} ${msg.messageId} ${msg.uri}`, err);
          delete this.activeRequestMap[msg.msgHandlerUniqueId];
          if (err instanceof NoForwardResponseError) {
            return;
          }
          if (shouldResponse) {
            this.sendRequest.sendResponse(
              msg.transactionId,
              msg.messageId,
              msg.responseDestination.topic,
              msg.responseDestination.uri,
              this.getErrorMessage(err)
            );
          }
          diff = process.hrtime(startTime);
          Logger.info(`handle request ${msg.transactionId} ${msg.messageId} ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
        };
        const handleData = (data: any) => {
          delete this.activeRequestMap[msg.msgHandlerUniqueId];
          try {
            if (shouldResponse) {
              this.sendRequest.sendResponse(
                <string>msg.transactionId,
                msg.messageId,
                msg.responseDestination.topic,
                msg.responseDestination.uri,
                {data: data}
              );
            }
            diff = process.hrtime(startTime);
            Logger.info(`handle request ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
          } catch (err) {
            handleError(err);
          }
        }
        if (obs instanceof Promise) {
          obs.then(handleData).catch(handleError);
        } else {
          obs.subscribe(handleData, handleError);
        }
      }
    } catch (e) {
      logger.logError(`error while processing message ${message.topic} ${message.value} ${msgString}`, e);
    }
  };

  public getErrorMessage = (error: Error) => {
    return getErrorMessage(error);
  };

  private shouldResponse(msg: IMessage) {
    return msg.responseDestination && msg.responseDestination.topic;
  }
}

function getErrorMessage(error: Error): IResponse {
  if (error['isSystemError']) {// tslint:disable-line
    if (error['source']) {// tslint:disable-line
      logger.logError('error', error['source']);// tslint:disable-line
    } else {
      logger.logError('error', error);
    }
    return createFailResponse((<GeneralError>error).code, (<GeneralError>error).messageParams,
      ((<GeneralError>error).params && (<GeneralError>error).params.length > 0) ? (<GeneralError>error).params : undefined);
  } else if (error['isForwardError']) {// tslint:disable-line
    return {status: (<ForwardError>error).status};
  } else {
    logger.logError('error', error);
    return createFailResponse('INTERNAL_SERVER_ERROR');
  }
}

export {
  HandleResult,
  Handle,
  MessageHandler,
  getErrorMessage,
}