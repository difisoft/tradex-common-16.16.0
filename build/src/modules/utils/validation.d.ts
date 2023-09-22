import InvalidParameterError from '../errors/InvalidParameterError';
import IParamError from '../models/IParamError';
declare type CheckFunc = (value: any, name: string) => IValidationResult;
declare type CheckFuncBool = (value: any, name: string) => boolean;
declare interface IValidationResult {
    success: boolean;
    data?: any;
    params?: IParamError[];
}
declare function createFailValidation(code: string, messageParams: string[], paramName: string): IValidationResult;
declare function createFailFromError(error: InvalidParameterError): IValidationResult;
declare function createSuccessValidation(data: any): IValidationResult;
export declare class Validate {
    private readonly fieldValue;
    private readonly fieldName;
    private isRequired;
    private isFetchCount;
    private checks;
    constructor(fieldValue: any, fieldName: string);
    setRequire(): Validate;
    setIsFetchCount(): Validate;
    add(func: CheckFunc): Validate;
    addCheck(func: CheckFuncBool, code?: string, messageParams?: string[], paramName?: string): Validate;
    adds(funcs: CheckFunc[]): Validate;
    throwValid(invalidParameterError?: InvalidParameterError): void;
    valid(): IValidationResult;
    checkGt(minPrice: number): Validate;
}
declare function validate(fieldValue: any, fieldName: string): Validate;
declare function validateEmail(fieldValue: string, paramName?: string): IValidationResult;
declare function validatePassword(fieldValue: string, paramName?: string, regex?: string): IValidationResult;
export { validate, validateEmail, createFailValidation, createFailFromError, createSuccessValidation, validatePassword };
