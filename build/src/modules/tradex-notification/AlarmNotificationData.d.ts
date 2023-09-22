import ITemplateData from "./ITemplateData";
export default class AlarmNotificationData implements ITemplateData {
    code: string;
    value: number;
    getTemplate(): string;
}
