/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ''Software''), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

//Feature TODO list:

// sortable dataview + ids
// Legend
// 
// statusdate is today if none provided?
//
//tell the user if key fields are not valid
//
//dont draw the first year or month separator line if it is up against the table-chart separator
//
//lock scrolling to discrete steps (row height)
//
//dont draw the year if the start date is around december
//
//if the timeilne is to be shorter than the div width, scale it so it fits the whole div width
//
//
//
//
//
//
//
//
//
//
//

'use strict';

////////////////////////////////////////////////////////////////
//  Imports
////////////////////////////////////////////////////////////////

import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;

//import { VisualSettings } from './settings';

import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from 'd3';
import { DSVRowAny, schemeSet3, style, text } from 'd3';
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import * as Lib from './../src/lib';
import * as Time from './../src/time';
import { Timeline, TimeScale } from './../src/timeline';
import { Activity } from './../src/activity';
import { Configuration, ValueFields } from './../src/configuration';

import * as dayjs from 'dayjs';

//UNIT TESTS
import * as jsUnit from './../tests/globalTests';

////////////////////////////////////////////////////////////////
//  Begin class definition
////////////////////////////////////////////////////////////////

export class Visual implements IVisual {

    ////////////////////////////////////////////////////////////////
    //  Define members
    ////////////////////////////////////////////////////////////////

    // private target: HTMLElement;
    // private updateCount: number;
    // private settings: VisualSettings;
    // private textNode: Text;

    private host: IVisualHost;
    private body: Selection<any>;

    //divs
    private divHeader: Selection<HTMLDivElement>;
    private divContent: Selection<HTMLDivElement>;
    private content: Selection<HTMLDivElement>;
    private divActivities: Selection<HTMLDivElement>;
    private divActivityHeader: Selection<HTMLDivElement>;
    private divActivityBody: Selection<HTMLDivElement>;
    private divChartHeader: Selection<HTMLDivElement>;
    private divChartBody: Selection<HTMLDivElement>;
    private divChartContainer: Selection<HTMLDivElement>;

    //tables

    private activityTable: Selection<any>;

    //svgs

    private timelineSVG: Selection<SVGSVGElement>;
    private ganttSVG: Selection<SVGSVGElement>;
    //text

    private bars: Selection<SVGSVGElement>;

    ////////////////DEV VARS\\\\\\\\\\\\\\\\
    private verbose: boolean = false; //verbose logging

    private style: CSSStyleDeclaration;//should be a CSSStyleDeclaration

    private timeline: Timeline;
    private configuration: Configuration;

    private start: dayjs.Dayjs;
    private end: dayjs.Dayjs;
    private status: dayjs.Dayjs;

    private tlWidth: number;
    private tlHeight: number;
    private rowHeight: number;
    private chartHeight: number;

    private gMonths: Selection<SVGGElement>;
    private gYears: Selection<SVGGElement>;

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(options: VisualConstructorOptions) {
        if (this.verbose) { console.log('LOG: Constructing Visual Object', options); }

        //jsUnit.allTests();

        this.style = getComputedStyle(document.querySelector(':root'));
        this.setDefaultTimelineParams();
        this.generateBody(options);
        this.configuration = new Configuration();

        //     this.target = options.element;
        //     this.updateCount = 0;
        //     if (document) {
        //         const new_p: HTMLElement = document.createElement('p');
        //         new_p.appendChild(document.createTextNode('Update count:'));
        //         const new_em: HTMLElement = document.createElement('em');
        //         this.textNode = document.createTextNode(this.updateCount.toString());
        //         new_em.appendChild(this.textNode);
        //         new_p.appendChild(new_em);
        //         this.target.appendChild(new_p);
        //      }
    }

    /**
     * Sets the member variables start, end, and status to the beginning of this year, the end of this year, and now, respectively.
     */
    private setDefaultTimelineParams() {
        let now: dayjs.Dayjs = dayjs(new Date());
        this.start = now.startOf('year');
        this.end = now.endOf('year');
        this.status = now;
    }

