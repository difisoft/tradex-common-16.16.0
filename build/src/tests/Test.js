"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTest = void 0;
const log_1 = require("../modules/log");
const testResults = [];
function finish() {
    let isError = false;
    log_1.logger.warn('************************************8');
    testResults.forEach((result) => {
        isError = isError && result.success;
        log_1.logger.warn('----------------------------------------------------');
        log_1.logger.warn(`Test '${result.testName}' status '${result.success}' ${result.success ? '' : ` reason '${result.reason}'`}`);
    });
    log_1.logger.warn('************************************8');
    if (isError) {
        setTimeout(() => process.exit(1), 5000);
    }
    else {
        setTimeout(() => process.exit(0), 5000);
    }
}
exports.startTest = (tests) => {
    if (process.argv.length > 2) {
        if (process.argv[2] === 'test') {
            const keys = Object.keys(tests);
            log_1.logger.info('test keys:', keys);
            if (process.argv[3]) {
                if (tests[process.argv[3]]) {
                    log_1.logger.info('running...', process.argv[3]);
                    tests[process.argv[3]]().run().subscribe((data) => testResults.push(data), (err) => log_1.logger.logError('error', err), finish);
                }
            }
            else {
                let run2 = null;
                const run = (i) => {
                    log_1.logger.info('*************running...', keys[i]);
                    tests[keys[i]]().run().subscribe((data) => testResults.push(data), (err) => log_1.logger.logError('error', err), () => {
                        if (i + 1 === keys.length) {
                            finish();
                        }
                        else {
                            run2(i + 1);
                        }
                    });
                };
                run2 = run;
                run(0);
            }
        }
    }
};
//# sourceMappingURL=Test.js.map