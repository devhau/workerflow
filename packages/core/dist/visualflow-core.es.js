
  /**
   * @license
   * author:nguyenvanhaudev@gmail.com (Nguyen Van Hau)
   * visualflow_core.js v0.0.1-beta
   * Released under the MIT license.
   */

class WorkerSetup {
    nodes() {
        return [];
    }
    newNodes() {
        return this.nodes().map((item) => (new item()));
    }
}

var EnvNode;
(function (EnvNode) {
    EnvNode[EnvNode["All"] = 0] = "All";
    EnvNode[EnvNode["Web"] = 1] = "Web";
    EnvNode[EnvNode["PC"] = 2] = "PC";
    EnvNode[EnvNode["Cloud"] = 3] = "Cloud";
    EnvNode[EnvNode["Mobile"] = 4] = "Mobile";
    EnvNode[EnvNode["IOS"] = 5] = "IOS";
    EnvNode[EnvNode["Android"] = 6] = "Android";
})(EnvNode || (EnvNode = {}));
class WorkerNode {
    env() {
        return [EnvNode.All, EnvNode.Cloud, EnvNode.PC, EnvNode.Web, EnvNode.Mobile, EnvNode.IOS, EnvNode.Android];
    }
    CheckEnv(env) {
        return this.env().includes(env);
    }
    key() {
        return this.constructor.name;
    }
    checkKey(key) {
        return this.key() == key;
    }
    name() { return this.constructor.name; }
    icon() { return '<i class="fas fa-play"></i>'; }
    group() {
        return "Common";
    }
    html({ elNode, main, node }) {
        return ``;
    }
    script({ elNode, main, node }) { }
    properties() { }
    option() { }
    async execute(nodeId, data, manager, next) {
    }
    async nextNode(data, next, nodeId, index = null) {
        if (data?.lines) {
            for (let item of data.lines) {
                if (item.from == nodeId && (index == null || item.fromIndex == index)) {
                    await next(item.to);
                }
            }
        }
    }
}

class CoreAlertNode extends WorkerNode {
    key() {
        return "core_alert";
    }
    name() {
        return "Alert";
    }
    icon() {
        return '<i class="fas fa-bell"></i>';
    }
    html({ elNode, main, node }) {
        return '<div class="pr10 pl10 pb4"><input type="text" class="node-form-control" node:model="message"/></div>';
    }
    properties() {
        return {
            message: {
                key: "message",
                edit: true,
                default: "${Date()}"
            }
        };
    }
    async execute(nodeId, data, manager, next) {
        alert(manager.getText(data?.message, nodeId));
        await this.nextNode(data, next, nodeId);
    }
}

class CoreAssignNode extends WorkerNode {
    key() {
        return "core_assign";
    }
    name() {
        return "Assign";
    }
    icon() {
        return '<i class="fas fa-bolt"></i>';
    }
    properties() {
        return {
            env_name: {
                key: "env_name",
                edit: true,
                default: ""
            },
            env_value: {
                key: "env_value",
                edit: true,
                default: ""
            }
        };
    }
    option() {
        return {
            class: '',
            dot: {
                left: 1,
                top: 0,
                right: 0,
                bottom: 0,
            }
        };
    }
    html({ elNode, main, node }) {
        return `<div class="node-content-row">
    <div class="pl10 pr0 pt2 pb2"><input type="text" class="node-form-control" node:model="env_name"/> </div>
    <div class="flex-none p2 text-center">=</div>
    <div class="pr10 pl0 pt2 pb2"><input type="text" class="node-form-control" node:model="env_value"/></div>
    <div><span class="node-dot" node="50000"></span></div>
    </div>`;
    }
    async execute(nodeId, data, manager, next) {
        await this.nextNode(data, next, nodeId);
    }
}

const NodeBegin = "core_begin";
class CoreBeginNode extends WorkerNode {
    key() {
        return NodeBegin;
    }
    name() {
        return "Begin";
    }
    option() {
        return {
            onlyNode: true,
            sort: 0,
            dot: {
                left: 0,
                top: 0,
                right: 1,
                bottom: 0,
            }
        };
    }
    async execute(nodeId, data, manager, next) {
        await this.nextNode(data, next, nodeId);
    }
}

class CoreConsoleNode extends WorkerNode {
    key() {
        return "core_console";
    }
    name() {
        return "Console";
    }
    icon() {
        return '<i class="fas fa-terminal"></i>';
    }
    html({ elNode, main, node }) {
        return '<div class="pr10 pl10 pb4"><input type="text" class="node-form-control" node:model="message"/></div>';
    }
    properties() {
        return {
            message: {
                key: "message",
                edit: true,
                default: ""
            }
        };
    }
    async execute(nodeId, data, manager, next) {
        console.log(manager.getText(data?.message, nodeId));
        await this.nextNode(data, next, nodeId);
    }
}

class CoreDelayNode extends WorkerNode {
    key() {
        return "core_delay";
    }
    name() {
        return "Delay";
    }
    icon() {
        return '<i class="fas fa-stopwatch"></i>';
    }
    html({ elNode, main, node }) {
        return '<div class="pr10 pl10 pb4 display-flex"><input type="text" class="node-form-control" node:model="number_delay"/><span class="p4">ms</span></div>';
    }
    properties() {
        return {
            number_delay: {
                key: "number_delay",
                edit: true,
                default: 1000
            }
        };
    }
    async execute(nodeId, data, manager, next) {
        await manager.delay(manager.runCode(data?.number_delay, nodeId));
        await this.nextNode(data, next, nodeId);
    }
}

class CoreEndNode extends WorkerNode {
    key() {
        return "core_end";
    }
    name() {
        return "End";
    }
    icon() {
        return '<i class="fas fa-stop"></i>';
    }
    option() {
        return {
            onlyNode: true,
            sort: 0,
            dot: {
                left: 1,
                top: 0,
                right: 0,
                bottom: 0,
            }
        };
    }
}

class CoreForNode extends WorkerNode {
    key() {
        return "core_for";
    }
    name() {
        return "For";
    }
    icon() {
        return '<i class="fas fa-circle-notch"></i>';
    }
    properties() {
        return {
            number_start: {
                key: "number_start",
                edit: true,
                default: 1
            },
            number_end: {
                key: "number_end",
                edit: true,
                default: 10
            },
            number_step: {
                key: "number_step",
                edit: true,
                default: 1
            },
            env_name: {
                key: "env_name",
                edit: true,
                default: 'loop_index'
            }
        };
    }
    html({ elNode, main, node }) {
        return `
      <div class="display-flex">
        <div class="flex-none pl10 pr0 pt4 pb2 text-center" >For</div>
        <div class="pl2 pr0 pt2 pb2" ><input type="text" class="node-form-control" node:model="number_start" /> </div>
        <div class="flex-none pl2 pr0 pt4 pb2 text-center" >To </div>
        <div class="pr2 pl0 pt2 pb2" ><input type="text" class="node-form-control" node:model="number_end" /></div>
        <div class="flex-none pl2 pr0 pt42 pb2 text-center" >Step</div>
        <div class="pr10 pl0 pt2 pb2" ><input type="text" class="node-form-control" node:model="number_step" /></div>
      </div>
      <div class="text-center p3">
        <button class="btnGoGroup node-form-control">Go to Content</button>
      </div>`;
    }
    script({ elNode, main, node }) {
        elNode.querySelector('.btnGoGroup')?.addEventListener('click', () => {
            node.parent.openGroup(node.GetId());
        });
        const temp_env_name = `temp_${node.GetId()}_env_name`;
        const temp_value = main.temp.Get(temp_env_name);
        if (!temp_value) {
            main.temp.Set(temp_env_name, node.data.Get('env_name'));
            main.newVariable(node.data.Get('env_name'), node.GetId());
        }
        else if (node.data.Get('env_name') != temp_value) {
            main.changeVariableName(temp_value, node.data.Get('env_name'), node.GetId());
            main.temp.Set(temp_env_name, node.data.Get('env_name'));
        }
    }
    async execute(nodeId, data, manager, next) {
        const group = manager.getGroupCurrent();
        manager.setGroup(data.id);
        const number_start = +manager.getText(data.number_start, nodeId);
        const number_end = +manager.getText(data.number_end, nodeId);
        const number_step = +manager.getText(data.number_step, nodeId);
        for (let loop_index = number_start; loop_index <= number_end && !manager.flgStopping; loop_index = loop_index + number_step) {
            manager.setVariableObject(data.env_name, loop_index, nodeId);
            await manager.excuteAsync();
        }
        manager.setGroup(group);
        await this.nextNode(data, next, nodeId);
    }
}

class CoreGroupNode extends WorkerNode {
    key() {
        return "core_group";
    }
    name() {
        return "Group";
    }
    icon() {
        return '<i class="far fa-object-group"></i>';
    }
    html({ elNode, main, node }) {
        return '<div class="text-center p3"><button class="btnGoGroup node-form-control">Go to Group</button></div>';
    }
    script({ elNode, main, node }) {
        elNode.querySelector('.btnGoGroup')?.addEventListener('click', () => {
            node.parent.openGroup(node.GetId());
        });
    }
    async execute(nodeId, data, manager, next) {
        const group = manager.getGroupCurrent();
        manager.setGroup(data.id);
        await manager.excuteAsync();
        manager.setGroup(group);
        await this.nextNode(data, next, nodeId);
    }
}

class CoreIfNode extends WorkerNode {
    key() {
        return "core_if";
    }
    name() {
        return "If";
    }
    icon() {
        return '<i class="fas fa-equals"></i>';
    }
    properties() {
        return {
            condition: {
                key: "condition",
                edit: true,
                default: 1
            },
            cond: {
                key: "cond",
                edit: true,
                sub: true,
                default: 1
            }
        };
    }
    option() {
        return {
            class: '',
            dot: {
                left: 1,
                top: 0,
                right: 0,
                bottom: 0,
            }
        };
    }
    html({ elNode, main, node }) {
        const condition = node.data.Get('condition');
        let html = '';
        for (let index = 0; index < condition; index++) {
            html = `${html}<div class="node-content-row">
      <div class="pl10 pr1 pt2 pb2"><input type="text" class="node-form-control" node:model="cond${50001 + index}"/></div>
      <div style="text-align:right" class="pl1 pr10 pt2 pb2">Then</div>
      <div><span class="node-dot" node="${50001 + index}"></span></div>
      </div>`;
        }
        html = `${html}<div class="node-content-row">
    <div class="pl10 pr1 pt2 pb2"><button class="btnAddCondition">Add</button></div>
    <div style="text-align:right" class="pl1 pr10 pt2 pb2">Else</div>
    <div><span class="node-dot" node="50000"></span></div>
    </div>`;
        return html;
    }
    script({ elNode, main, node }) {
        elNode.querySelector('.btnAddCondition')?.addEventListener('click', () => {
            node.data.Increase('condition');
        });
    }
    async execute(nodeId, data, manager, next) {
        const condition = data.condition;
        for (let index = 0; index < condition && !manager.flgStopping; index++) {
            let node = 50001 + index;
            const condition_node = data[`cond${node}`];
            if (manager.runCode(condition_node, nodeId) == true) {
                await this.nextNode(data, next, nodeId, node);
                return;
            }
        }
        await this.nextNode(data, next, nodeId, 50000);
    }
}

