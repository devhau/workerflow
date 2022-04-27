import { IProperty } from "./BaseFlow";
import { EventEnum } from "./Constant";
import { EventFlow } from "./EventFlow";

export class DataFlow {
  private data: any = {};
  private properties: any = null;
  private events: EventFlow;
  onSafe(event: string, callback: any) {
    this.events.onSafe(event, callback);
  }
  on(event: string, callback: any) {
    this.events.on(event, callback);
  }
  removeListener(event: string, callback: any) {
    this.events.removeListener(event, callback);
  }
  dispatch(event: string, details: any) {
    this.events.dispatch(event, details);
  }
  public constructor(private property: IProperty | undefined = undefined, data: any = undefined) {
    this.events = new EventFlow();
    if (data) {
      this.load(data);
    }
  }
  public InitData(data: any = null, properties: any = -1) {
    if (properties !== -1) {
      this.properties = properties;
    }
    this.load(data);
  }
  private eventDataChange(key: string, keyChild: string, valueChild: any, senderChild: any, index: number | undefined = undefined) {
    if (index) {
      this.dispatch(`${EventEnum.dataChange}_${key}_${index}_${keyChild}`, {
        key, keyChild, value: valueChild, sender: senderChild, index
      });
      this.dispatch(`${EventEnum.dataChange}_${key}_${index}`, {
        key, keyChild, value: valueChild, sender: senderChild, index
      });
    } else {
      this.dispatch(`${EventEnum.dataChange}_${key}_${keyChild}`, {
        key, keyChild, value: valueChild, sender: senderChild
      });
    }
    this.dispatch(`${EventEnum.dataChange}_${key}`, {
      key, keyChild, value: valueChild, sender: senderChild
    });
  }
  public RemoveEventData(item: DataFlow, key: string, index: number | undefined = undefined) {
    if (!item) return;
    item.removeListener(`${EventEnum.dataChange}`, ({ key: keyChild, value: valueChild, sender: senderChild }: any) => this.eventDataChange(key, keyChild, valueChild, senderChild, index));
  }
  public OnEventData(item: DataFlow, key: string, index: number | undefined = undefined) {
    if (!item) return;
    item.on(`${EventEnum.dataChange}`, ({ key: keyChild, value: valueChild, sender: senderChild }: any) => this.eventDataChange(key, keyChild, valueChild, senderChild, index));
  }
  private BindEvent(value: any, key: string) {
    if (!value) return;
    if (value instanceof DataFlow) {
      this.OnEventData(value as DataFlow, key);
    }
    if (Array.isArray(value) && (value as []).length > 0 && value[0] instanceof DataFlow) {
      (value as DataFlow[]).forEach((item: DataFlow, index: number) => this.OnEventData(item, key, index));
    }
  }
  public Set(key: string, value: any, sender: any = null) {
    if (this.data[key] != value) {
      if (this.data[key]) {
        if (this.data[key] instanceof DataFlow) {
          this.RemoveEventData((this.data[key] as DataFlow), key);
        }
        if (Array.isArray(this.data[key]) && (this.data[key] as []).length > 0 && this.data[key][0] instanceof DataFlow) {
          (this.data[key] as DataFlow[]).forEach((item: DataFlow, index: number) => this.RemoveEventData(item, key, index));
        }
      }
      this.BindEvent(value, key);
    }
    this.data[key] = value;
    this.dispatch(`${EventEnum.dataChange}_${key}`, {
      key, value, sender
    });
    this.dispatch(EventEnum.dataChange, {
      key, value, sender
    });
    this.dispatch(EventEnum.change, {
      key, value, sender
    });
  }
  public Get(key: string) {
    return this.data[key];
  }
  public load(data: any) {
    this.data = {};
    if (!this.properties) {
      this.properties = this.property?.getPropertyByKey(data.key);
    }
    if (this.properties) {
      for (let key of Object.keys(this.properties)) {
        this.data[key] = (data?.[key] ?? (this.properties[key]?.default ?? ""));
        this.BindEvent(this.data[key], key);
      }
    }
  }
  public toString() {
    return JSON.stringify(this.toJson());
  }
  public toJson() {
    let rs: any = {};
    for (let key of Object.keys(this.properties)) {
      rs[key] = this.Get(key);
      if (rs[key] instanceof DataFlow) {
        rs[key] = rs[key].toJson();
      }
      if (Array.isArray(rs[key]) && (rs[key] as []).length > 0 && rs[key][0] instanceof DataFlow) {
        rs[key] = rs[key].map((item: DataFlow) => item.toJson());
      }
    }
    return rs;
  }
}