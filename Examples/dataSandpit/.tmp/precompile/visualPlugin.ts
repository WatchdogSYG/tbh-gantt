import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var dataSandpit3024BD6CA6CB40859F8562F7800C9D5C_DEBUG: IVisualPlugin = {
    name: 'dataSandpit3024BD6CA6CB40859F8562F7800C9D5C_DEBUG',
    displayName: 'DataSandpit',
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
    powerbi.visuals.plugins["dataSandpit3024BD6CA6CB40859F8562F7800C9D5C_DEBUG"] = dataSandpit3024BD6CA6CB40859F8562F7800C9D5C_DEBUG;
}
export default dataSandpit3024BD6CA6CB40859F8562F7800C9D5C_DEBUG;