    private generateBody(options: VisualConstructorOptions) {

        ////////////////////////////////////////////////////////////////
        //  Create body level child elements
        ////////////////////////////////////////////////////////////////
        // help from lines 377 onwards at https://github.com/microsoft/powerbi-visuals-gantt/blob/master/src/gantt.ts

        //the header including title, logos etc
        this.divHeader = d3.select(options.element)
            .append('div')
            .attr('id', 'div-header')
            .append('h4')
            .text('TBH Gantt Chart Visual v0.1 (in development)');

        //structure of the content below the header
        this.content = d3.select(options.element)
            .append('div')
            .attr('id', 'div-content');

        ////////////////////////////////////////////////////////////////
        //  Create elements under the header
        ////////////////////////////////////////////////////////////////

        // //div to contain the act table and chart
        // this.divContent = this.statusAndContent
        //     .append('div')
        //     .attr('id', 'div-content');

        ////////////////////////////////////////////////////////////////
        //  Create content elements (must set timeline width using selection.style())...
        ////////////////////////////////////////////////////////////////

        var _this = this;

        //div to hold the activity data in a table
        this.divActivities = this.content
            .append('div')
            .attr('id', 'div-activities');

        this.divActivityHeader = this.divActivities
            .append('div')
            .classed('div-content-header', true);

        this.divActivityBody = this.divActivities
            .append('div')
            .classed('div-content-body', true)
            .attr('id', 'div-activityTable')
            .on('scroll', function () { _this.syncScroll('div-activityTable'); });
        // .on('scroll', function () { _this.syncScrollTimelineTop('div-activityTable', false) })
        // .on('wheel', function () { _this.syncScrollTimelineTop('div-activityTable', true) });

        //div to hold the chart elements including background, bars, text, controls
        this.divChartContainer = this.content
            .append('div')
            .attr('id', 'div-chart');

        this.divChartHeader = this.divChartContainer
            .append('div')
            .attr('id', 'div-timeline')
            .classed('div-content-header', true)
            .on('scroll', function () { _this.syncScroll('div-content-header'); });
        // .on('scroll', function () { _this.syncScrollTimelineLeft('div-timeline', false) })
        // .on('wheel', function () { _this.syncScrollTimelineLeft('div-timeline', true) });

        this.divChartBody = this.divChartContainer
            .append('div')
            .classed('div-content-body', true)
            .attr('id', 'div-ganttChart')
            .on('scroll', function () { _this.syncScroll('div-ganttChart'); });
        // .on('scroll', function () { _this.syncScrollTimelineTop('div-ganttChart', false); })
        // .on('wheel', function () { _this.syncScrollTimelineTop('div-ganttChart', true); })
        // .on('scroll', function () { _this.syncScrollTimelineLeft('div-ganttChart', false); })
        // .on('wheel', function () { _this.syncScrollTimelineLeft('div-ganttChart', true); });

        ////////////////////////////////////////////////////////////////
        //  Create svg timeline
        ////////////////////////////////////////////////////////////////

        this.timeline = new Timeline(this.start, this.end, this.status);

        this.tlWidth = Math.ceil(this.timeline.getDays() * this.timeline.getDayScale());//cannot be less than div width!
        this.tlHeight = Lib.pxToNumber(this.style.getPropertyValue('--timelineHeight'));
        this.rowHeight = Lib.pxToNumber(this.style.getPropertyValue('--rowHeight'));

        this.timelineSVG = this.divChartHeader
            .append('svg')
            .attr('height', Lib.px(this.tlHeight))
            .attr('width', Lib.px(this.tlWidth))
            .attr('id', 'svg-tl');

        this.gMonths = this.timelineSVG.append('g')
            .classed('g-tl', true);

        this.gYears = this.timelineSVG.append('g')
            .classed('g-tl', true);


        this.bars = this.divChartBody
            .append('g')
            .append('svg')
            .attr('id', 'svg-bars');

        ////////////////////////////////////////////////////////////////
        //  Create activities table
        ////////////////////////////////////////////////////////////////

        this.divActivityHeader
            .append('table')
            .attr('id', 'table-activityHeader')
            .append('tr')
            .attr('class', 'highlight');

        this.divActivityBody
            .append('table')
            .attr('id', 'table-activities');
    }


