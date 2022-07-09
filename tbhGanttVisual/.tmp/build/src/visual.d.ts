import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import './../src/lib';
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
    private divOverlay;
    private activityTable;
    private timelineTable;
    private ganttGridTable;
    private svg;
    private container;
    private circle;
    private textValue;
    private textLabel;
    private rows;
    private cols;
    private style;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private populateActivityTable;
    /**
     * Returns the number representation of a CSS measurement with pixel units.
     * @param numberPx the string containing the number of pixels to extract eg. '40.2px'
     * @returns the number of pixels specified
     */
    private toPxNumber;
    /**
 * Converts a number into a string with the units 'px' suffixed on it.
 * @param pixels the number of pixels
 * @returns the string representation of the number with 'px' suffixed
 */
    private px;
}
