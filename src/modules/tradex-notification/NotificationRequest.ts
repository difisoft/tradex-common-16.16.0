import MethodEnum from "./MethodEnum";
import IConfiguration from "./IConfiguration";

export default class NotificationRequest {
  public method: MethodEnum;
  public template: Map<string, any> = new Map();
  public locale: string;
  private configuration: string;
  private configurationData: any;
  private domain: string;

  public add(templateKey: string, data: any): void {
    this.template[templateKey] = data;
  }

  public setConfiguration(configurationData: IConfiguration): void {
    this.configurationData = configurationData;
    this.configuration = JSON.stringify(configurationData);
    this.method = configurationData.getMethod();
    this.domain = configurationData.domain;
  }

  public getConfiguration<T extends IConfiguration>(): T {
    if (!this.configurationData && this.configuration) {
      this.configurationData = JSON.parse(this.configuration);
    }
    return <T>this.configurationData;
  }

  public toJson(): any {
    return {
      method: this.method.toString(),
      template: this.template,
      locale: this.locale,
      configuration: this.configuration,
      domain: this.domain,
    };
  }

  public fromJson(json: string): void {
    const data: any = JSON.parse(json);
    this.method = data.method;
    this.template = data.template;
    this.locale = data.locale;
    this.configuration = data.configuration;
    this.domain = data.domain;
  }
}