    ////////////////////////////////////////////////////////////////
    //  UPDATE VISUAL ON REFRESH
    ////////////////////////////////////////////////////////////////

    public update(options: VisualUpdateOptions) {

        //this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        if (this.verbose) { console.log('Visual update()', options); }

        let dataView: DataView = options.dataViews[0];

        //manually destroy unjoin()ed items (i know its not the best way to do it ...)
        if (document.getElementById('statusLine-tl') != null) { document.getElementById('statusLine-tl').remove(); }
        if (document.getElementById('statusLine-chart') != null) { document.getElementById('statusLine-chart').remove(); }

        //generatetimeline with default dates
        this.status = dayjs(new Date(2019, 6, 19));
        let acts: Activity[] = this.checkConfiguration(dataView);
        let ts: TimeScale = this.drawTimeline();

        this.configuration.logConfig();
        if (this.configuration.field(ValueFields.START) && this.configuration.field(ValueFields.END)) {
            this.drawChart(acts, ts, this.timelineSVG);
            console.log('not null');
        } else {
            console.log('nuill');
            this.divChartBody.html(null);
        }
        this.drawTable(acts);

        // let ops : EnumerateVisualObjectInstancesOptions = new EnumerateVisualObjectInstancesOptions('subTotals')
        // let o: VisualObjectInstanceEnumeration = this.enumerateObjectInstances(EnumerateVisualObjectInstancesOptions);

    }

    /**
     * Returns the configuration of the desired graph to determine which elements to render based on the data in dataView.
     * @param dataView The DataView object to configure the visual against.
     */
    private checkConfiguration(dataView: DataView): Activity[] {

        console.log('LOG: Checking Configuration');

        if (this.verbose) {
            console.log('LOG: DATAVIEW CONFIGURATION');
            console.log('LOG: number of heirachy levels: ' + dataView.matrix.rows.levels.length);
        }

        this.configuration.checkRoles(dataView.matrix.valueSources);
        //this.configuration.logConfig();

        //check verbose
        console.log('dataView.matrix.rows.root', dataView.matrix.rows.root);

        let acts: Activity[] = [];
        this.dfsPreorder(acts, dataView.matrix.rows.root.children[0]);

        acts = this.trimHeirarchy(acts);

        if (this.configuration.field(ValueFields.START) && this.configuration.field(ValueFields.END)) {
            let dt: dayjs.Dayjs[] = this.summariseDates(acts);
            this.start = dt[0];
            this.end = dt[1];
        } else {
            this.setDefaultTimelineParams();
        }

        console.log('Activity array', acts);
        console.log('LOG: DONE Checking Configuration');
        return acts;
    }

