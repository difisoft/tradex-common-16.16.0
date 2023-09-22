import ITemplateData from './ITemplateData';

export default class EmailVerificationData implements ITemplateData {
  public activationCode: string;
  public expirationTime: string;
  public username: string;
  public baseUrl: string;

  public getTemplate(): string {
    return 'email_verify';
  }
}