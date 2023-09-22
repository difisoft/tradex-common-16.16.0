import { SendRequestCommon } from '../kafka';
import EmailConfiguration from './EmailConfiguration';
import EmailVerificationData from './EmailVerificationData';
import OneSignalConfiguration from './OneSignalConfiguration';
import SocketClusterConfiguration from './SocketClusterConfiguration';
import ITemplateData from './ITemplateData';
import EmailResetPasswordData from './EmailResetPasswordData';
import SmsConfiguration from './SmsConfiguration';
export default class SendNotification {
    private send;
    private notificationListenningTopic;
    constructor(send: SendRequestCommon, notificationListenningTopic: string);
    sendEmail(txId: string, conf: EmailConfiguration, locale: string, template: Map<string, any>): void;
    sendVerificationEmail(txId: string, conf: EmailConfiguration, locale: string, data: EmailVerificationData): void;
    sendResetPasswordEmail(txId: string, conf: EmailConfiguration, locale: string, data: EmailResetPasswordData): void;
    sendPushNotification(txId: string, conf: OneSignalConfiguration, data: ITemplateData): void;
    sendSocketCluser(txId: string, conf: SocketClusterConfiguration, data: ITemplateData): void;
    sendSms(txId: string, conf: SmsConfiguration, data: ITemplateData, locale: string): void;
}
export declare function create(send: SendRequestCommon, notificationListenningTopic?: string): void;
export declare function getInstance(): SendNotification;