    /**
     * Summarises the higher level matrix elements by taking its childrens' minimum start dates and maximum end dates.
     * @param acts the the DFS-derived Activity array to summarise
     * @returns the earliest start date and the latest finish date of the schedule
     */
    private summariseDates(acts: Activity[]): dayjs.Dayjs[] {

        let aggregateBuffer: dayjs.Dayjs[][] = [];
        let currentLevel: number = acts[acts.length - 1].getLevel();
        let globalStart: dayjs.Dayjs[] = [];
        let globalEnd: dayjs.Dayjs[] = [];

        aggregateBuffer = [[], [], [], [], []];

        for (let i = 0; i < acts.length; i++) {
            let l: number = acts[acts.length - i - 1].getLevel();

            if (l < currentLevel) {// going up indents, summarise, add self to higher buffer
                acts[acts.length - i - 1].setStart(Time.minDayjs(aggregateBuffer[l+1]));
                console.log(l,aggregateBuffer[l+1]);
                console.log(l,'Summarise Start', Time.minDayjs(aggregateBuffer[l+1]).format('DD/MM/YY'));
                aggregateBuffer[l].push(acts[acts.length - i - 1].getStart());
                currentLevel = l;
            } else if (l > currentLevel) {//going down indents, clear buffer, add self
                currentLevel = l;
                aggregateBuffer[l] = [(acts[acts.length - i - 1].getStart())];
            } else {//same indent, add to buffer
                aggregateBuffer[l].push(acts[acts.length - i - 1].getStart());
            }
            if (l == 0) {
                

                globalStart.push(acts[acts.length - i - 1].getStart());
            }
            console.log(aggregateBuffer[l]);

            //console.log(acts[acts.length - i - 1].getLevel(), acts[acts.length - i - 1].getName(), acts.length - i - 1, aggregateBuffer);
        }

        aggregateBuffer = [[], [], [], [], []];
        for (let i = 0; i < acts.length; i++) {
            let l: number = acts[acts.length - i - 1].getLevel();

            if (l < currentLevel) {// going up indents, summarise, add self to higher buffer
                acts[acts.length - i - 1].setEnd(Time.maxDayjs(aggregateBuffer[l+1]));
                console.log(l,'Summarise End', Time.maxDayjs(aggregateBuffer[l+1]).format('DD/MM/YY'));
                aggregateBuffer[l].push(acts[acts.length - i - 1].getEnd());
                currentLevel = l;
            } else if (l > currentLevel) {//going down indents, clear buffer, add self
                currentLevel = l;
                aggregateBuffer[l] = [(acts[acts.length - i - 1].getEnd())];
            } else {//same indent, add to buffer
                aggregateBuffer[l].push(acts[acts.length - i - 1].getEnd());
            }

            if (l == 0) {
             
                globalEnd.push(acts[acts.length - i - 1].getEnd());
            }

   console.log(aggregateBuffer[l]);
           //console.log(acts[acts.length - i - 1].getLevel(), acts[acts.length - i - 1].getName(), acts.length - i - 1, aggregateBuffer);
        }

        console.log(globalStart);
        console.log(globalEnd);


        return [Time.minDayjs(globalStart), Time.minDayjs(globalEnd)];
    }

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
    private reduceHeirarchy(acts: Activity[]): Activity[] {
        console.log("LOG: Reducing heiracrchy");
        let a: Activity[] = [];
        let l: number;
        let target: number;

        for (let i = 0; i < acts.length; i++) {
            l = acts[i].getLevel();

            // console.log('LOG: i=' + i + ', level = ' + l +
            //     ', target = ' + target +
            //     ', name? = ' + (acts[i].getName() != '') +
            //     ', target? = ' + (target != null) +
            //     ', name = ' + acts[i].getName());

            //no target, no name
            if ((target == null) && (acts[i].getName() == '')) {
                target = acts[i].getLevel();
            }

            //has target, has name
            if ((target != null) && (acts[i].getName() != '')) {
                acts[i].setLevel(target);
                target = null;
            }

            if (acts[i].getName() != '') {
                a.push(acts[i]);
            }
        }

        return a;
    }

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
    private trimHeirarchy(acts: Activity[]): Activity[] {
        console.log("LOG: Trimming heiracrchy");
        let a: Activity[] = [];
        let onInvalidBranch: boolean = false;
        let target: number;

        for (let i = 0; i < acts.length; i++) {
            // console.log('LOG: i=' + i + ', level = ' + acts[i].getLevel() +
            //     ', target = ' + onInvalidBranch +
            //     ', name? = ' + (acts[i].getName() != '') +
            //     ', onInvalidBranch? = ' + onInvalidBranch +
            //     ', name = ' + acts[i].getName());

            //we have reached another node of the same level as the faulty node
            if (onInvalidBranch && (acts[i].getLevel() <= target)) { onInvalidBranch = false; }

            if (acts[i].getName() == '') { //we have an invalid node. trim the branch by ignoring everything until we reach a node of the same level
                onInvalidBranch = true;
                target = acts[i].getLevel();
            }

            if (!onInvalidBranch) {
                a.push(acts[i]);
            }
        }

        return a;
    }