class CoreProjectNode extends WorkerNode {
    key() {
        return "core_project";
    }
    name() {
        return "Project";
    }
    icon() {
        return '<i class="fas fa-project-diagram"></i>';
    }
    properties() {
        return {
            project: {
                key: "project",
                edit: true,
                select: true,
                dataSelect: ({ elNode, main, node }) => {
                    return main.getProjectAll().map((item) => {
                        return {
                            value: item.Get('id'),
                            text: item.Get('name')
                        };
                    });
                },
            }
        };
    }
    html({ elNode, main, node }) {
        return '<div class="text-center p3"><select class="node-form-control" node:model="project"></select></div>';
    }
    script({ elNode, main, node }) {
    }
    async execute(nodeId, data, manager, next) {
        const project = manager.getProjectCurrent();
        const group = manager.getGroupCurrent();
        manager.setProject(data.project);
        await manager.excuteAsync();
        manager.setProject(project);
        manager.setGroup(group);
        await this.nextNode(data, next, nodeId);
    }
}

class CoreSwitchNode extends WorkerNode {
    key() {
        return "core_switch";
    }
    name() {
        return "Switch";
    }
    icon() {
        return '<i class="fas fa-random"></i>';
    }
    properties() {
        return {
            condition: {
                key: "condition",
                edit: true,
                default: 1
            },
            case: {
                key: "case",
                edit: true,
                sub: true,
                default: 1
            },
            case_input: {
                key: "case_input",
                edit: true,
                default: ''
            },
        };
    }
    option() {
        return {
            class: '',
            dot: {
                left: 1,
                top: 0,
                right: 0,
                bottom: 0,
            }
        };
    }
    html({ elNode, main, node }) {
        const condition = node.data.Get('condition');
        let html = '';
        html = `${html}<div class="node-content-row">
    <div style="text-align:right" class="pl10 pr1 pt2 pb2">Input</div>
    <div class="pl2 pr1 pt2 pb2"><input type="text" class="node-form-control" node:model="case_input"/></div>
    <div></div>
    </div>`;
        for (let index = 0; index < condition; index++) {
            html = `${html}<div class="node-content-row">
      <div style="text-align:right" class="pl10 pr1 pt2 pb2">Case</div>
      <div class="pl2 pr1 pt2 pb2"><input type="text" class="node-form-control" node:model="case${50001 + index}"/></div>
      <div><span class="node-dot" node="${50001 + index}"></span></div>
      </div>`;
        }
        html = `${html}<div class="node-content-row">
    <div class="pl10 pr1 pt2 pb2"><button class="btnAddCondition">Add</button></div>
    <div style="text-align:right" class="pl2 pr10 pt2 pb2">Default</div>
    <div><span class="node-dot" node="50000"></span></div>
    </div>`;
        return html;
    }
    script({ elNode, main, node }) {
        elNode.querySelector('.btnAddCondition')?.addEventListener('click', () => {
            node.data.Increase('condition');
        });
    }
    async execute(nodeId, data, manager, next) {
        const condition = data.condition;
        const case_input = manager.getText(data.case_input, nodeId);
        for (let index = 0; index < condition && !manager.flgStopping; index++) {
            let node = 50001 + index;
            const condition_node = data[`case${node}`];
            if (manager.getText(condition_node, nodeId) == case_input) {
                await this.nextNode(data, next, nodeId, node);
                return;
            }
        }
        await this.nextNode(data, next, nodeId, 50000);
    }
}

class CoreSetup extends WorkerSetup {
    nodes() {
        return [
            CoreBeginNode,
            CoreEndNode,
            CoreAssignNode,
            CoreDelayNode,
            CoreIfNode,
            CoreSwitchNode,
            CoreForNode,
            CoreAlertNode,
            CoreConsoleNode,
            CoreProjectNode,
            CoreGroupNode,
        ];
    }
}

class WorkerScript {
    runCodeInBrowser(script, variableObj) {
        return window.eval(this.GetTextInBrowser(script, variableObj));
    }
    GetTextInBrowser(script, variableObj) {
        let paramText = "";
        let paramValue = [];
        if (!variableObj)
            variableObj = {};
        for (let key of Object.keys(variableObj)) {
            if (paramText != "") {
                paramText = `${paramText},${key}`;
            }
            else {
                paramText = key;
            }
            paramValue = [...paramValue, variableObj[key]];
        }
        return window.eval('((' + paramText + ')=>(`' + script + '`))')(...paramValue);
    }
    GetTextInNode(script, variableObj) {
        return "";
    }
    runCodeInNode(script, variableObj) {
        const { VM } = require('vm2');
        const vm = new VM();
        return vm.runInContext(script, variableObj);
    }
    runCode(script, variableObj) {
        if (window != undefined && document != undefined) {
            return this.runCodeInBrowser(script, variableObj);
        }
        else {
            return this.runCodeInNode(script, variableObj);
        }
    }
    getText(script, variableObj) {
        if (window != undefined && document != undefined) {
            return this.GetTextInBrowser(script, variableObj);
        }
        else {
            return this.GetTextInNode(script, variableObj);
        }
    }
}

const PropertyEnum = {
    main: "main_project",
    solution: 'main_solution',
    line: 'main_line',
    variable: 'main_variable',
    groupCavas: "main_groupCavas",
};
class WorkerManager {
    events = {};
    scriptCode = new WorkerScript();
    variableValue = {};
    onSafe(event, callback) {
        this.removeListener(event, callback);
        this.on(event, callback);
    }
    /* Events */
    on(event, callback) {
        // Check if the callback is not a function
        if (typeof callback !== 'function') {
            console.error(`The listener callback must be a function, the given type is ${typeof callback}`);
            return false;
        }
        // Check if the event is not a string
        if (typeof event !== 'string') {
            console.error(`The event name must be a string, the given type is ${typeof event}`);
            return false;
        }
        // Check if this event not exists
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            };
        }
        this.events[event].listeners.push(callback);
    }
    removeListener(event, callback) {
        // Check if this event not exists
        if (!this.events[event])
            return false;
        const listeners = this.events[event].listeners;
        const listenerIndex = listeners.indexOf(callback);
        const hasListener = listenerIndex > -1;
        if (hasListener)
            listeners.splice(listenerIndex, 1);
    }
    dispatch(event, details) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners.forEach((listener) => {
            listener(details);
        });
    }
    $data;
    $nodes = [];
    $project;
    $group = "root";
    delay_time = 100;
    constructor(data = null) {
        this.LoadData(data);
    }
    setProject(project) {
        this.$project = project;
        this.$group = "root";
        if (this.variableValue[this.$project] === undefined) {
            let prj = this.getProjectById(this.$project);
            this.variableValue[this.$project] = prj.variable.map((item) => {
                return {
                    ...item,
                    value: item.initalValue
                };
            });
        }
    }
    getProjectById(id) {
        return this.$data?.projects?.find((item) => item.id == id);
    }
    getProject() {
        if (this.$data.key === PropertyEnum.solution) {
            return this.getProjectById(this.$project);
        }
        if (this.$data.key === PropertyEnum.main) {
            return this.$data;
        }
    }
    setGroup(group) {
        this.$group = group;
    }
    getGroupCurrent() {
        return this.$group;
    }
    getProjectCurrent() {
        return this.$project;
    }
    getNodeInGroup(group = null) {
        let _group = group ?? this.$group;
        return this.getProject()?.nodes?.filter((item) => item.group == _group);
    }
    getNodeById(_id) {
        return this.getNodeInGroup()?.filter((item) => item.id == _id)?.[0];
    }
    getNodeByKey(_key) {
        return this.getNodeInGroup()?.filter((item) => item.key == _key)?.[0];
    }
    LoadData(data) {
        if (!data)
            return this;
        this.variableValue = {};
        if (typeof data === 'string') {
            this.$data = JSON.parse(data);
        }
        else {
            this.$data = data;
        }
        if (this.$data.key === PropertyEnum.solution) {
            this.$project = this.$data.project;
        }
        if (!this.$project) {
            this.$project = this.$data.projects?.[0]?.id;
        }
        this.setProject(this.$project);
        return this;
    }
    newSetup(setup) {
        this.Setup(new setup());
    }
    Setup(setup) {
        this.$nodes = [...this.$nodes, ...setup.newNodes()];
    }
    getControlNodes() {
        return this.$nodes.map((item) => {
            return {
                ...{
                    key: "",
                    name: "",
                    group: "",
                    html: "",
                    script: "",
                    properties: "",
                    dot: {
                        left: 1,
                        top: 0,
                        right: 1,
                        bottom: 0,
                    }
                },
                ...item.option() ?? {},
                key: item.key(),
                name: item.name(),
                icon: item.icon(),
                group: item.group(),
                html: item.html,
                script: item.script,
                properties: item.properties() ?? {},
            };
        });
    }
    getWorkerNode(_key) {
        return this.$nodes?.filter((item) => item.checkKey(_key))?.[0];
    }
    async excuteNode($id) {
        const dataNode = this.getNodeById($id);
        await this.excuteDataNode(dataNode);
    }
    delay(time = 100) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    async excuteDataNode(dataNode) {
        if (this.flgStopping) {
            this.dispatch('worker_stopping', {});
            return;
        }
        await this.delay(this.delay_time);
        if (dataNode) {
            this.dispatch('node_start', { node: dataNode });
            const workerNode = this.getWorkerNode(dataNode.key);
            await workerNode?.execute(dataNode.id, dataNode, this, this.excuteNode.bind(this));
            this.dispatch('node_end', { node: dataNode });
        }
    }
    async excuteAsync() {
        const dataNode = this.getNodeByKey(`${NodeBegin}`);
        await this.excuteDataNode(dataNode);
    }
    excute() {
        setTimeout(async () => {
            this.dispatch('worker_start', {});
            try {
                this.flgStopping = false;
                await this.excuteAsync();
                this.flgStopping = false;
                this.dispatch('worker_end', {});
            }
            catch (ex) {
                console.log(ex);
                this.dispatch('worker_end', {});
            }
            this.flgStopping = false;
        });
    }
    flgStopping = null;
    stop() {
        this.flgStopping = true;
    }
    setVariableObject(name, value, nodeId, project = null) {
        let treeScope = [nodeId];
        while (nodeId != 'root') {
            let node = this.getNodeById(nodeId);
            if (node) {
                nodeId = node.group;
                treeScope = [...treeScope, nodeId];
            }
            else {
                nodeId = 'root';
                treeScope = [...treeScope, nodeId];
            }
        }
        let $variable = this.variableValue[project ?? this.$project];
        const treeLenght = treeScope.length - 1;
        for (let i = 0; i <= treeLenght; i++) {
            let item = $variable.filter((item) => item.scope === treeScope[i] && item.name == name)?.[0];
            if (item) {
                item.value = value;
                return;
            }
        }
    }
    getVariableObject(nodeId, project = null) {
        const variableObj = {};
        let treeScope = [nodeId];
        while (nodeId != 'root') {
            let node = this.getNodeById(nodeId);
            if (node) {
                nodeId = node.group;
                treeScope = [...treeScope, nodeId];
            }
            else {
                nodeId = 'root';
                treeScope = [...treeScope, nodeId];
            }
        }
        let $variable = this.variableValue[project ?? this.$project];
        const treeLenght = treeScope.length - 1;
        for (let i = treeLenght; i >= 0; i--) {
            $variable.filter((item) => item.scope === treeScope[i])?.forEach((item) => {
                variableObj[item.name] = item.value;
            });
        }
        return variableObj;
    }
    runCode($scrpit, nodeId) {
        const variableObj = this.getVariableObject(nodeId);
        return this.scriptCode.runCode($scrpit, variableObj);
    }
    getText($scrpit, nodeId) {
        const variableObj = this.getVariableObject(nodeId);
        return this.scriptCode.getText($scrpit, variableObj);
    }
}
const workerManager = new WorkerManager();

