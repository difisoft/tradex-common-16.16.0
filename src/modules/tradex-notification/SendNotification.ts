import { SendRequestCommon } from '../kafka';
import EmailConfiguration from './EmailConfiguration';
import NotificationRequest from './NotificationRequest';
import EmailVerificationData from './EmailVerificationData';
import OneSignalConfiguration from './OneSignalConfiguration';
import SocketClusterConfiguration from './SocketClusterConfiguration';
import ITemplateData from './ITemplateData';
import EmailResetPasswordData from './EmailResetPasswordData';
import SmsConfiguration from './SmsConfiguration';

export default class SendNotification {
  constructor(private send: SendRequestCommon, private notificationListenningTopic: string) {
  }

  public sendEmail(txId: string, conf: EmailConfiguration, locale: string, template: Map<string, any>) {
    const request: NotificationRequest = new NotificationRequest();
    request.setConfiguration(conf);
    request.locale = locale;
    request.template = template;
    this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
  }

  public sendVerificationEmail(txId: string, conf: EmailConfiguration, locale: string, data: EmailVerificationData) {
    const request: NotificationRequest = new NotificationRequest();
    request.setConfiguration(conf);
    request.locale = locale;
    request.add(data.getTemplate(), data);
    this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
  }


  public sendResetPasswordEmail(txId: string, conf: EmailConfiguration, locale: string, data: EmailResetPasswordData) {
    const request: NotificationRequest = new NotificationRequest();
    request.setConfiguration(conf);
    request.locale = locale;
    request.add(data.getTemplate(), data);
    this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
  }

  public sendPushNotification(txId: string, conf: OneSignalConfiguration, data: ITemplateData) {
    const request: NotificationRequest = new NotificationRequest();
    request.setConfiguration(conf);
    request.add(data.getTemplate(), data);
    this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
  }

  public sendSocketCluser(txId: string, conf: SocketClusterConfiguration, data: ITemplateData) {
    const request: NotificationRequest = new NotificationRequest();
    request.setConfiguration(conf);
    request.add(data.getTemplate(), data);
    this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
  }

  public sendSms(txId: string, conf: SmsConfiguration, data: ITemplateData, locale: string) {
    const request: NotificationRequest = new NotificationRequest();
    request.setConfiguration(conf);
    request.locale = locale;
    request.add(data.getTemplate(), data);
    this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
  }

}
let instance: SendNotification = null;

export function create(send: SendRequestCommon, notificationListenningTopic: string = 'notification') {
  instance = new SendNotification(send, notificationListenningTopic);
}

export function getInstance(): SendNotification {
  return instance;
}
