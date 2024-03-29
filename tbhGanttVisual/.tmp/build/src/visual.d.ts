import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
export declare class Visual implements IVisual {
    private host;
    private body;
    private divHeader;
    private divContent;
    private content;
    private divActivities;
    private divActivityHeader;
    private divActivityBody;
    private divChartHeader;
    private divChartBody;
    private divChartContainer;
    private activityTable;
    private timelineSVG;
    private ganttSVG;
    private bars;
    private verbose;
    private style;
    private timeline;
    private configuration;
    private start;
    private end;
    private status;
    private tlWidth;
    private tlHeight;
    private rowHeight;
    private barHeight;
    private barPadding;
    private baselineHeightProportion;
    private chartHeight;
    private gMonths;
    private gYears;
    private maxDepth;
    private settings;
    constructor(options: VisualConstructorOptions);
    /**
     * Sets the member variables start, end, and status to the beginning of this year, the end of this year, and now, respectively.
     */
    private setDefaultTimelineParams;
    private generateBody;
    update(options: VisualUpdateOptions): void;
    /**
     * Returns the configuration of the desired graph to determine which elements to render based on the data in dataView.
     * @param dataView The DataView object to configure the visual against.
     */
    private checkConfiguration;
    /**
     * Summarises the higher level matrix elements by taking its childrens' minimum start dates and maximum end dates.
     * This overrides the provided measure, however why would a user not use min(start) and max(finish)?
     * TODO: abstract this to take any number of custom fields.
     *
     * @param acts the the DFS-derived Activity array to summarise
     * @returns the earliest start date and the latest finish date of the schedule
     */
    private summariseDates;
    /**
     * Returns an array of empty arrays. The number of empty arrays is equal to the 1-indexed depth of the DataView tree.
     * @param dataView the examinable DataView
     * @returns a 2D array of size depth x 0
     */
    private resetAggregateBuffer;
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
     * Performs a Pre-order Depth-First Search of the DataViewMatrixNode tree structure assuming a general tree structure.
     * The nodes are arranged into a linear array based on the DFS traversal algorithm, mimicking the view observed in a Gantt chart
     * and in other Scheduling software.
     * @param activities The Activity array to output the list of nodes in
     * @param node the DataViewMatrixNode to consider as the root node of the tree
     */
    private dfsPreorder;
    /**
     * Updates the variable this.maxDepth to the specified number.
     * @param d the new depth
     */
    private updateMaxDepth;
    /**
     * Returns the node's name if it is not null, and returns an empty string otherwise.
     * @param node the node to extract the name from
     * @returns an empty string if the node's value member is null, and the string representation of node.value if it is not null.
     */
    private nodeName;
    private drawTimeline;
    private drawChart;
    private drawTable;
    /**
     * Synchronises the left scrolling of the div-timeline and div-ganttChart depending on which one was scrolled.
     *
     *  KNOWN BUG: since the event listener that fires this callback is on both div-activityTable and div-ganttChart,
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     *
     * KNOWN BUG: scrolling near scrollTop = 0 and scrollTop = max slows down the scroll per mousewheel tick.
     * Possibly due to the above bug. I could use the d3.event method to use scroll events and their dy direction but its not working.
     *
     * KNOWN BUG: Mousewheel scrolling increments are reduced when near the limits of the track.
     *
     * INCOMPLETE JSDOC
     */
    private syncScrollTimelineLeft;
    /**
    * Synchronises the top scrolling of the div-activityTable and div-ganttChart depending on which one was scrolled.
    *
    *  KNOWN BUG: since the event listener that fires this callback is on both div-activityTable and div-ganttChart,
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     *
     * KNOWN BUG: scrolling near scrollTop = 0 and scrollTop = max slows down the scroll per mousewheel tick.
     * Possibly due to the above bug. I could use the d3.event method to use scroll events and their dy direction but its not working.
     *
     * KNOWN BUG: Mousewheel scrolling increments are reduced when near the limits of the track.
     *
     * INCOMPLETE JSDOC
    */
    private syncScrollTimelineTop;
    /**
     * Syncronises top and left scrolling of various divs.
     *
     *  KNOWN BUG: since the event listener that fires this callback is on both div-activityTable and div-ganttChart,
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     *
     * KNOWN BUG: scrolling near scrollTop = 0 and scrollTop = max slows down the scroll per mousewheel tick.
     * Possibly due to the above bug. I could use the d3.event method to use scroll events and their dy direction but its not working.
     *
     * KNOWN BUG: Mousewheel scrolling increments are reduced when near the limits of the track.
     * @param controllerID the ID of the element that fired the event
     */
    private syncScroll;
    private static parseSettings;
    /**
    * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
    * objects and properties you want to expose to the users in the property pane.
    *
    */
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
}
