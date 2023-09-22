export class Singleton {
  private map: Map<string, any> = new Map();

  public add(instanceType: string, instance: any) {
    this.map[instanceType] = instance;
  }

  public retrieve<T>(instanceType: string): T {
    return <T>this.map[instanceType];
  }
}

const singleton: Singleton = new Singleton();

export { singleton }