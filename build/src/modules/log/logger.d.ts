interface ILogger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    logError: (message: any, err: any) => void;
    create: (conf: any, log4JS?: boolean) => void;
}
declare class LoggerWrapper implements ILogger {
    private realLogger;
    constructor(realLogger: ILogger);
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    logError: (message: any, err: any) => void;
    create: (conf: any, log4JS?: boolean) => void;
    setLogger: (realLogger: ILogger) => void;
}
declare const logger: LoggerWrapper;
declare class ConsoleLogger implements ILogger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    logError: (message: any, err: any) => void;
    create: (conf: any, log4JS?: boolean) => void;
}
export { logger, ConsoleLogger };