    /**
     * Performs a Pre-order Depth-First Search of the DataViewMatrixNode tree structure assuming a general tree structure.
     * The nodes are arranged into a linear array based on the DFS traversal algorithm, mimicking the view observed in a Gantt chart
     * and in other Scheduling software.
     * @param activities The Activity array to output the list of nodes in
     * @param node the DataViewMatrixNode to consider as the root node of the tree
     */
    private dfsPreorder(activities: Activity[], node: powerbi.DataViewMatrixNode) {

        if (node.children == null) {
            // console.log("LOG: RECURSION: level = " + node.level + ', name = ' + this.nodeName(node) + ', start = ' + node.values[0].value);
            if ((node.values[0] != null) && (node.values[1] != null)) {//every task must have a start and finish, unless the config contradicts
                activities.push(new Activity(
                    this.nodeName(node),
                    this.configuration.startFilter(dayjs(node.values[0].value as Date)),
                    this.configuration.endFilter(dayjs(node.values[1].value as Date)),
                    node.level));
            }
        } else {
            // console.log("LOG: RECURSION: level = " + node.level);
            // console.log("LOG:" + this.nodeName(node));
            // console.log("LOG:" + node.level);
            activities.push(new Activity(
                this.nodeName(node),
                null,
                null,
                node.level));//need to check type?
            for (let i = 0; i < node.children.length; i++) {
                this.dfsPreorder(activities, node.children[i]);
            }
        }
    }

    /**
     * Returns the node's name if it is not null, and returns an empty string otherwise.
     * @param node the node to extract the name from
     * @returns an empty string if the node's value member is null, and the string representation of node.value if it is not null.
     */
    private nodeName(node: powerbi.DataViewMatrixNode): string {
        if (node.value == null) {
            return '';
        } else {
            return node.value.toString();
        }
    }

    private drawTimeline(): TimeScale {
        console.log('LOG: Drawing Timeline from ' + this.start.format('DD/MM/YY') + ' to ' + this.end.format('DD/MM/YY'));

        this.timeline.defineTimeline(this.start, this.end, this.status);

        //todo reduce duplicate code vvv
        this.tlWidth = Math.ceil(this.timeline.getDays() * this.timeline.getDayScale());//cannot be less than div width!

        let ts: TimeScale = this.timeline.getTimeScale();

        this.timelineSVG
            .attr('height', Lib.px(this.tlHeight))
            .attr('width', Lib.px(this.tlWidth));

        //////////////////////////////////////////////////////////////// YearText
        this.gYears.selectAll('text')
            .data(ts.yearScale)
            .join('text')
            .attr('x', function (d) {
                return Lib.px(d.offset + d.textAnchorOffset);
            })
            .attr('y', '0px')
            .text(function (d) { return d.text; })
            .attr('text-anchor', 'top')
            .attr('alignment-baseline', 'hanging')
            .classed('yearText', true);

        //////////////////////////////////////////////////////////////// YearLine
        this.gYears.selectAll('line')
            .data(ts.yearScale)
            .join('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', '0px')
            .attr('x2', function (d) { return Lib.px(d.offset); })
            .attr('y2', this.tlHeight)
            .attr('stroke-width', '2px')
            .attr('style', 'stroke:black');

        //////////////////////////////////////////////////////////////// MonthText
        this.gMonths.selectAll('text')
            .data(ts.monthScale)
            .join('text')
            .attr('x', function (d) { return Lib.px(d.offset + d.textAnchorOffset); })
            .attr('y', Lib.px(this.tlHeight / 2))
            .text(function (d) { return d.text; })
            .attr('text-anchor', 'top')
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'middle')
            .classed('monthText', true);

