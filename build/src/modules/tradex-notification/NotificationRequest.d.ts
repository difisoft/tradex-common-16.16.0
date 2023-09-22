import MethodEnum from "./MethodEnum";
import IConfiguration from "./IConfiguration";
export default class NotificationRequest {
    method: MethodEnum;
    template: Map<string, any>;
    locale: string;
    private configuration;
    private configurationData;
    private domain;
    add(templateKey: string, data: any): void;
    setConfiguration(configurationData: IConfiguration): void;
    getConfiguration<T extends IConfiguration>(): T;
    toJson(): any;
    fromJson(json: string): void;
}