workerManager.newSetup(CoreSetup);
var index = {
    CoreSetup,
    WorkerManager,
    workerManager
};

export { index as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzdWFsZmxvdy1jb3JlLmVzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvd29ya2VyL3NldHVwLnRzIiwiLi4vc3JjL3dvcmtlci9ub2RlLnRzIiwiLi4vc3JjL25vZGVzL2FsZXJ0LnRzIiwiLi4vc3JjL25vZGVzL2Fzc2lnbi50cyIsIi4uL3NyYy9ub2Rlcy9iZWdpbi50cyIsIi4uL3NyYy9ub2Rlcy9jb25zb2xlLnRzIiwiLi4vc3JjL25vZGVzL2RlbGF5LnRzIiwiLi4vc3JjL25vZGVzL2VuZC50cyIsIi4uL3NyYy9ub2Rlcy9mb3IudHMiLCIuLi9zcmMvbm9kZXMvZ3JvdXAudHMiLCIuLi9zcmMvbm9kZXMvaWYudHMiLCIuLi9zcmMvbm9kZXMvcHJvamVjdC50cyIsIi4uL3NyYy9ub2Rlcy9zd2l0Y2gudHMiLCIuLi9zcmMvbm9kZXMvaW5kZXgudHMiLCIuLi9zcmMvd29ya2VyL3NjcmlwdC50cyIsIi4uL3NyYy93b3JrZXIvbWFuYWdlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXb3JrZXJOb2RlIH0gZnJvbSBcIi4vbm9kZVwiO1xuXG5leHBvcnQgY2xhc3MgV29ya2VyU2V0dXAge1xuICBub2RlcygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG5ld05vZGVzKCk6IFdvcmtlck5vZGVbXSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXMoKS5tYXAoKGl0ZW0pID0+IChuZXcgaXRlbSgpKSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgV29ya2VyTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJcIjtcblxuZXhwb3J0IGVudW0gRW52Tm9kZSB7XG4gIEFsbCA9IDAsXG4gIFdlYiA9IDEsXG4gIFBDID0gMixcbiAgQ2xvdWQgPSAzLFxuICBNb2JpbGUgPSA0LFxuICBJT1MgPSA1LFxuICBBbmRyb2lkID0gNlxufVxuZXhwb3J0IHR5cGUgT3B0aW9uTm9kZSA9IHZvaWQgJiB7XG4gIGtleTogXCJcIixcbiAgbmFtZTogXCJcIixcbiAgZ3JvdXA6IFwiXCIsXG4gIGh0bWw6IFwiXCIsXG4gIHNjcmlwdDogXCJcIixcbiAgcHJvcGVydGllczogXCJcIixcbiAgb25seU5vZGU6IGJvb2xlYW4sXG4gIGRvdDoge1xuICAgIGxlZnQ6IDEsXG4gICAgdG9wOiAwLFxuICAgIHJpZ2h0OiAxLFxuICAgIGJvdHRvbTogMCxcbiAgfVxufVxuZXhwb3J0IGNsYXNzIFdvcmtlck5vZGUge1xuICBlbnYoKTogYW55W10ge1xuICAgIHJldHVybiBbRW52Tm9kZS5BbGwsIEVudk5vZGUuQ2xvdWQsIEVudk5vZGUuUEMsIEVudk5vZGUuV2ViLCBFbnZOb2RlLk1vYmlsZSwgRW52Tm9kZS5JT1MsIEVudk5vZGUuQW5kcm9pZF07XG4gIH1cbiAgcHVibGljIENoZWNrRW52KGVudjogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZW52KCkuaW5jbHVkZXMoZW52KTtcbiAgfVxuICBrZXkoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG4gIHB1YmxpYyBjaGVja0tleShrZXk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmtleSgpID09IGtleTtcbiAgfVxuICBuYW1lKCk6IGFueSB7IHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7IH1cbiAgaWNvbigpOiBhbnkgeyByZXR1cm4gJzxpIGNsYXNzPVwiZmFzIGZhLXBsYXlcIj48L2k+JzsgfVxuICBncm91cCgpOiBhbnkge1xuICAgIHJldHVybiBcIkNvbW1vblwiO1xuICB9XG4gIGh0bWwoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KSB7XG4gICAgcmV0dXJuIGBgO1xuICB9XG4gIHNjcmlwdCh7IGVsTm9kZSwgbWFpbiwgbm9kZSB9OiBhbnkpIHsgfVxuICBwcm9wZXJ0aWVzKCk6IGFueSB7IH1cbiAgb3B0aW9uKCk6IGFueSB7IH1cbiAgYXN5bmMgZXhlY3V0ZShub2RlSWQ6IGFueSwgZGF0YTogYW55LCBtYW5hZ2VyOiBXb3JrZXJNYW5hZ2VyLCBuZXh0OiBhbnkpIHtcblxuICB9XG4gIHByb3RlY3RlZCBhc3luYyBuZXh0Tm9kZShkYXRhOiBhbnksIG5leHQ6IGFueSwgbm9kZUlkOiBhbnksIGluZGV4OiBhbnkgPSBudWxsKSB7XG4gICAgaWYgKGRhdGE/LmxpbmVzKSB7XG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGRhdGEubGluZXMpIHtcbiAgICAgICAgaWYgKGl0ZW0uZnJvbSA9PSBub2RlSWQgJiYgKGluZGV4ID09IG51bGwgfHwgaXRlbS5mcm9tSW5kZXggPT0gaW5kZXgpKSB7XG4gICAgICAgICAgYXdhaXQgbmV4dChpdGVtLnRvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgV29ya2VyTWFuYWdlciB9IGZyb20gXCIuLi93b3JrZXIvbWFuYWdlclwiO1xuaW1wb3J0IHsgV29ya2VyTm9kZSB9IGZyb20gXCIuLi93b3JrZXIvbm9kZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29yZUFsZXJ0Tm9kZSBleHRlbmRzIFdvcmtlck5vZGUge1xuICBrZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJjb3JlX2FsZXJ0XCI7XG4gIH1cbiAgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJBbGVydFwiO1xuICB9XG4gIGljb24oKSB7XG4gICAgcmV0dXJuICc8aSBjbGFzcz1cImZhcyBmYS1iZWxsXCI+PC9pPic7XG4gIH1cbiAgaHRtbCh7IGVsTm9kZSwgbWFpbiwgbm9kZSB9OiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cInByMTAgcGwxMCBwYjRcIj48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cIm5vZGUtZm9ybS1jb250cm9sXCIgbm9kZTptb2RlbD1cIm1lc3NhZ2VcIi8+PC9kaXY+JztcbiAgfVxuICBwcm9wZXJ0aWVzKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAga2V5OiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZWRpdDogdHJ1ZSxcbiAgICAgICAgZGVmYXVsdDogXCIke0RhdGUoKX1cIlxuICAgICAgfVxuICAgIH1cbiAgfVxuICBhc3luYyBleGVjdXRlKG5vZGVJZDogYW55LCBkYXRhOiBhbnksIG1hbmFnZXI6IFdvcmtlck1hbmFnZXIsIG5leHQ6IGFueSkge1xuICAgIGFsZXJ0KG1hbmFnZXIuZ2V0VGV4dChkYXRhPy5tZXNzYWdlLCBub2RlSWQpKTtcbiAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFdvcmtlck1hbmFnZXIgfSBmcm9tIFwiLi4vd29ya2VyL21hbmFnZXJcIjtcbmltcG9ydCB7IFdvcmtlck5vZGUgfSBmcm9tIFwiLi4vd29ya2VyL25vZGVcIjtcblxuZXhwb3J0IGNsYXNzIENvcmVBc3NpZ25Ob2RlIGV4dGVuZHMgV29ya2VyTm9kZSB7XG4gIGtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcImNvcmVfYXNzaWduXCI7XG4gIH1cbiAgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJBc3NpZ25cIjtcbiAgfVxuICBpY29uKCkge1xuICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYXMgZmEtYm9sdFwiPjwvaT4nO1xuICB9XG4gIHByb3BlcnRpZXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgZW52X25hbWU6IHtcbiAgICAgICAga2V5OiBcImVudl9uYW1lXCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICBlbnZfdmFsdWU6IHtcbiAgICAgICAga2V5OiBcImVudl92YWx1ZVwiLFxuICAgICAgICBlZGl0OiB0cnVlLFxuICAgICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICB9XG4gICAgfVxuICB9XG4gIG9wdGlvbigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzczogJycsXG4gICAgICBkb3Q6IHtcbiAgICAgICAgbGVmdDogMSxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGh0bWwoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJub2RlLWNvbnRlbnQtcm93XCI+XG4gICAgPGRpdiBjbGFzcz1cInBsMTAgcHIwIHB0MiBwYjJcIj48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cIm5vZGUtZm9ybS1jb250cm9sXCIgbm9kZTptb2RlbD1cImVudl9uYW1lXCIvPiA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZmxleC1ub25lIHAyIHRleHQtY2VudGVyXCI+PTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJwcjEwIHBsMCBwdDIgcGIyXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJub2RlLWZvcm0tY29udHJvbFwiIG5vZGU6bW9kZWw9XCJlbnZfdmFsdWVcIi8+PC9kaXY+XG4gICAgPGRpdj48c3BhbiBjbGFzcz1cIm5vZGUtZG90XCIgbm9kZT1cIjUwMDAwXCI+PC9zcGFuPjwvZGl2PlxuICAgIDwvZGl2PmA7XG4gIH1cbiAgYXN5bmMgZXhlY3V0ZShub2RlSWQ6IGFueSwgZGF0YTogYW55LCBtYW5hZ2VyOiBXb3JrZXJNYW5hZ2VyLCBuZXh0OiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFdvcmtlck1hbmFnZXIgfSBmcm9tIFwiLi4vd29ya2VyL21hbmFnZXJcIjtcbmltcG9ydCB7IFdvcmtlck5vZGUgfSBmcm9tIFwiLi4vd29ya2VyL25vZGVcIjtcbmV4cG9ydCBjb25zdCBOb2RlQmVnaW4gPSBcImNvcmVfYmVnaW5cIjtcbmV4cG9ydCBjbGFzcyBDb3JlQmVnaW5Ob2RlIGV4dGVuZHMgV29ya2VyTm9kZSB7XG5cbiAga2V5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE5vZGVCZWdpbjtcbiAgfVxuICBuYW1lKCkge1xuICAgIHJldHVybiBcIkJlZ2luXCI7XG4gIH1cbiAgb3B0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvbmx5Tm9kZTogdHJ1ZSxcbiAgICAgIHNvcnQ6IDAsXG4gICAgICBkb3Q6IHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICByaWdodDogMSxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgYXN5bmMgZXhlY3V0ZShub2RlSWQ6IGFueSwgZGF0YTogYW55LCBtYW5hZ2VyOiBXb3JrZXJNYW5hZ2VyLCBuZXh0OiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFdvcmtlck1hbmFnZXIgfSBmcm9tIFwiLi4vd29ya2VyL21hbmFnZXJcIjtcbmltcG9ydCB7IFdvcmtlck5vZGUgfSBmcm9tIFwiLi4vd29ya2VyL25vZGVcIjtcblxuZXhwb3J0IGNsYXNzIENvcmVDb25zb2xlTm9kZSBleHRlbmRzIFdvcmtlck5vZGUge1xuICBrZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJjb3JlX2NvbnNvbGVcIjtcbiAgfVxuICBuYW1lKCkge1xuICAgIHJldHVybiBcIkNvbnNvbGVcIjtcbiAgfVxuICBpY29uKCkge1xuICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYXMgZmEtdGVybWluYWxcIj48L2k+JztcbiAgfVxuICBodG1sKHsgZWxOb2RlLCBtYWluLCBub2RlIH06IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwicHIxMCBwbDEwIHBiNFwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwibm9kZS1mb3JtLWNvbnRyb2xcIiBub2RlOm1vZGVsPVwibWVzc2FnZVwiLz48L2Rpdj4nO1xuICB9XG4gIHByb3BlcnRpZXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZToge1xuICAgICAgICBrZXk6IFwibWVzc2FnZVwiLFxuICAgICAgICBlZGl0OiB0cnVlLFxuICAgICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGFzeW5jIGV4ZWN1dGUobm9kZUlkOiBhbnksIGRhdGE6IGFueSwgbWFuYWdlcjogV29ya2VyTWFuYWdlciwgbmV4dDogYW55KSB7XG4gICAgY29uc29sZS5sb2cobWFuYWdlci5nZXRUZXh0KGRhdGE/Lm1lc3NhZ2Usbm9kZUlkKSk7XG4gICAgYXdhaXQgdGhpcy5uZXh0Tm9kZShkYXRhLCBuZXh0LCBub2RlSWQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBXb3JrZXJNYW5hZ2VyIH0gZnJvbSBcIi4uL3dvcmtlci9tYW5hZ2VyXCI7XG5pbXBvcnQgeyBXb3JrZXJOb2RlIH0gZnJvbSBcIi4uL3dvcmtlci9ub2RlXCI7XG5cbmV4cG9ydCBjbGFzcyBDb3JlRGVsYXlOb2RlIGV4dGVuZHMgV29ya2VyTm9kZSB7XG4gIGtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcImNvcmVfZGVsYXlcIjtcbiAgfVxuICBuYW1lKCkge1xuICAgIHJldHVybiBcIkRlbGF5XCI7XG4gIH1cbiAgaWNvbigpIHtcbiAgICByZXR1cm4gJzxpIGNsYXNzPVwiZmFzIGZhLXN0b3B3YXRjaFwiPjwvaT4nO1xuICB9XG4gIGh0bWwoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJwcjEwIHBsMTAgcGI0IGRpc3BsYXktZmxleFwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwibm9kZS1mb3JtLWNvbnRyb2xcIiBub2RlOm1vZGVsPVwibnVtYmVyX2RlbGF5XCIvPjxzcGFuIGNsYXNzPVwicDRcIj5tczwvc3Bhbj48L2Rpdj4nO1xuICB9XG4gIHByb3BlcnRpZXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgbnVtYmVyX2RlbGF5OiB7XG4gICAgICAgIGtleTogXCJudW1iZXJfZGVsYXlcIixcbiAgICAgICAgZWRpdDogdHJ1ZSxcbiAgICAgICAgZGVmYXVsdDogMTAwMFxuICAgICAgfVxuICAgIH1cbiAgfVxuICBhc3luYyBleGVjdXRlKG5vZGVJZDogYW55LCBkYXRhOiBhbnksIG1hbmFnZXI6IFdvcmtlck1hbmFnZXIsIG5leHQ6IGFueSkge1xuICAgIGF3YWl0IG1hbmFnZXIuZGVsYXkobWFuYWdlci5ydW5Db2RlKGRhdGE/Lm51bWJlcl9kZWxheSxub2RlSWQpKTtcbiAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFdvcmtlck5vZGUgfSBmcm9tIFwiLi4vd29ya2VyL25vZGVcIjtcblxuZXhwb3J0IGNsYXNzIENvcmVFbmROb2RlIGV4dGVuZHMgV29ya2VyTm9kZSB7XG4gIGtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcImNvcmVfZW5kXCI7XG4gIH1cbiAgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJFbmRcIjtcbiAgfVxuICBpY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8aSBjbGFzcz1cImZhcyBmYS1zdG9wXCI+PC9pPic7XG4gIH1cbiAgb3B0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvbmx5Tm9kZTogdHJ1ZSxcbiAgICAgIHNvcnQ6IDAsXG4gICAgICBkb3Q6IHtcbiAgICAgICAgbGVmdDogMSxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgfVxuICAgIH07XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgV29ya2VyTWFuYWdlciB9IGZyb20gXCIuLi93b3JrZXIvbWFuYWdlclwiO1xuaW1wb3J0IHsgV29ya2VyTm9kZSB9IGZyb20gXCIuLi93b3JrZXIvbm9kZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29yZUZvck5vZGUgZXh0ZW5kcyBXb3JrZXJOb2RlIHtcbiAga2V5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiY29yZV9mb3JcIjtcbiAgfVxuICBuYW1lKCkge1xuICAgIHJldHVybiBcIkZvclwiO1xuICB9XG4gIGljb24oKSB7XG4gICAgcmV0dXJuICc8aSBjbGFzcz1cImZhcyBmYS1jaXJjbGUtbm90Y2hcIj48L2k+JztcbiAgfVxuICBwcm9wZXJ0aWVzKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG51bWJlcl9zdGFydDoge1xuICAgICAgICBrZXk6IFwibnVtYmVyX3N0YXJ0XCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgIH0sXG4gICAgICBudW1iZXJfZW5kOiB7XG4gICAgICAgIGtleTogXCJudW1iZXJfZW5kXCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICB9LFxuICAgICAgbnVtYmVyX3N0ZXA6IHtcbiAgICAgICAga2V5OiBcIm51bWJlcl9zdGVwXCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgIH0sXG4gICAgICBlbnZfbmFtZToge1xuICAgICAgICBrZXk6IFwiZW52X25hbWVcIixcbiAgICAgICAgZWRpdDogdHJ1ZSxcbiAgICAgICAgZGVmYXVsdDogJ2xvb3BfaW5kZXgnXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGh0bWwoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gYFxuICAgICAgPGRpdiBjbGFzcz1cImRpc3BsYXktZmxleFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleC1ub25lIHBsMTAgcHIwIHB0NCBwYjIgdGV4dC1jZW50ZXJcIiA+Rm9yPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwbDIgcHIwIHB0MiBwYjJcIiA+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJub2RlLWZvcm0tY29udHJvbFwiIG5vZGU6bW9kZWw9XCJudW1iZXJfc3RhcnRcIiAvPiA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtbm9uZSBwbDIgcHIwIHB0NCBwYjIgdGV4dC1jZW50ZXJcIiA+VG8gPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcjIgcGwwIHB0MiBwYjJcIiA+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJub2RlLWZvcm0tY29udHJvbFwiIG5vZGU6bW9kZWw9XCJudW1iZXJfZW5kXCIgLz48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtbm9uZSBwbDIgcHIwIHB0NDIgcGIyIHRleHQtY2VudGVyXCIgPlN0ZXA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByMTAgcGwwIHB0MiBwYjJcIiA+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJub2RlLWZvcm0tY29udHJvbFwiIG5vZGU6bW9kZWw9XCJudW1iZXJfc3RlcFwiIC8+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlciBwM1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuR29Hcm91cCBub2RlLWZvcm0tY29udHJvbFwiPkdvIHRvIENvbnRlbnQ8L2J1dHRvbj5cbiAgICAgIDwvZGl2PmA7XG4gIH1cbiAgc2NyaXB0KHsgZWxOb2RlLCBtYWluLCBub2RlIH06IGFueSk6IHZvaWQge1xuICAgIGVsTm9kZS5xdWVyeVNlbGVjdG9yKCcuYnRuR29Hcm91cCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG5vZGUucGFyZW50Lm9wZW5Hcm91cChub2RlLkdldElkKCkpO1xuICAgIH0pXG4gICAgY29uc3QgdGVtcF9lbnZfbmFtZSA9IGB0ZW1wXyR7bm9kZS5HZXRJZCgpfV9lbnZfbmFtZWA7XG4gICAgY29uc3QgdGVtcF92YWx1ZSA9IG1haW4udGVtcC5HZXQodGVtcF9lbnZfbmFtZSk7XG4gICAgaWYgKCF0ZW1wX3ZhbHVlKSB7XG4gICAgICBtYWluLnRlbXAuU2V0KHRlbXBfZW52X25hbWUsIG5vZGUuZGF0YS5HZXQoJ2Vudl9uYW1lJykpO1xuICAgICAgbWFpbi5uZXdWYXJpYWJsZShub2RlLmRhdGEuR2V0KCdlbnZfbmFtZScpLCBub2RlLkdldElkKCkpO1xuICAgIH0gZWxzZSBpZiAobm9kZS5kYXRhLkdldCgnZW52X25hbWUnKSAhPSB0ZW1wX3ZhbHVlKSB7XG4gICAgICBtYWluLmNoYW5nZVZhcmlhYmxlTmFtZSh0ZW1wX3ZhbHVlLCBub2RlLmRhdGEuR2V0KCdlbnZfbmFtZScpLCBub2RlLkdldElkKCkpO1xuICAgICAgbWFpbi50ZW1wLlNldCh0ZW1wX2Vudl9uYW1lLCBub2RlLmRhdGEuR2V0KCdlbnZfbmFtZScpKTtcbiAgICB9XG5cbiAgfVxuICBhc3luYyBleGVjdXRlKG5vZGVJZDogYW55LCBkYXRhOiBhbnksIG1hbmFnZXI6IFdvcmtlck1hbmFnZXIsIG5leHQ6IGFueSkge1xuICAgIGNvbnN0IGdyb3VwID0gbWFuYWdlci5nZXRHcm91cEN1cnJlbnQoKTtcbiAgICBtYW5hZ2VyLnNldEdyb3VwKGRhdGEuaWQpO1xuICAgIGNvbnN0IG51bWJlcl9zdGFydCA9ICttYW5hZ2VyLmdldFRleHQoZGF0YS5udW1iZXJfc3RhcnQsIG5vZGVJZCk7XG4gICAgY29uc3QgbnVtYmVyX2VuZCA9ICttYW5hZ2VyLmdldFRleHQoZGF0YS5udW1iZXJfZW5kLCBub2RlSWQpO1xuICAgIGNvbnN0IG51bWJlcl9zdGVwID0gK21hbmFnZXIuZ2V0VGV4dChkYXRhLm51bWJlcl9zdGVwLCBub2RlSWQpO1xuXG4gICAgZm9yIChsZXQgbG9vcF9pbmRleCA9IG51bWJlcl9zdGFydDsgbG9vcF9pbmRleCA8PSBudW1iZXJfZW5kICYmICFtYW5hZ2VyLmZsZ1N0b3BwaW5nOyBsb29wX2luZGV4ID0gbG9vcF9pbmRleCArIG51bWJlcl9zdGVwKSB7XG4gICAgICBtYW5hZ2VyLnNldFZhcmlhYmxlT2JqZWN0KGRhdGEuZW52X25hbWUsIGxvb3BfaW5kZXgsIG5vZGVJZCk7XG4gICAgICBhd2FpdCBtYW5hZ2VyLmV4Y3V0ZUFzeW5jKCk7XG4gICAgfVxuICAgIG1hbmFnZXIuc2V0R3JvdXAoZ3JvdXApO1xuICAgIGF3YWl0IHRoaXMubmV4dE5vZGUoZGF0YSwgbmV4dCwgbm9kZUlkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgV29ya2VyTWFuYWdlciB9IGZyb20gXCIuLi93b3JrZXIvbWFuYWdlclwiO1xuaW1wb3J0IHsgV29ya2VyTm9kZSB9IGZyb20gXCIuLi93b3JrZXIvbm9kZVwiO1xuXG5leHBvcnQgY2xhc3MgQ29yZUdyb3VwTm9kZSBleHRlbmRzIFdvcmtlck5vZGUge1xuICBrZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJjb3JlX2dyb3VwXCI7XG4gIH1cbiAgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJHcm91cFwiO1xuICB9XG4gIGljb24oKSB7XG4gICAgcmV0dXJuICc8aSBjbGFzcz1cImZhciBmYS1vYmplY3QtZ3JvdXBcIj48L2k+JztcbiAgfVxuICBodG1sKHsgZWxOb2RlLCBtYWluLCBub2RlIH06IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgcDNcIj48YnV0dG9uIGNsYXNzPVwiYnRuR29Hcm91cCBub2RlLWZvcm0tY29udHJvbFwiPkdvIHRvIEdyb3VwPC9idXR0b24+PC9kaXY+JztcbiAgfVxuICBzY3JpcHQoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KTogdm9pZCB7XG4gICAgZWxOb2RlLnF1ZXJ5U2VsZWN0b3IoJy5idG5Hb0dyb3VwJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbm9kZS5wYXJlbnQub3Blbkdyb3VwKG5vZGUuR2V0SWQoKSk7XG4gICAgfSlcbiAgfVxuICBhc3luYyBleGVjdXRlKG5vZGVJZDogYW55LCBkYXRhOiBhbnksIG1hbmFnZXI6IFdvcmtlck1hbmFnZXIsIG5leHQ6IGFueSkge1xuICAgIGNvbnN0IGdyb3VwID0gbWFuYWdlci5nZXRHcm91cEN1cnJlbnQoKTtcbiAgICBtYW5hZ2VyLnNldEdyb3VwKGRhdGEuaWQpO1xuICAgIGF3YWl0IG1hbmFnZXIuZXhjdXRlQXN5bmMoKTtcbiAgICBtYW5hZ2VyLnNldEdyb3VwKGdyb3VwKTtcbiAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFdvcmtlck1hbmFnZXIgfSBmcm9tIFwiLi4vd29ya2VyL21hbmFnZXJcIjtcbmltcG9ydCB7IFdvcmtlck5vZGUgfSBmcm9tIFwiLi4vd29ya2VyL25vZGVcIjtcblxuZXhwb3J0IGNsYXNzIENvcmVJZk5vZGUgZXh0ZW5kcyBXb3JrZXJOb2RlIHtcbiAga2V5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiY29yZV9pZlwiO1xuICB9XG4gIG5hbWUoKSB7XG4gICAgcmV0dXJuIFwiSWZcIjtcbiAgfVxuICBpY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICc8aSBjbGFzcz1cImZhcyBmYS1lcXVhbHNcIj48L2k+JztcbiAgfVxuICBwcm9wZXJ0aWVzKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICBrZXk6IFwiY29uZGl0aW9uXCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgIH0sXG4gICAgICBjb25kOiB7XG4gICAgICAgIGtleTogXCJjb25kXCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIHN1YjogdHJ1ZSxcbiAgICAgICAgZGVmYXVsdDogMVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBvcHRpb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgY2xhc3M6ICcnLFxuICAgICAgZG90OiB7XG4gICAgICAgIGxlZnQ6IDEsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaHRtbCh7IGVsTm9kZSwgbWFpbiwgbm9kZSB9OiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvbmRpdGlvbiA9IG5vZGUuZGF0YS5HZXQoJ2NvbmRpdGlvbicpO1xuICAgIGxldCBodG1sID0gJyc7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvbmRpdGlvbjsgaW5kZXgrKykge1xuICAgICAgaHRtbCA9IGAke2h0bWx9PGRpdiBjbGFzcz1cIm5vZGUtY29udGVudC1yb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwbDEwIHByMSBwdDIgcGIyXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJub2RlLWZvcm0tY29udHJvbFwiIG5vZGU6bW9kZWw9XCJjb25kJHs1MDAwMSArIGluZGV4fVwiLz48L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0XCIgY2xhc3M9XCJwbDEgcHIxMCBwdDIgcGIyXCI+VGhlbjwvZGl2PlxuICAgICAgPGRpdj48c3BhbiBjbGFzcz1cIm5vZGUtZG90XCIgbm9kZT1cIiR7NTAwMDEgKyBpbmRleH1cIj48L3NwYW4+PC9kaXY+XG4gICAgICA8L2Rpdj5gO1xuICAgIH1cbiAgICBodG1sID0gYCR7aHRtbH08ZGl2IGNsYXNzPVwibm9kZS1jb250ZW50LXJvd1wiPlxuICAgIDxkaXYgY2xhc3M9XCJwbDEwIHByMSBwdDIgcGIyXCI+PGJ1dHRvbiBjbGFzcz1cImJ0bkFkZENvbmRpdGlvblwiPkFkZDwvYnV0dG9uPjwvZGl2PlxuICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0XCIgY2xhc3M9XCJwbDEgcHIxMCBwdDIgcGIyXCI+RWxzZTwvZGl2PlxuICAgIDxkaXY+PHNwYW4gY2xhc3M9XCJub2RlLWRvdFwiIG5vZGU9XCI1MDAwMFwiPjwvc3Bhbj48L2Rpdj5cbiAgICA8L2Rpdj5gO1xuICAgIHJldHVybiBodG1sO1xuICB9XG4gIHNjcmlwdCh7IGVsTm9kZSwgbWFpbiwgbm9kZSB9OiBhbnkpOiB2b2lkIHtcbiAgICBlbE5vZGUucXVlcnlTZWxlY3RvcignLmJ0bkFkZENvbmRpdGlvbicpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG5vZGUuZGF0YS5JbmNyZWFzZSgnY29uZGl0aW9uJyk7XG4gICAgfSlcbiAgfVxuICBhc3luYyBleGVjdXRlKG5vZGVJZDogYW55LCBkYXRhOiBhbnksIG1hbmFnZXI6IFdvcmtlck1hbmFnZXIsIG5leHQ6IGFueSkge1xuXG4gICAgY29uc3QgY29uZGl0aW9uID0gZGF0YS5jb25kaXRpb247XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvbmRpdGlvbiAmJiAhbWFuYWdlci5mbGdTdG9wcGluZzsgaW5kZXgrKykge1xuICAgICAgbGV0IG5vZGUgPSA1MDAwMSArIGluZGV4O1xuICAgICAgY29uc3QgY29uZGl0aW9uX25vZGUgPSBkYXRhW2Bjb25kJHtub2RlfWBdO1xuICAgICAgaWYgKG1hbmFnZXIucnVuQ29kZShjb25kaXRpb25fbm9kZSwgbm9kZUlkKSA9PSB0cnVlKSB7XG4gICAgICAgIGF3YWl0IHRoaXMubmV4dE5vZGUoZGF0YSwgbmV4dCwgbm9kZUlkLCBub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCwgNTAwMDApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBXb3JrZXJNYW5hZ2VyIH0gZnJvbSBcIi4uL3dvcmtlci9tYW5hZ2VyXCI7XG5pbXBvcnQgeyBXb3JrZXJOb2RlIH0gZnJvbSBcIi4uL3dvcmtlci9ub2RlXCI7XG5cbmV4cG9ydCBjbGFzcyBDb3JlUHJvamVjdE5vZGUgZXh0ZW5kcyBXb3JrZXJOb2RlIHtcbiAga2V5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiY29yZV9wcm9qZWN0XCI7XG4gIH1cbiAgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJQcm9qZWN0XCI7XG4gIH1cbiAgaWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYXMgZmEtcHJvamVjdC1kaWFncmFtXCI+PC9pPic7XG4gIH1cbiAgcHJvcGVydGllcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9qZWN0OiB7XG4gICAgICAgIGtleTogXCJwcm9qZWN0XCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIHNlbGVjdDogdHJ1ZSxcbiAgICAgICAgZGF0YVNlbGVjdDogKHsgZWxOb2RlLCBtYWluLCBub2RlIH06IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtYWluLmdldFByb2plY3RBbGwoKS5tYXAoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uR2V0KCdpZCcpLFxuICAgICAgICAgICAgICB0ZXh0OiBpdGVtLkdldCgnbmFtZScpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGh0bWwoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlciBwM1wiPjxzZWxlY3QgY2xhc3M9XCJub2RlLWZvcm0tY29udHJvbFwiIG5vZGU6bW9kZWw9XCJwcm9qZWN0XCI+PC9zZWxlY3Q+PC9kaXY+JztcbiAgfVxuICBzY3JpcHQoeyBlbE5vZGUsIG1haW4sIG5vZGUgfTogYW55KTogdm9pZCB7XG5cbiAgfVxuICBhc3luYyBleGVjdXRlKG5vZGVJZDogYW55LCBkYXRhOiBhbnksIG1hbmFnZXI6IFdvcmtlck1hbmFnZXIsIG5leHQ6IGFueSkge1xuICAgIGNvbnN0IHByb2plY3QgPSBtYW5hZ2VyLmdldFByb2plY3RDdXJyZW50KCk7XG4gICAgY29uc3QgZ3JvdXAgPSBtYW5hZ2VyLmdldEdyb3VwQ3VycmVudCgpO1xuICAgIG1hbmFnZXIuc2V0UHJvamVjdChkYXRhLnByb2plY3QpO1xuICAgIGF3YWl0IG1hbmFnZXIuZXhjdXRlQXN5bmMoKTtcbiAgICBtYW5hZ2VyLnNldFByb2plY3QocHJvamVjdCk7XG4gICAgbWFuYWdlci5zZXRHcm91cChncm91cCk7XG4gICAgYXdhaXQgdGhpcy5uZXh0Tm9kZShkYXRhLCBuZXh0LCBub2RlSWQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBXb3JrZXJNYW5hZ2VyIH0gZnJvbSBcIi4uL3dvcmtlci9tYW5hZ2VyXCI7XG5pbXBvcnQgeyBXb3JrZXJOb2RlIH0gZnJvbSBcIi4uL3dvcmtlci9ub2RlXCI7XG5cbmV4cG9ydCBjbGFzcyBDb3JlU3dpdGNoTm9kZSBleHRlbmRzIFdvcmtlck5vZGUge1xuICBrZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJjb3JlX3N3aXRjaFwiO1xuICB9XG4gIG5hbWUoKSB7XG4gICAgcmV0dXJuIFwiU3dpdGNoXCI7XG4gIH1cbiAgaWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYXMgZmEtcmFuZG9tXCI+PC9pPic7XG4gIH1cbiAgcHJvcGVydGllcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25kaXRpb246IHtcbiAgICAgICAga2V5OiBcImNvbmRpdGlvblwiLFxuICAgICAgICBlZGl0OiB0cnVlLFxuICAgICAgICBkZWZhdWx0OiAxXG4gICAgICB9LFxuICAgICAgY2FzZToge1xuICAgICAgICBrZXk6IFwiY2FzZVwiLFxuICAgICAgICBlZGl0OiB0cnVlLFxuICAgICAgICBzdWI6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgIH0sXG4gICAgICBjYXNlX2lucHV0OiB7XG4gICAgICAgIGtleTogXCJjYXNlX2lucHV0XCIsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICB9LFxuICAgIH1cbiAgfVxuICBvcHRpb24oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgY2xhc3M6ICcnLFxuICAgICAgZG90OiB7XG4gICAgICAgIGxlZnQ6IDEsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaHRtbCh7IGVsTm9kZSwgbWFpbiwgbm9kZSB9OiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvbmRpdGlvbiA9IG5vZGUuZGF0YS5HZXQoJ2NvbmRpdGlvbicpO1xuICAgIGxldCBodG1sID0gJyc7XG4gICAgaHRtbCA9IGAke2h0bWx9PGRpdiBjbGFzcz1cIm5vZGUtY29udGVudC1yb3dcIj5cbiAgICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpyaWdodFwiIGNsYXNzPVwicGwxMCBwcjEgcHQyIHBiMlwiPklucHV0PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBsMiBwcjEgcHQyIHBiMlwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwibm9kZS1mb3JtLWNvbnRyb2xcIiBub2RlOm1vZGVsPVwiY2FzZV9pbnB1dFwiLz48L2Rpdj5cbiAgICA8ZGl2PjwvZGl2PlxuICAgIDwvZGl2PmA7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvbmRpdGlvbjsgaW5kZXgrKykge1xuICAgICAgaHRtbCA9IGAke2h0bWx9PGRpdiBjbGFzcz1cIm5vZGUtY29udGVudC1yb3dcIj5cbiAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0XCIgY2xhc3M9XCJwbDEwIHByMSBwdDIgcGIyXCI+Q2FzZTwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInBsMiBwcjEgcHQyIHBiMlwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwibm9kZS1mb3JtLWNvbnRyb2xcIiBub2RlOm1vZGVsPVwiY2FzZSR7NTAwMDEgKyBpbmRleH1cIi8+PC9kaXY+XG4gICAgICA8ZGl2PjxzcGFuIGNsYXNzPVwibm9kZS1kb3RcIiBub2RlPVwiJHs1MDAwMSArIGluZGV4fVwiPjwvc3Bhbj48L2Rpdj5cbiAgICAgIDwvZGl2PmA7XG4gICAgfVxuICAgIGh0bWwgPSBgJHtodG1sfTxkaXYgY2xhc3M9XCJub2RlLWNvbnRlbnQtcm93XCI+XG4gICAgPGRpdiBjbGFzcz1cInBsMTAgcHIxIHB0MiBwYjJcIj48YnV0dG9uIGNsYXNzPVwiYnRuQWRkQ29uZGl0aW9uXCI+QWRkPC9idXR0b24+PC9kaXY+XG4gICAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246cmlnaHRcIiBjbGFzcz1cInBsMiBwcjEwIHB0MiBwYjJcIj5EZWZhdWx0PC9kaXY+XG4gICAgPGRpdj48c3BhbiBjbGFzcz1cIm5vZGUtZG90XCIgbm9kZT1cIjUwMDAwXCI+PC9zcGFuPjwvZGl2PlxuICAgIDwvZGl2PmA7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cbiAgc2NyaXB0KHsgZWxOb2RlLCBtYWluLCBub2RlIH06IGFueSk6IHZvaWQge1xuICAgIGVsTm9kZS5xdWVyeVNlbGVjdG9yKCcuYnRuQWRkQ29uZGl0aW9uJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbm9kZS5kYXRhLkluY3JlYXNlKCdjb25kaXRpb24nKTtcbiAgICB9KVxuICB9XG4gIGFzeW5jIGV4ZWN1dGUobm9kZUlkOiBhbnksIGRhdGE6IGFueSwgbWFuYWdlcjogV29ya2VyTWFuYWdlciwgbmV4dDogYW55KSB7XG4gICAgY29uc3QgY29uZGl0aW9uID0gZGF0YS5jb25kaXRpb247XG4gICAgY29uc3QgY2FzZV9pbnB1dCA9IG1hbmFnZXIuZ2V0VGV4dChkYXRhLmNhc2VfaW5wdXQsbm9kZUlkKTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY29uZGl0aW9uICYmICFtYW5hZ2VyLmZsZ1N0b3BwaW5nOyBpbmRleCsrKSB7XG4gICAgICBsZXQgbm9kZSA9IDUwMDAxICsgaW5kZXg7XG4gICAgICBjb25zdCBjb25kaXRpb25fbm9kZSA9IGRhdGFbYGNhc2Uke25vZGV9YF07XG4gICAgICBpZiAobWFuYWdlci5nZXRUZXh0KGNvbmRpdGlvbl9ub2RlLG5vZGVJZCkgPT0gY2FzZV9pbnB1dCkge1xuICAgICAgICBhd2FpdCB0aGlzLm5leHROb2RlKGRhdGEsIG5leHQsIG5vZGVJZCwgbm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgYXdhaXQgdGhpcy5uZXh0Tm9kZShkYXRhLCBuZXh0LCBub2RlSWQsIDUwMDAwKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgV29ya2VyU2V0dXAgfSBmcm9tIFwiLi4vd29ya2VyL3NldHVwXCI7XG5pbXBvcnQgeyBDb3JlQWxlcnROb2RlIH0gZnJvbSBcIi4vYWxlcnRcIjtcbmltcG9ydCB7IENvcmVBc3NpZ25Ob2RlIH0gZnJvbSBcIi4vYXNzaWduXCI7XG5pbXBvcnQgeyBDb3JlQmVnaW5Ob2RlIH0gZnJvbSBcIi4vYmVnaW5cIjtcbmltcG9ydCB7IENvcmVDb25zb2xlTm9kZSB9IGZyb20gXCIuL2NvbnNvbGVcIjtcbmltcG9ydCB7IENvcmVEZWxheU5vZGUgfSBmcm9tIFwiLi9kZWxheVwiO1xuaW1wb3J0IHsgQ29yZUVuZE5vZGUgfSBmcm9tIFwiLi9lbmRcIjtcbmltcG9ydCB7IENvcmVGb3JOb2RlIH0gZnJvbSBcIi4vZm9yXCI7XG5pbXBvcnQgeyBDb3JlR3JvdXBOb2RlIH0gZnJvbSBcIi4vZ3JvdXBcIjtcbmltcG9ydCB7IENvcmVJZk5vZGUgfSBmcm9tIFwiLi9pZlwiO1xuaW1wb3J0IHsgQ29yZVByb2plY3ROb2RlIH0gZnJvbSBcIi4vcHJvamVjdFwiO1xuaW1wb3J0IHsgQ29yZVN3aXRjaE5vZGUgfSBmcm9tIFwiLi9zd2l0Y2hcIjtcblxuZXhwb3J0IGNsYXNzIENvcmVTZXR1cCBleHRlbmRzIFdvcmtlclNldHVwIHtcbiAgbm9kZXMoKTogYW55W10ge1xuICAgIHJldHVybiBbXG4gICAgICBDb3JlQmVnaW5Ob2RlLFxuICAgICAgQ29yZUVuZE5vZGUsXG4gICAgICBDb3JlQXNzaWduTm9kZSxcbiAgICAgIENvcmVEZWxheU5vZGUsXG4gICAgICBDb3JlSWZOb2RlLFxuICAgICAgQ29yZVN3aXRjaE5vZGUsXG4gICAgICBDb3JlRm9yTm9kZSxcbiAgICAgIENvcmVBbGVydE5vZGUsXG4gICAgICBDb3JlQ29uc29sZU5vZGUsXG4gICAgICBDb3JlUHJvamVjdE5vZGUsXG4gICAgICBDb3JlR3JvdXBOb2RlLFxuICAgIF07XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBXb3JrZXJTY3JpcHQge1xuICBwcml2YXRlIHJ1bkNvZGVJbkJyb3dzZXIoc2NyaXB0OiBzdHJpbmcsIHZhcmlhYmxlT2JqOiBhbnkpIHtcbiAgICByZXR1cm4gd2luZG93LmV2YWwodGhpcy5HZXRUZXh0SW5Ccm93c2VyKHNjcmlwdCwgdmFyaWFibGVPYmopKTtcbiAgfVxuICBwcml2YXRlIEdldFRleHRJbkJyb3dzZXIoc2NyaXB0OiBzdHJpbmcsIHZhcmlhYmxlT2JqOiBhbnkpIHtcbiAgICBsZXQgcGFyYW1UZXh0ID0gXCJcIjtcbiAgICBsZXQgcGFyYW1WYWx1ZTogYW55ID0gW107XG4gICAgaWYgKCF2YXJpYWJsZU9iaikgdmFyaWFibGVPYmogPSB7fTtcbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModmFyaWFibGVPYmopKSB7XG4gICAgICBpZiAocGFyYW1UZXh0ICE9IFwiXCIpIHtcbiAgICAgICAgcGFyYW1UZXh0ID0gYCR7cGFyYW1UZXh0fSwke2tleX1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYW1UZXh0ID0ga2V5O1xuICAgICAgfVxuICAgICAgcGFyYW1WYWx1ZSA9IFsuLi5wYXJhbVZhbHVlLCB2YXJpYWJsZU9ialtrZXldXTtcbiAgICB9XG4gICAgcmV0dXJuIHdpbmRvdy5ldmFsKCcoKCcgKyBwYXJhbVRleHQgKyAnKT0+KGAnICsgc2NyaXB0ICsgJ2ApKScpKC4uLnBhcmFtVmFsdWUpXG4gIH1cbiAgcHJpdmF0ZSBHZXRUZXh0SW5Ob2RlKHNjcmlwdDogc3RyaW5nLCB2YXJpYWJsZU9iajogYW55KSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgcHJpdmF0ZSBydW5Db2RlSW5Ob2RlKHNjcmlwdDogc3RyaW5nLCB2YXJpYWJsZU9iajogYW55KSB7XG4gICAgY29uc3QgeyBWTSB9ID0gcmVxdWlyZSgndm0yJyk7XG4gICAgY29uc3Qgdm0gPSBuZXcgVk0oKTtcbiAgICByZXR1cm4gdm0ucnVuSW5Db250ZXh0KHNjcmlwdCwgdmFyaWFibGVPYmopO1xuICB9XG4gIHB1YmxpYyBydW5Db2RlKHNjcmlwdDogc3RyaW5nLCB2YXJpYWJsZU9iajogYW55KSB7XG4gICAgaWYgKHdpbmRvdyAhPSB1bmRlZmluZWQgJiYgZG9jdW1lbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5Db2RlSW5Ccm93c2VyKHNjcmlwdCwgdmFyaWFibGVPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5Db2RlSW5Ob2RlKHNjcmlwdCwgdmFyaWFibGVPYmopO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgZ2V0VGV4dChzY3JpcHQ6IHN0cmluZywgdmFyaWFibGVPYmo6IGFueSkge1xuICAgIGlmICh3aW5kb3cgIT0gdW5kZWZpbmVkICYmIGRvY3VtZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0VGV4dEluQnJvd3NlcihzY3JpcHQsIHZhcmlhYmxlT2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0VGV4dEluTm9kZShzY3JpcHQsIHZhcmlhYmxlT2JqKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE5vZGVCZWdpbiB9IGZyb20gXCIuLi9ub2Rlcy9iZWdpblwiO1xuaW1wb3J0IHsgV29ya2VyTm9kZSB9IGZyb20gXCIuL25vZGVcIjtcbmltcG9ydCB7IFdvcmtlclNjcmlwdCB9IGZyb20gXCIuL3NjcmlwdFwiO1xuaW1wb3J0IHsgV29ya2VyU2V0dXAgfSBmcm9tIFwiLi9zZXR1cFwiO1xuZXhwb3J0IGNvbnN0IFByb3BlcnR5RW51bSA9IHtcbiAgbWFpbjogXCJtYWluX3Byb2plY3RcIixcbiAgc29sdXRpb246ICdtYWluX3NvbHV0aW9uJyxcbiAgbGluZTogJ21haW5fbGluZScsXG4gIHZhcmlhYmxlOiAnbWFpbl92YXJpYWJsZScsXG4gIGdyb3VwQ2F2YXM6IFwibWFpbl9ncm91cENhdmFzXCIsXG59O1xuZXhwb3J0IGNsYXNzIFdvcmtlck1hbmFnZXIge1xuICBwcml2YXRlIGV2ZW50czogYW55ID0ge307XG4gIHB1YmxpYyBzY3JpcHRDb2RlOiBXb3JrZXJTY3JpcHQgPSBuZXcgV29ya2VyU2NyaXB0KCk7XG4gIHByaXZhdGUgdmFyaWFibGVWYWx1ZTogYW55ID0ge307XG4gIHB1YmxpYyBvblNhZmUoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB0aGlzLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cbiAgLyogRXZlbnRzICovXG4gIHB1YmxpYyBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogYW55KSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcihgVGhlIGxpc3RlbmVyIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbiwgdGhlIGdpdmVuIHR5cGUgaXMgJHt0eXBlb2YgY2FsbGJhY2t9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBldmVudCBpcyBub3QgYSBzdHJpbmdcbiAgICBpZiAodHlwZW9mIGV2ZW50ICE9PSAnc3RyaW5nJykge1xuICAgICAgY29uc29sZS5lcnJvcihgVGhlIGV2ZW50IG5hbWUgbXVzdCBiZSBhIHN0cmluZywgdGhlIGdpdmVuIHR5cGUgaXMgJHt0eXBlb2YgZXZlbnR9YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoaXMgZXZlbnQgbm90IGV4aXN0c1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0ge1xuICAgICAgICBsaXN0ZW5lcnM6IFtdXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZXZlbnRzW2V2ZW50XS5saXN0ZW5lcnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSkge1xuICAgIC8vIENoZWNrIGlmIHRoaXMgZXZlbnQgbm90IGV4aXN0c1xuXG4gICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudF0pIHJldHVybiBmYWxzZVxuXG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5ldmVudHNbZXZlbnRdLmxpc3RlbmVyc1xuICAgIGNvbnN0IGxpc3RlbmVySW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjaylcbiAgICBjb25zdCBoYXNMaXN0ZW5lciA9IGxpc3RlbmVySW5kZXggPiAtMVxuICAgIGlmIChoYXNMaXN0ZW5lcikgbGlzdGVuZXJzLnNwbGljZShsaXN0ZW5lckluZGV4LCAxKVxuICB9XG5cbiAgcHVibGljIGRpc3BhdGNoKGV2ZW50OiBzdHJpbmcsIGRldGFpbHM6IGFueSkge1xuICAgIC8vIENoZWNrIGlmIHRoaXMgZXZlbnQgbm90IGV4aXN0c1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmV2ZW50c1tldmVudF0ubGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyOiBhbnkpID0+IHtcbiAgICAgIGxpc3RlbmVyKGRldGFpbHMpO1xuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgJGRhdGE6IGFueTtcbiAgcHJpdmF0ZSAkbm9kZXM6IFdvcmtlck5vZGVbXSA9IFtdO1xuICBwcml2YXRlICRwcm9qZWN0OiBhbnk7XG4gIHByaXZhdGUgJGdyb3VwOiBhbnkgPSBcInJvb3RcIjtcbiAgcHJpdmF0ZSBkZWxheV90aW1lOiBudW1iZXIgPSAxMDA7XG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihkYXRhOiBhbnkgPSBudWxsKSB7XG4gICAgdGhpcy5Mb2FkRGF0YShkYXRhKTtcbiAgfVxuICBwdWJsaWMgc2V0UHJvamVjdChwcm9qZWN0OiBhbnkpIHtcbiAgICB0aGlzLiRwcm9qZWN0ID0gcHJvamVjdDtcbiAgICB0aGlzLiRncm91cCA9IFwicm9vdFwiO1xuICAgIGlmICh0aGlzLnZhcmlhYmxlVmFsdWVbdGhpcy4kcHJvamVjdF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHByaiA9IHRoaXMuZ2V0UHJvamVjdEJ5SWQodGhpcy4kcHJvamVjdCk7XG4gICAgICB0aGlzLnZhcmlhYmxlVmFsdWVbdGhpcy4kcHJvamVjdF0gPSBwcmoudmFyaWFibGUubWFwKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHZhbHVlOiBpdGVtLmluaXRhbFZhbHVlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgZ2V0UHJvamVjdEJ5SWQoaWQ6IGFueSkge1xuICAgIHJldHVybiB0aGlzLiRkYXRhPy5wcm9qZWN0cz8uZmluZCgoaXRlbTogYW55KSA9PiBpdGVtLmlkID09IGlkKTtcbiAgfVxuICBwdWJsaWMgZ2V0UHJvamVjdCgpIHtcbiAgICBpZiAodGhpcy4kZGF0YS5rZXkgPT09IFByb3BlcnR5RW51bS5zb2x1dGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UHJvamVjdEJ5SWQodGhpcy4kcHJvamVjdCk7XG4gICAgfVxuICAgIGlmICh0aGlzLiRkYXRhLmtleSA9PT0gUHJvcGVydHlFbnVtLm1haW4pIHtcbiAgICAgIHJldHVybiB0aGlzLiRkYXRhO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgc2V0R3JvdXAoZ3JvdXA6IGFueSkge1xuICAgIHRoaXMuJGdyb3VwID0gZ3JvdXA7XG4gIH1cbiAgcHVibGljIGdldEdyb3VwQ3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4kZ3JvdXA7XG4gIH1cbiAgcHVibGljIGdldFByb2plY3RDdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLiRwcm9qZWN0O1xuICB9XG4gIHB1YmxpYyBnZXROb2RlSW5Hcm91cChncm91cDogYW55ID0gbnVsbCkge1xuICAgIGxldCBfZ3JvdXAgPSBncm91cCA/PyB0aGlzLiRncm91cDtcbiAgICByZXR1cm4gdGhpcy5nZXRQcm9qZWN0KCk/Lm5vZGVzPy5maWx0ZXIoKGl0ZW06IGFueSkgPT4gaXRlbS5ncm91cCA9PSBfZ3JvdXApO1xuICB9XG4gIHB1YmxpYyBnZXROb2RlQnlJZChfaWQ6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmdldE5vZGVJbkdyb3VwKCk/LmZpbHRlcigoaXRlbTogYW55KSA9PiBpdGVtLmlkID09IF9pZCk/LlswXTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROb2RlQnlLZXkoX2tleTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Tm9kZUluR3JvdXAoKT8uZmlsdGVyKChpdGVtOiBhbnkpID0+IGl0ZW0ua2V5ID09IF9rZXkpPy5bMF07XG4gIH1cbiAgcHVibGljIExvYWREYXRhKGRhdGE6IGFueSk6IFdvcmtlck1hbmFnZXIge1xuICAgIGlmICghZGF0YSkgcmV0dXJuIHRoaXM7XG4gICAgdGhpcy52YXJpYWJsZVZhbHVlID0ge31cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLiRkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIGlmICh0aGlzLiRkYXRhLmtleSA9PT0gUHJvcGVydHlFbnVtLnNvbHV0aW9uKSB7XG4gICAgICB0aGlzLiRwcm9qZWN0ID0gdGhpcy4kZGF0YS5wcm9qZWN0O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuJHByb2plY3QpIHtcbiAgICAgIHRoaXMuJHByb2plY3QgPSB0aGlzLiRkYXRhLnByb2plY3RzPy5bMF0/LmlkO1xuICAgIH1cbiAgICB0aGlzLnNldFByb2plY3QodGhpcy4kcHJvamVjdCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgbmV3U2V0dXAoc2V0dXA6IGFueSkge1xuICAgIHRoaXMuU2V0dXAobmV3IHNldHVwKCkpO1xuICB9XG4gIHB1YmxpYyBTZXR1cChzZXR1cDogV29ya2VyU2V0dXApIHtcbiAgICB0aGlzLiRub2RlcyA9IFsuLi50aGlzLiRub2RlcywgLi4uc2V0dXAubmV3Tm9kZXMoKV07XG4gIH1cbiAgcHVibGljIGdldENvbnRyb2xOb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy4kbm9kZXMubWFwKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLntcbiAgICAgICAgICBrZXk6IFwiXCIsXG4gICAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgICBncm91cDogXCJcIixcbiAgICAgICAgICBodG1sOiBcIlwiLFxuICAgICAgICAgIHNjcmlwdDogXCJcIixcbiAgICAgICAgICBwcm9wZXJ0aWVzOiBcIlwiLFxuICAgICAgICAgIGRvdDoge1xuICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIHJpZ2h0OiAxLFxuICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLi4uaXRlbS5vcHRpb24oKSA/PyB7fSxcbiAgICAgICAga2V5OiBpdGVtLmtleSgpLFxuICAgICAgICBuYW1lOiBpdGVtLm5hbWUoKSxcbiAgICAgICAgaWNvbjogaXRlbS5pY29uKCksXG4gICAgICAgIGdyb3VwOiBpdGVtLmdyb3VwKCksXG4gICAgICAgIGh0bWw6IGl0ZW0uaHRtbCxcbiAgICAgICAgc2NyaXB0OiBpdGVtLnNjcmlwdCxcbiAgICAgICAgcHJvcGVydGllczogaXRlbS5wcm9wZXJ0aWVzKCkgPz8ge30sXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBwcml2YXRlIGdldFdvcmtlck5vZGUoX2tleTogc3RyaW5nKTogV29ya2VyTm9kZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLiRub2Rlcz8uZmlsdGVyKChpdGVtKSA9PiBpdGVtLmNoZWNrS2V5KF9rZXkpKT8uWzBdO1xuICB9XG4gIHByaXZhdGUgYXN5bmMgZXhjdXRlTm9kZSgkaWQ6IGFueSkge1xuICAgIGNvbnN0IGRhdGFOb2RlID0gdGhpcy5nZXROb2RlQnlJZCgkaWQpO1xuICAgIGF3YWl0IHRoaXMuZXhjdXRlRGF0YU5vZGUoZGF0YU5vZGUpO1xuICB9XG4gIGRlbGF5KHRpbWU6IG51bWJlciA9IDEwMCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpO1xuICB9XG4gIHByaXZhdGUgYXN5bmMgZXhjdXRlRGF0YU5vZGUoZGF0YU5vZGU6IGFueSkge1xuICAgIGlmICh0aGlzLmZsZ1N0b3BwaW5nKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoKCd3b3JrZXJfc3RvcHBpbmcnLCB7fSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuZGVsYXkodGhpcy5kZWxheV90aW1lKTtcbiAgICBpZiAoZGF0YU5vZGUpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2goJ25vZGVfc3RhcnQnLCB7IG5vZGU6IGRhdGFOb2RlIH0pO1xuICAgICAgY29uc3Qgd29ya2VyTm9kZSA9IHRoaXMuZ2V0V29ya2VyTm9kZShkYXRhTm9kZS5rZXkpO1xuICAgICAgYXdhaXQgd29ya2VyTm9kZT8uZXhlY3V0ZShkYXRhTm9kZS5pZCwgZGF0YU5vZGUsIHRoaXMsIHRoaXMuZXhjdXRlTm9kZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2goJ25vZGVfZW5kJywgeyBub2RlOiBkYXRhTm9kZSB9KTtcbiAgICB9XG4gIH1cbiAgcHVibGljIGFzeW5jIGV4Y3V0ZUFzeW5jKCkge1xuICAgIGNvbnN0IGRhdGFOb2RlID0gdGhpcy5nZXROb2RlQnlLZXkoYCR7Tm9kZUJlZ2lufWApO1xuICAgIGF3YWl0IHRoaXMuZXhjdXRlRGF0YU5vZGUoZGF0YU5vZGUpO1xuICB9XG4gIHB1YmxpYyBleGN1dGUoKSB7XG4gICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLmRpc3BhdGNoKCd3b3JrZXJfc3RhcnQnLCB7fSk7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmZsZ1N0b3BwaW5nID0gZmFsc2U7XG4gICAgICAgIGF3YWl0IHRoaXMuZXhjdXRlQXN5bmMoKTtcbiAgICAgICAgdGhpcy5mbGdTdG9wcGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCd3b3JrZXJfZW5kJywge30pO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXgpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCd3b3JrZXJfZW5kJywge30pO1xuICAgICAgfVxuICAgICAgdGhpcy5mbGdTdG9wcGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG4gIGZsZ1N0b3BwaW5nOiBhbnkgPSBudWxsO1xuICBwdWJsaWMgc3RvcCgpIHtcbiAgICB0aGlzLmZsZ1N0b3BwaW5nID0gdHJ1ZTtcbiAgfVxuICBwdWJsaWMgc2V0VmFyaWFibGVPYmplY3QobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBub2RlSWQ6IGFueSwgcHJvamVjdDogYW55ID0gbnVsbCkge1xuICAgIGxldCB0cmVlU2NvcGUgPSBbbm9kZUlkXTtcbiAgICB3aGlsZSAobm9kZUlkICE9ICdyb290Jykge1xuICAgICAgbGV0IG5vZGUgPSB0aGlzLmdldE5vZGVCeUlkKG5vZGVJZCk7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBub2RlSWQgPSBub2RlLmdyb3VwXG4gICAgICAgIHRyZWVTY29wZSA9IFsuLi50cmVlU2NvcGUsIG5vZGVJZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlSWQgPSAncm9vdCdcbiAgICAgICAgdHJlZVNjb3BlID0gWy4uLnRyZWVTY29wZSwgbm9kZUlkXTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0ICR2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVWYWx1ZVtwcm9qZWN0ID8/IHRoaXMuJHByb2plY3RdO1xuICAgIGNvbnN0IHRyZWVMZW5naHQgPSB0cmVlU2NvcGUubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0cmVlTGVuZ2h0OyBpKyspIHtcbiAgICAgIGxldCBpdGVtID0gJHZhcmlhYmxlLmZpbHRlcigoaXRlbTogYW55KSA9PiBpdGVtLnNjb3BlID09PSB0cmVlU2NvcGVbaV0gJiYgaXRlbS5uYW1lID09IG5hbWUpPy5bMF07XG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHVibGljIGdldFZhcmlhYmxlT2JqZWN0KG5vZGVJZDogYW55LCBwcm9qZWN0OiBhbnkgPSBudWxsKSB7XG4gICAgY29uc3QgdmFyaWFibGVPYmo6IGFueSA9IHt9O1xuICAgIGxldCB0cmVlU2NvcGUgPSBbbm9kZUlkXTtcbiAgICB3aGlsZSAobm9kZUlkICE9ICdyb290Jykge1xuICAgICAgbGV0IG5vZGUgPSB0aGlzLmdldE5vZGVCeUlkKG5vZGVJZCk7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBub2RlSWQgPSBub2RlLmdyb3VwXG4gICAgICAgIHRyZWVTY29wZSA9IFsuLi50cmVlU2NvcGUsIG5vZGVJZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlSWQgPSAncm9vdCdcbiAgICAgICAgdHJlZVNjb3BlID0gWy4uLnRyZWVTY29wZSwgbm9kZUlkXTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0ICR2YXJpYWJsZSA9IHRoaXMudmFyaWFibGVWYWx1ZVtwcm9qZWN0ID8/IHRoaXMuJHByb2plY3RdO1xuICAgIGNvbnN0IHRyZWVMZW5naHQgPSB0cmVlU2NvcGUubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gdHJlZUxlbmdodDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICR2YXJpYWJsZS5maWx0ZXIoKGl0ZW06IGFueSkgPT4gaXRlbS5zY29wZSA9PT0gdHJlZVNjb3BlW2ldKT8uZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICAgIHZhcmlhYmxlT2JqW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHZhcmlhYmxlT2JqO1xuICB9XG4gIHB1YmxpYyBydW5Db2RlKCRzY3JwaXQ6IGFueSwgbm9kZUlkOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHZhcmlhYmxlT2JqID0gdGhpcy5nZXRWYXJpYWJsZU9iamVjdChub2RlSWQpO1xuICAgIHJldHVybiB0aGlzLnNjcmlwdENvZGUucnVuQ29kZSgkc2NycGl0LCB2YXJpYWJsZU9iaik7XG4gIH1cbiAgcHVibGljIGdldFRleHQoJHNjcnBpdDogYW55LCBub2RlSWQ6IGFueSk6IGFueSB7XG4gICAgY29uc3QgdmFyaWFibGVPYmogPSB0aGlzLmdldFZhcmlhYmxlT2JqZWN0KG5vZGVJZCk7XG4gICAgcmV0dXJuIHRoaXMuc2NyaXB0Q29kZS5nZXRUZXh0KCRzY3JwaXQsIHZhcmlhYmxlT2JqKTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IHdvcmtlck1hbmFnZXIgPSBuZXcgV29ya2VyTWFuYWdlcigpO1xuIiwiaW1wb3J0IHsgQ29yZVNldHVwIH0gZnJvbSAnLi9ub2Rlcy9pbmRleCc7XG5pbXBvcnQgeyB3b3JrZXJNYW5hZ2VyLCBXb3JrZXJNYW5hZ2VyIH0gZnJvbSAnLi93b3JrZXIvaW5kZXgnO1xuXG53b3JrZXJNYW5hZ2VyLm5ld1NldHVwKENvcmVTZXR1cCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQ29yZVNldHVwLFxuICBXb3JrZXJNYW5hZ2VyLFxuICB3b3JrZXJNYW5hZ2VyXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O01BRWEsV0FBVyxDQUFBO0lBQ3RCLEtBQUssR0FBQTtBQUNILFFBQUEsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELFFBQVEsR0FBQTtBQUNOLFFBQUEsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ2hEO0FBQ0Y7O0FDUEQsSUFBWSxPQVFYLENBQUE7QUFSRCxDQUFBLFVBQVksT0FBTyxFQUFBO0FBQ2pCLElBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxLQUFPLENBQUE7QUFDUCxJQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsS0FBTyxDQUFBO0FBQ1AsSUFBQSxPQUFBLENBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLElBQU0sQ0FBQTtBQUNOLElBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxPQUFTLENBQUE7QUFDVCxJQUFBLE9BQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsUUFBVSxDQUFBO0FBQ1YsSUFBQSxPQUFBLENBQUEsT0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLEtBQU8sQ0FBQTtBQUNQLElBQUEsT0FBQSxDQUFBLE9BQUEsQ0FBQSxTQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxTQUFXLENBQUE7QUFDYixDQUFDLEVBUlcsT0FBTyxLQUFQLE9BQU8sR0FRbEIsRUFBQSxDQUFBLENBQUEsQ0FBQTtNQWdCWSxVQUFVLENB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TSxDQUFDLENBQUMsSUFBUyxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLENBQUM7S0FDOUU7QUFDTSxJQUFBLFdBQVcsQ0FBQyxHQUFRLEVBQUE7UUFDekIsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBUyxLQUFLLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDMUU7QUFFTSxJQUFBLFlBQVksQ0FBQyxJQUFTLEVBQUE7UUFDM0IsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBUyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDNUU7QUFDTSxJQUFBLFFBQVEsQ0FBQyxJQUFTLEVBQUE7QUFDdkIsUUFBQSxJQUFJLENBQUMsSUFBSTtBQUFFLFlBQUEsT0FBTyxJQUFJLENBQUM7QUFDdkIsUUFBQSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQTtBQUN2QixRQUFBLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixTQUFBO0FBQU0sYUFBQTtBQUNMLFlBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbkIsU0FBQTtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssWUFBWSxDQUFDLFFBQVEsRUFBRTtZQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3BDLFNBQUE7QUFDRCxRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2xCLFlBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFF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
