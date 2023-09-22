import { v4 as uuid } from 'uuid';
import * as Handlebars from 'handlebars';
import { Kafka, Logger } from '../..';
import { createFailResponse } from '../models';
import { TEMPLATE_LOAD_FAILED } from '../errors';

let templateResources: any[] = [];

const init = (msNames: string, requestTopic: string = 'configuration', uri: string = '/api/v1/template'): void => {
  Kafka.getInstance().sendRequest(
    uuid(),
    requestTopic,
    uri,
    {
      msNames: msNames
    })
    .subscribe((message: Kafka.IMessage) => {
      if (message.data.status != null) {
        Logger.error(message.data.status);
      } else {
        templateResources = message.data.data;
      }
    });
}

const getTemplateResources = (): any[] => {
  return templateResources;
}

const compileTemplate = (templateUrl: string, data: any): Promise<string> => {
  return new Promise<string>((resolve: Function, reject: Function) => {
    fetch(templateUrl)
      .then((response: any) => {
        if (response.status >= 400) {
          reject(createFailResponse(TEMPLATE_LOAD_FAILED));
        } else {
          return response.text();
        }
      })
      .then((text: string) => {
        const template = Handlebars.compile(text);
        resolve(template(data));
      })
      .catch((err: any) => {
        reject(createFailResponse(TEMPLATE_LOAD_FAILED));
      });
  });

}

export { init, getTemplateResources, compileTemplate }