        //////////////////////////////////////////////////////////////// YMonthLine
        this.gMonths.selectAll('line')
            .data(ts.monthScale)
            .join('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(this.tlHeight / 2))
            .attr('x2', function (d) { return Lib.px(d.offset); })
            .attr('y2', this.tlHeight)
            .attr('style', 'stroke:red');


        console.log('LOG: DONE Drawing Timeline');
        return ts;
    }

    private drawChart(acts: Activity[], ts: TimeScale, gantt: Selection<SVGSVGElement>) {

        console.log('LOG: Drawing Chart');

        ////////////////////////////////////////////////////////////////
        //  Create #table-activities
        ////////////////////////////////////////////////////////////////

        // https://stackoverflow.com/questions/43356213/understanding-enter-and-exit
        // https://www.tutorialsteacher.com/d3js/function-of-data-in-d3js
        // https://stackoverflow.com/questions/21485981/appending-multiple-non-nested-elements-for-each-data-member-with-d3-js/33809812#33809812
        // https://stackoverflow.com/questions/37583275/how-to-append-multiple-child-elements-to-a-div-in-d3-js?noredirect=1&lq=1
        // https://stackoverflow.com/questions/21485981/appending-multiple-non-nested-elements-for-each-data-member-with-d3-js

        var _this = this; //get a reference to self so that d3's anonymous callbacks can access member functions

        ////////////////////////////////////////////////////////////////
        //  Prepare for chart drawing
        ////////////////////////////////////////////////////////////////

        this.bars
            .attr('width', Lib.px(this.tlWidth))
            .attr('height', Lib.px(this.rowHeight * acts.length));

        this.bars.selectAll('rect')
            .data(acts)
            .join('rect')
            .attr('x', function (d) {
                return Lib.px(_this.timeline.dateLocation(d.getStart()));
            })
            .attr('height', Lib.px(this.rowHeight - 4))
            .attr('width', function (d) {
                return Lib.px(_this.timeline.dateLocation(d.getEnd()) - _this.timeline.dateLocation(d.getStart()));
            })
            .attr('y', function (d, i) { return Lib.px((_this.rowHeight * i) + 2) })
            .attr('rx', '3px')
            .attr('ry', '3px')
            .classed('activityBar', true)
            .attr('fill', function (d) {
                switch (d.getLevel()) {
                    case 0:
                        return 'red';
                    case 1:
                        return 'green';
                    case 2:
                        return 'blue';
                    case 3:
                        return 'yellow';
                    default:
                        return 'gray';
                }
            });

        ////////////////////////////////////////////////////////////////
        //  Draw chart
        ////////////////////////////////////////////////////////////////

        this.chartHeight = this.bars.node().getBoundingClientRect().height + this.tlHeight;

        //also put this in a fn later for update()
        // getBBox() help here:
        // https://stackoverflow.com/questions/45792692/property-getbbox-does-not-exist-on-type-svgelement
        // https://stackoverflow.com/questions/24534988/d3-get-the-bounding-box-of-a-selected-element
        // this.divChartBody.append('g')
        //     .attr('id', 'statusLine').attr('width', '100%').attr('height', '100%')
        //     .append('line')
        //     .attr('x1', '0px')
        //     .attr('y1', '0px')
        //     .attr('x2', '0px')
        //     .attr('y2', Lib.px(this.chartHeight))
        //     .attr('transform', 'translate(' + this.timeline.statusDateLocation() + ')');

        //////////////////////////////////////////////////////////////// Grid

        this.gMonths.selectAll('.grid-months')
            .data(ts.monthScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(this.tlHeight))
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', Lib.px(this.chartHeight))
            .attr('style', 'stroke:green');

        this.gYears.selectAll('.grid-years')
            .data(ts.yearScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(this.tlHeight))
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', Lib.px(this.chartHeight))
            .attr('style', 'stroke:gray');

        //////////////////////////////////////////////////////////////// Status

        // this.status = dayjs(new Date(2019, 3, 15));
        this.status = dayjs(new Date(2020, 10, 15));
        this.timeline.setStatus(this.status);

        //the status lines are destroyed and recreated every update(). I could'nt find a way to use .join or .update
        this.timelineSVG
            .append('line')
            .attr('x1', '0px')
            .attr('x2', '0px')
            .attr('y1', '0px')
            .attr('y2', Lib.px(this.tlHeight))
            .attr('id', 'statusLine-tl')
            .attr('transform', this.timeline.statusDateTranslation())
            .attr('style', 'stroke: red');

        this.bars
            .append('line')
            .attr('x1', '0px')
            .attr('x2', '0px')
            .attr('y1', '0px')
            .attr('y2', Lib.px(this.chartHeight))
            .attr('id', 'statusLine-chart')
            .attr('transform', this.timeline.statusDateTranslation())
            .attr('style', 'stroke: red');

        console.log('LOG: DONE Drawing Chart');
    }

