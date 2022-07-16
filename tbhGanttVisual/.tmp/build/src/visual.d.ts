import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private host;
    private body;
    private divHeader;
    private divContent;
    private statusAndContent;
    private divTimelineAndActivitiesH;
    private divStatusLine;
    private divActivities;
    private divChartContainer;
    private divStructureLayer;
    private divSvgLayer;
    private divTimeline;
    private divChart;
    private activityTable;
    private timelineTable;
    private ganttGridTable;
    private style;
    private timeline;
    private verbose;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private populateActivityTable;
    /**
     * Returns the configuration of the desired graph to determine which elements to render based on the data in dataView.
     * @param dataView The DataView object to configure the visual against.
     */
    private checkConfiguration;
}
