declare const init: (msNames: string, requestTopic?: string, uri?: string) => void;
declare const getTemplateResources: () => any[];
declare const compileTemplate: (templateUrl: string, data: any) => Promise<string>;
export { init, getTemplateResources, compileTemplate };
