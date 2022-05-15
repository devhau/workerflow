import { DataFlow, IMain, compareSort, EventEnum, PropertyEnum, EventFlow, getTime, Variable } from "../core/index";
import { Node } from "../desginer/index";
import { Control } from "./control";

export class SystemBase implements IMain {
  private $data: DataFlow = new DataFlow(this);
  private $projectOpen: DataFlow | undefined;
  private $properties: any = {};
  private $control: any = {};
  private events: EventFlow = new EventFlow();
  private $controlChoose: string | null = null;
  private $checkOption: boolean = false;
  public constructor() {
    //set project
    this.$properties[PropertyEnum.solution] = {
      id: {
        default: () => getTime()
      },
      key: {
        default: PropertyEnum.solution
      },
      name: {
        default: () => `solution-${getTime()}`,
        edit: true,
      },
      projects: {
        default: []
      }
    };
    this.$properties[PropertyEnum.line] = {
      key: {
        default: PropertyEnum.line
      },
      from: {
        default: 0
      },
      fromIndex: {
        default: 0
      },
      to: {
        default: 0
      },
      toIndex: {
        default: 0
      }
    };
    //set project
    this.$properties[PropertyEnum.main] = {
      id: {
        default: () => getTime()
      },
      name: {
        default: () => `Flow-${getTime()}`,
        edit: true,
      },
      key: {
        default: PropertyEnum.main
      },
      variable: {
        default: []
      },
      groups: {
        default: []
      },
      nodes: {
        default: []
      }
    };
    this.$properties[PropertyEnum.groupCavas] = {
      key: {
        default: PropertyEnum.groupCavas
      },
      group: {
        default: ''
      },
      x: {
        default: 0
      },
      y: {
        default: 0
      },
      zoom: {
        default: 1
      },
    }
  }
  addVariable(): Variable {
    let varibale = new Variable();
    this.$projectOpen?.Append('variable', varibale);
    return varibale;
  }
  newVariable(): Variable {
    let varibale = this.addVariable();
    this.dispatch(EventEnum.changeVariable, { data: varibale });
    return varibale;
  }
  getVariable(): Variable[] {
    let arr: any = [];
    if (this.$projectOpen) {
      arr = this.$projectOpen.Get("variable");
      if (!arr) {
        arr = [];
        this.$projectOpen.Set('variable', arr);
      }
    }
    return arr;
  }
  exportJson() {
    return this.$data.toJson();
  }
  public checkInitOption() {
    return this.$checkOption;
  }
  initOption(option: any, isDefault: boolean = true): void {
    this.$checkOption = true;
    // set control
    this.$control = isDefault ? { ...option?.control || {}, ...Control } : { ...option?.control || {} };
    let controlTemp: any = {};
    Object.keys(this.$control).map((key) => ({ ...this.$control[key], key, sort: (this.$control[key].sort === undefined ? 99999 : this.$control[key].sort) })).sort(compareSort).forEach((item: any) => {
      controlTemp[item.key] = {
        dot: {
          left: 1,
          top: 1,
          right: 1,
          bottom: 1,
        },
        ...item
      };
      this.$properties[`${item.key}`] = {
        ...(item.properties || {}),
        id: {
          default: () => getTime()
        },
        key: {
          default: item.key
        },
        name: {
          default: item.key,
          edit: true,
        },
        x: {
          default: 0
        },
        y: {
          default: 0
        },
        group: {
          default: ''
        },
        lines: {
          default: []
        }
      };
    });

    this.$control = controlTemp;
  }
  renderHtml(node: Node, elParent: Element) {
    elParent.innerHTML = node.getOption()?.html;
  }
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
    setTimeout(() => {
      this.events.dispatch(event, details);
    });
  }

  getControlAll() {
    return this.$control ?? {};
  }
  getProjectAll(): any[] {
    return this.$data.Get('projects') ?? [];
  }
  importJson(data: any): void {
    this.$data.InitData(data, this.getPropertyByKey(PropertyEnum.solution));
  }
  setProjectOpen($data: any): void {
    this.$projectOpen = $data;
  }
  checkProjectOpen($data: any): boolean {
    return this.$projectOpen == $data;
  }
  newProject(): void {
    this.openProject({});
    this.dispatch(EventEnum.newProject, {});
  }
  openProject($data: any): void {
    let $project: any = null;
    if ($data instanceof DataFlow) {
      $project = this.getProjectById($data.Get('id'));
      if (!$project) {
        $project = $data;
        this.$data.Append('projects', $project);
      }
    } else {
      $project = new DataFlow(this);
      $project.InitData($data, this.getPropertyByKey(PropertyEnum.main));
      this.$data.Append('projects', $project);
    }
    if ($project) {
      this.$projectOpen = $project;

      this.newVariable().name = 'var1';
      this.newVariable().name = 'var2';
      this.newVariable().name = 'var3';
      this.newVariable().name = 'var4';
      this.newVariable().name = 'var5';
      this.dispatch(EventEnum.change, {
        data: $project
      });
      this.dispatch(EventEnum.showProperty, {
        data: $project
      });
      this.dispatch(EventEnum.openProject, {
        data: $project
      });
    }

  }
  public getProjectById($id: any) {
    return this.$data.Get('projects').filter((item: DataFlow) => item.Get('id') === $id)?.[0];
  }
  setControlChoose(key: string | null): void {
    this.$controlChoose = key;
  }
  getControlChoose(): string | null {
    return this.$controlChoose;
  }
  getControlByKey(key: string) {
    return this.$control[key] || {};
  }
  getControlNodeByKey(key: string) {
    return {
      ...this.getControlByKey(key),
      properties: this.getPropertyByKey(`${key}`)
    }
  }
  getPropertyByKey(key: string) {
    return this.$properties[key];
  }
}
