import ITemplateData from './ITemplateData';

export default class DisconnectNotificationData implements ITemplateData {

  public getTemplate(): string {
    return 'disconnect_notification';
  }
}