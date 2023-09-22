import ITemplateData from './ITemplateData';

export default class EmailResetPasswordData implements ITemplateData {
  public resetCode: string;
  public expirationTime: string;
  public username: string;
  public baseUrl: string;

  public getTemplate(): string {
    return 'email_reset_password';
  }
}