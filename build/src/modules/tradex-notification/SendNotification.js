"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = exports.create = void 0;
const NotificationRequest_1 = require("./NotificationRequest");
class SendNotification {
    constructor(send, notificationListenningTopic) {
        this.send = send;
        this.notificationListenningTopic = notificationListenningTopic;
    }
    sendEmail(txId, conf, locale, template) {
        const request = new NotificationRequest_1.default();
        request.setConfiguration(conf);
        request.locale = locale;
        request.template = template;
        this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
    }
    sendVerificationEmail(txId, conf, locale, data) {
        const request = new NotificationRequest_1.default();
        request.setConfiguration(conf);
        request.locale = locale;
        request.add(data.getTemplate(), data);
        this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
    }
    sendResetPasswordEmail(txId, conf, locale, data) {
        const request = new NotificationRequest_1.default();
        request.setConfiguration(conf);
        request.locale = locale;
        request.add(data.getTemplate(), data);
        this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
    }
    sendPushNotification(txId, conf, data) {
        const request = new NotificationRequest_1.default();
        request.setConfiguration(conf);
        request.add(data.getTemplate(), data);
        this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
    }
    sendSocketCluser(txId, conf, data) {
        const request = new NotificationRequest_1.default();
        request.setConfiguration(conf);
        request.add(data.getTemplate(), data);
        this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
    }
    sendSms(txId, conf, data, locale) {
        const request = new NotificationRequest_1.default();
        request.setConfiguration(conf);
        request.locale = locale;
        request.add(data.getTemplate(), data);
        this.send.sendMessage(txId, this.notificationListenningTopic, '', request.toJson());
    }
}
exports.default = SendNotification;
let instance = null;
function create(send, notificationListenningTopic = 'notification') {
    instance = new SendNotification(send, notificationListenningTopic);
}
exports.create = create;
function getInstance() {
    return instance;
}
exports.getInstance = getInstance;
//# sourceMappingURL=SendNotification.js.map