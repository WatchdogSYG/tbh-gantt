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
    private divActivities;
    private divChartContainer;
    private activityTable;
    private timelineTable;
    private ganttGridTable;
    private style;
    private timeline;
    private verbose;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    /**
     * Returns the configuration of the desired graph to determine which elements to render based on the data in dataView.
     * @param dataView The DataView object to configure the visual against.
     */
    private checkConfiguration;
    /**
     *
     * @param activities
     * @param node
     */
    private dfsPreorder;
    /**
     * Synchronises the left scrolling of the div-timeline and div-chart depending on which one was scrolled.
     *
     * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-chart,
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     * @param div the div that was scrolled by the user.
     */
    private syncScrollTimeline;
}
