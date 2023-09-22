export declare class Singleton {
    private map;
    add(instanceType: string, instance: any): void;
    retrieve<T>(instanceType: string): T;
}
declare const singleton: Singleton;
export { singleton };
