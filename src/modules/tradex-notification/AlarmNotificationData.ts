import ITemplateData from "./ITemplateData";

export default class AlarmNotificationData implements ITemplateData {
  public code: string;
  public value: number;

  public getTemplate(): string {
    return "alarm_notification";
  }
}