    private drawTable(acts: Activity[]) {
        console.log('LOG: Drawing Table');
        if (this.verbose) { console.log('LOG: populateActivityTable called with some number of rows.'); }

        var s = ['1', '2', '3', '4'];
        this.divActivityHeader.select('tr').selectAll('th').data(s).join('th').text(d => d);

        //create the number of trs required.
        this.divActivityBody
            .select('table')
            .selectAll('tr')
            .data(acts)
            .join('tr')
            .classed('tr-activity', true);

        var td = this.divActivityBody.selectAll('.tr-activity')
            .selectAll('.td-name')//select all tds, there are 0
            .data(function (d: Activity) { return [d.getTableText()[0]]; })//THIS DATA COMES FROM THE TR's _data_ PROPERTY
            .join('td')
            .classed('td-name', true)
            .text(function (d) { return d; });

        //this is a workaround since I couldnt get d3.data(acts).classed(function (d) { return d.getLevel().toString();}) working due to an error
        // (d: any) => string is not compatible with type string...
        // search for @indentTypeMismatch in activity.ts
        d3.selectAll('.td-name').data(acts).attr('class', function (d) { return d.getLevelString(); })
        td.classed('td-name', true);


        // tr.selectAll('.td-start')//select all tds, there are 0
        //     .data(function (d) { return d.getTableText()[1]; })//THIS DATA COMES FROM THE TR's _data_ PROPERTY
        //     .enter()
        //     .append('td')
        //     .classed('td-start');

        // tr.selectAll('.td-end')//select all tds, there are 0
        //     .data(function (d) { return d.getTableText()[2]; })//THIS DATA COMES FROM THE TR's _data_ PROPERTY
        //     .enter()
        //     .append('td')
        //     .classed('td-end');

        //.text(function (d) { return d.getTableText(); });//we are taking d from the bound data from the trs
        // .attr('class','style'+d.wbsIndex);


        console.log('LOG: DONE Drawing Table');
    }



    //https://www.tutorialsteacher.com/d3js/data-binding-in-d3js
    //https://www.dashingd3js.com/d3-tutorial/use-d3-js-to-bind-data-to-dom-elements
    //BEWARE: I had to change the types of all these following to var and not Selection<T,T,T,T>. the second function (d)
    //call returned a type that wasnt compatible with Selction<T,T,T,T> and I couldn't figure out which type to use.

    /**
     * Synchronises the left scrolling of the div-timeline and div-ganttChart depending on which one was scrolled.
     * 
     * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-ganttChart, 
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     * @param div the div that was scrolled by the user.
     */
    private syncScrollTimelineLeft(scrollID: string, wheel: boolean) {
        //links i used to understand ts callbacks, d3 event handling
        //https://hstefanski.wordpress.com/2015/10/25/responding-to-d3-events-in-typescript/
        //https://rollbar.com/blog/javascript-typeerror-cannot-read-property-of-undefined/
        //https://www.d3indepth.com/selections/
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event
        //https://github.com/d3/d3-selection/blob/main/README.md#handling-events
        //https://www.tutorialsteacher.com/d3js/event-handling-in-d3js

        if (this.verbose) { console.log('Synchronising scroll...'); }

        let chartID: string = 'div-ganttChart';
        let timelineID: string = 'div-timeline';

        switch (scrollID) {
            case chartID:
                document.getElementById(timelineID).scrollLeft = document.getElementById(chartID).scrollLeft;
                if (this.verbose) { console.log('LOG: Sync timeline scroll to chart scroll'); };

            case timelineID:
                document.getElementById(chartID).scrollLeft = document.getElementById(timelineID).scrollLeft;
                if (this.verbose) { console.log('LOG: Sync chart scroll to timeline scroll'); };
        }
    }

