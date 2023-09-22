import ITemplateData from './ITemplateData';
export default class EmailResetPasswordData implements ITemplateData {
    resetCode: string;
    expirationTime: string;
    username: string;
    baseUrl: string;
    getTemplate(): string;
}
