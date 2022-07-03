import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var tbhGanttVisual02814EA99E75457B80AA513BCFD5A299_DEBUG: IVisualPlugin = {
    name: 'tbhGanttVisual02814EA99E75457B80AA513BCFD5A299_DEBUG',
    displayName: 'Gantt Chart Visual by TBH',
    class: 'Visual',
    apiVersion: '3.8.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["tbhGanttVisual02814EA99E75457B80AA513BCFD5A299_DEBUG"] = tbhGanttVisual02814EA99E75457B80AA513BCFD5A299_DEBUG;
}
export default tbhGanttVisual02814EA99E75457B80AA513BCFD5A299_DEBUG;