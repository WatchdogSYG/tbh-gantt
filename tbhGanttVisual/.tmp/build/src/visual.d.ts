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
    private gantt;
    private style;
    private timeline;
    private verbose;
    private start;
    private end;
    private status;
    private tlWidth;
    private tlHeight;
    private rowHeight;
    private chartHeight;
    private gMonths;
    private gYears;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private generateBody;
    /**
     * Returns the configuration of the desired graph to determine which elements to render based on the data in dataView.
     * @param dataView The DataView object to configure the visual against.
     */
    private checkConfiguration;
    private summariseDates;
    /**
     * This function takes the Activity array derived from a Depth-First Search of the DataView matrix data structure (tree)
     * and moves deeper elements to the branch position of the first element on the branch with an empty name string.
     *
     * Use this function to reduce a tree when the leaf activity is always at a certain depth, regardless of what its true
     * WBS Outline Level is.
     *
     * @param acts the DFS-derived Activity array to reduce
     * @returns the reduced Activity array
     */
    private reduceHeirarchy;
    /**
     * This function takes the Activity array derived from a Depth-First Search of the DataView matrix data structure (tree)
     * and trims invalid branches. An invalid branch is defined as a branch of the tree with a relative root node that has an empty
     * name string.
     *
     * Use this function to rim branches off the tree and eliminate anything under a blank WBS heading, and eliminate empty activities.
     *
     * @param acts the DFS-derived Activity array to trim
     * @returns the reduced Activity array
     */
    private trimHeirarchy;
    /**
     *
     * @param activities
     * @param node
     */
    private dfsPreorder;
    private nodeName;
    private drawTimeline;
    private drawChart;
    private drawTable;
    /**
     * Synchronises the left scrolling of the div-timeline and div-chart depending on which one was scrolled.
     *
     * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-chart,
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     * @param div the div that was scrolled by the user.
     */
    private syncScrollTimelineLeft;
    /**
    * Synchronises the top scrolling of the div-timeline and div-chart depending on which one was scrolled.
    *
    * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-chart,
    * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
    * @param div the div that was scrolled by the user.
    */
    private syncScrollTimelineTop;
}