    /**
    * Synchronises the top scrolling of the div-activityTable and div-ganttChart depending on which one was scrolled.
    * 
    * KNOWN BUG: since the event listener that fires this callback is on both div-activityTable and div-ganttChart, 
    * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
    * 
    * KNOWN BUG: scrolling near scrollTop = 0 and scrollTop = max slows down the scroll per mousewheel tick.
    * Possibly due to the above bug. I could use the d3.event method to use scroll events and their dy direction but its not working.
    * @param div the div that was scrolled by the user.
    */
    private syncScrollTimelineTop(scrollID: string, wheel: boolean) {
        //links i used to understand ts callbacks, d3 event handling
        //https://hstefanski.wordpress.com/2015/10/25/responding-to-d3-events-in-typescript/
        //https://rollbar.com/blog/javascript-typeerror-cannot-read-property-of-undefined/
        //https://www.d3indepth.com/selections/
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event
        //https://github.com/d3/d3-selection/blob/main/README.md#handling-events
        //https://www.tutorialsteacher.com/d3js/event-handling-in-d3js

        if (this.verbose) { console.log('Synchronising scroll...'); }

        let chartID: string = 'div-ganttChart';
        let activityTableID: string = 'div-activityTable';

        switch (scrollID) {
            case chartID:
                document.getElementById(activityTableID).scrollTop = document.getElementById(chartID).scrollTop;
                if (this.verbose) { console.log('LOG: Sync timeline scroll to chart scroll = ', document.getElementById(activityTableID).scrollTop); };

            case activityTableID:
                document.getElementById(chartID).scrollTop = document.getElementById(activityTableID).scrollTop;
                if (this.verbose) { console.log('LOG: Sync chart scroll to avtivityTable scroll = ', document.getElementById(chartID).scrollTop); };
        }
    }

    private syncScroll(controllerID: string) {
        let verticals: string[] = ['div-ganttChart', 'div-activityTable'];
        let horizontals: string[] = ['div-ganttChart', 'div-timeline'];

        switch (controllerID) {
            case verticals[0]:
                document.getElementById(verticals[1]).scrollTop = document.getElementById(controllerID).scrollTop;
                document.getElementById(horizontals[1]).scrollLeft = document.getElementById(controllerID).scrollLeft;
                if (this.verbose) { 'Set ' + verticals[1] + ' & ' + horizontals[1] + ' to ' + controllerID + '\'s position.' };
                break;
            case verticals[1]://require activity table scrolling using wheel and not track
                document.getElementById(verticals[0]).scrollTop = document.getElementById(controllerID).scrollTop;
                if (this.verbose) { 'Set ' + verticals[0] + ' to ' + controllerID + '\'s top position.' };
                break;
            // case horizontals[0]: //horizontals[0] === verticals[0]
            //     break;
            // case horizontals[1]: //disable timeline scrolling
            //     break;
            default:
                if (this.verbose) {
                    console.log('Invalid scroll div');
                }
        }
    }

    // public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
    //     let objectName: string = options.objectName;
    //     let objectEnumeration: VisualObjectInstance[] = [];

    //     switch (objectName) {
    //         case 'myCustomObject':
    //             objectEnumeration.push({
    //                 objectName: objectName,
    //                 properties: { ... },
    //                 selector: { ... }
    //             });
    //             break;
    //     };

    //     return objectEnumeration;
    // }


    ////////////////////////////////////////////////////////////////
    //  END OF CLASS
    ////////////////////////////////////////////////////////////////
}