import { NodeFlow } from "./NodeFlow";

export class DataFlow {
  private data: any = {};
  public constructor(private node: NodeFlow) {
    setTimeout(() => {
      this.node.elNode?.querySelectorAll(`[node\\:model]`).forEach((item) => {
        item.addEventListener('keyup', this.changeInput.bind(this));
      });
    });
  }
  public Set(key: string, Value: any, obj = null) {
    this.data[key] = Value;
    setTimeout(() => {
      this.node.elNode?.querySelectorAll(`[node\\:model="${key}"]`).forEach((item: any) => {
        if (item != obj)
          item.value = Value;
      });
    });
  }
  public changeInput(e: any) {
    this.Set(e.target.getAttribute(`node:model`), e.target.value, e.target);
  }
  public load(data: any) {
    this.data = data || {};
    setTimeout(() => {
      this.node.elNode?.querySelectorAll(`[node\\:model]`).forEach((item: any) => {
        item.value = this.data[item.getAttribute(`node:model`)] ?? null;
      });
    });
  }
  public toJson() {
    return this.data;
  }
}