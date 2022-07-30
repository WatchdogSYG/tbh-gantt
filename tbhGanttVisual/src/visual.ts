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
//handle missing value fields by determining values index
//
//
//
//
//
// MVP COMPLETE FOR INNOVATION SUBMISSION
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

import { VisualSettings } from './settings';

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
import { Activity, ActivityStyle } from './../src/activity';
import { Configuration, ValueFields } from './../src/configuration';

import * as dayjs from 'dayjs';

//UNIT TESTS
import * as jsUnit from './../tests/globalTests';
import { validationHelper } from 'powerbi-visuals-utils-dataviewutils';
import { CLIENT_RENEG_WINDOW } from 'tls';

////////////////////////////////////////////////////////////////
//  Begin class definition
////////////////////////////////////////////////////////////////

export class Visual implements IVisual {

    //////////////////////////////////////////////////////////////// Define members

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

    private maxDepth: number;

    private settings: VisualSettings;

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(options: VisualConstructorOptions) {
        if (this.verbose) { console.log('LOG: Constructing Visual Object', options); }

        //jsUnit.allTests();

        this.maxDepth = 0;
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
        //////////////////////////////////////////////////////////////// Create body level child elements
        // help from lines 377 onwards at 
        //https://github.com/microsoft/powerbi-visuals-gantt/blob/master/src/gantt.ts

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

        //////////////////////////////////////////////////////////////// Create elements under the header

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

        //////////////////////////////////////////////////////////////// Create svg timeline

        this.timeline = new Timeline(this.start, this.end, this.status, this.divChartHeader.node().getBoundingClientRect().width);

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

        //////////////////////////////////////////////////////////////// Create activities table

        this.divActivityHeader
            .append('table')
            .attr('id', 'table-activityHeader')
            .append('tr');

        this.divActivityBody
            .append('table')
            .attr('id', 'table-activities');
    }

    ////////////////////////////////////////////////////////////////
    //  UPDATE VISUAL ON REFRESH
    ////////////////////////////////////////////////////////////////

    public update(options: VisualUpdateOptions) {
        //////////////////////////////////////////////////////////////// Setup Update loop
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);

        if (this.verbose) { console.log('Visual update()', options); }
        let dataView: DataView = options.dataViews[0];
        //manually destroy unjoin()ed items (i know its not the best way to do it ...)
        if (document.getElementById('statusLine-tl') != null) { document.getElementById('statusLine-tl').remove(); }
        if (document.getElementById('statusLine-chart') != null) { document.getElementById('statusLine-chart').remove(); }

        //////////////////////////////////////////////////////////////// Get a default timeline
        this.status = dayjs(new Date(2022, 6, 25));
        let acts: Activity[] = this.checkConfiguration(dataView);
        let ts: TimeScale = this.drawTimeline();

        //////////////////////////////////////////////////////////////// choose to draw the chart based on config
        this.configuration.logConfig();
        if (this.configuration.field(ValueFields.START) && this.configuration.field(ValueFields.END)) {
            this.drawChart(acts, ts, this.timelineSVG);
        } else {
            this.divChartBody.html(null);
        }

        //////////////////////////////////////////////////////////////// draw table
        this.drawTable(acts);

        //////////////////////////////////////////////////////////////// unused capabilities object enumeration
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
        // this.configuration.logConfig();

        //check verbose
        console.log('dataView.matrix.rows.root', dataView.matrix.rows.root);
        let acts: Activity[] = [];
        this.dfsPreorder(acts, dataView.matrix.rows.root.children[0]);

        //console.log('LOG: DFS: ',acts);
        
        acts = this.trimHeirarchy(acts);

        //console.log('LOG: Trimmed: ',acts);

        if (this.configuration.field(ValueFields.START) && this.configuration.field(ValueFields.END)) {
            let dt: dayjs.Dayjs[] = this.summariseDates(acts, dataView);
            this.start = dt[0];
            this.end = dt[1];
            this.status = dt[2];//WARNING: assuming all statuses are the same!!
        } else {
            this.setDefaultTimelineParams();
        }

        // if(this.configuration.field(ValueFields.STATUSDATE)){ this.status =  };

        //console.log('Activity array', acts);
        console.log('LOG: DONE Checking Configuration');
        return acts;
    }

    /**
     * Summarises the higher level matrix elements by taking its childrens' minimum start dates and maximum end dates.
     * TODO: abstract this to take any number of custom fields.
     * 
     * @param acts the the DFS-derived Activity array to summarise
     * @returns the earliest start date and the latest finish date of the schedule
     */
    private summariseDates(acts: Activity[], dataView: DataView): dayjs.Dayjs[] {

        
        let aggregateBuffer: dayjs.Dayjs[][] = [];
        let currentLevel: number = acts[acts.length - 1].getLevel();
        let globalStart: dayjs.Dayjs[] = [];
        let globalEnd: dayjs.Dayjs[] = [];
        let globalStatus: dayjs.Dayjs[] = [];
        // console.log(this.resetAggregateBuffer(dataView));

        //////////////////////////////////////////////////////////////// start
       
        aggregateBuffer = this.resetAggregateBuffer(dataView);
        for (let i = 0; i < acts.length; i++) {
            let l: number = acts[acts.length - i - 1].getLevel();
            if (l < currentLevel) {// going up indents, summarise, add self to higher buffer
                acts[acts.length - i - 1].setStart(Time.minDayjs(aggregateBuffer[l + 1]));
                //console.log(l, aggregateBuffer[l + 1]);
                //console.log(l, 'Summarise Start', Time.minDayjs(aggregateBuffer[l + 1]).format('DD/MM/YY'));
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
            //console.log(aggregateBuffer[l]);
            //console.log(acts[acts.length - i - 1].getLevel(), acts[acts.length - i - 1].getName(), acts.length - i - 1, aggregateBuffer);
        }
        
        //////////////////////////////////////////////////////////////// end

        currentLevel = acts[acts.length - 1].getLevel();
        aggregateBuffer = this.resetAggregateBuffer(dataView);
        for (let i = 0; i < acts.length; i++) {
            let l: number = acts[acts.length - i - 1].getLevel();

            if (l < currentLevel) {// going up indents, summarise, add self to higher buffer
                acts[acts.length - i - 1].setEnd(Time.maxDayjs(aggregateBuffer[l + 1]));
                //console.log(l, 'Summarise End', Time.maxDayjs(aggregateBuffer[l + 1]).format('DD/MM/YY'));
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
            //console.log(aggregateBuffer[l]);
            //console.log(acts[acts.length - i - 1].getLevel(), acts[acts.length - i - 1].getName(), acts.length - i - 1, aggregateBuffer);
        }

        //////////////////////////////////////////////////////////////// status
        if (this.configuration.field(ValueFields.STATUSDATE)) {
            currentLevel = acts[acts.length - 1].getLevel();
            aggregateBuffer = this.resetAggregateBuffer(dataView);
            for (let i = 0; i < acts.length; i++) {
                let l: number = acts[acts.length - i - 1].getLevel();

                if (l < currentLevel) {// going up indents, summarise, add self to higher buffer
                    acts[acts.length - i - 1].setGlobalStatus(Time.minDayjs(aggregateBuffer[l + 1]));
                    //console.log(l, 'Summarise End', Time.maxDayjs(aggregateBuffer[l + 1]).format('DD/MM/YY'));                
                    aggregateBuffer[l].push(acts[acts.length - i - 1].getGlobalStatus());
                    currentLevel = l;
                } else if (l > currentLevel) {//going down indents, clear buffer, add self
                    currentLevel = l;
                aggregateBuffer[l] = [(acts[acts.length - i - 1].getGlobalStatus())];
            } else {//same indent, add to buffer
                aggregateBuffer[l].push(acts[acts.length - i - 1].getGlobalStatus());
            }
            if (l == 0) {
                globalStatus.push(acts[acts.length - i - 1].getGlobalStatus());
            }
            //console.log(aggregateBuffer[l]);
            //console.log(acts[acts.length - i - 1].getLevel(), acts[acts.length - i - 1].getName(), acts.length - i - 1, aggregateBuffer);
        }
    }
        //console.log(globalStart);
        //console.log(globalEnd);

        return [Time.minDayjs(globalStart), Time.minDayjs(globalEnd), Time.minDayjs(globalStatus)];
    }

    /**
     * Returns an array of empty arrays. The number of empty arrays is equal to the 1-indexed depth of the DataView tree.
     * @param dataView the examinable DataView
     * @returns a 2D array of size depth x 0
     */
    private resetAggregateBuffer(dataView: DataView): dayjs.Dayjs[][] {
        let x: dayjs.Dayjs[][] = [];
        for (let i = 0; i <= this.maxDepth; i++) { x[i] = []; }
        return x;
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
        this.updateMaxDepth(node.level);

        if (node.children == null) {

            let start: dayjs.Dayjs = null;
            let end: dayjs.Dayjs = null;
            let status: dayjs.Dayjs = null;

            //check if safe to access .value
            if(this.configuration.field(ValueFields.START)){ start = dayjs(node.values[this.configuration.getValueMap(ValueFields.START)].value as Date);}
            if(this.configuration.field(ValueFields.END)){ end = dayjs(node.values[this.configuration.getValueMap(ValueFields.END)].value as Date);}
            if(this.configuration.field(ValueFields.STATUSDATE)){ status = dayjs(node.values[this.configuration.getValueMap(ValueFields.STATUSDATE)].value as Date);}
            
            //console.log("LOG: RECURSION: level = " + node.level + ', name = ' + this.nodeName(node) + ', start = ' + node.values[0].value);
            activities.push(new Activity(
                    this.nodeName(node),
                    node.level,
                    start,
                    end,
                    status
                    ));
        } else {
            activities.push(new Activity(
                this.nodeName(node),
                node.level,
                null,
                null,
                null
                ));
            for (let i = 0; i < node.children.length; i++) {
                this.dfsPreorder(activities, node.children[i]);
            }
        }
    }

    /**
     * Updates the variable this.maxDepth to the specified number.
     * @param d the new depth
     */
    private updateMaxDepth(d: number) {
        if (d > this.maxDepth) { this.maxDepth = d };
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

        this.timeline.defineTimeline(this.start, this.end, this.status, this.divChartHeader.node().getBoundingClientRect().width);
    
        // todo reduce duplicate code vvv
        
        this.tlWidth = this.timeline.getWidth();

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
            .attr('style', 'stroke:gray');


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

        this.chartHeight = acts.length * this.rowHeight;

         //////////////////////////////////////////////////////////////// Grid

         this.bars.selectAll('.grid-months-v')
         .data(ts.monthScale).join('line')
         .attr('x1', function (d) { return Lib.px(d.offset); })
         .attr('y1', '0px')
         .attr('x2', function (d) {
             return Lib.px(d.offset);
         })
         .attr('y2', Lib.px(this.chartHeight))
         .classed('grid-months-v', true)
         .attr('style', 'stroke:gray');

     this.bars.selectAll('.grid-years-v')
         .data(ts.yearScale).join('line')
         .attr('x1', function (d) { return Lib.px(d.offset); })
         .attr('y1', '0px')
         .attr('x2', function (d) {
             return Lib.px(d.offset);
         })
         .attr('y2', Lib.px(this.chartHeight))
         .classed('grid-years-v', true)
         .attr('style', 'stroke:gray');

         this.bars.selectAll('.grid-v')
         .data(acts).join('line')
         .attr('x1', '0px')
         .attr('y1', function(d,i){ return Lib.px(_this.rowHeight * i) })
         .attr('x2', this.tlWidth)
         .attr('y2', function(d,i){ return Lib.px(_this.rowHeight * i) })
         .classed('grid-v', true)
         .attr('style', 'stroke:gray');

//////////////////////////////////////////////////////////////// bars

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
                    case 0: return '#2A588E';
                    case 1: return '#3B6064';
                    case 2: return '#55828B';
                    case 3: return '#87BBA2';
                    case 4: return '#A4E1C9';
                    default: return 'gray';
                }
            });


        //////////////////////////////////////////////////////////////// Status
        //the status lines are destroyed and recreated every update(). I couldn't find a way to use .join or .update

        if(this.configuration.field(ValueFields.STATUSDATE)){

            this.timelineSVG
            .append('line')
            .attr('x1', '0px')
            .attr('x2', '0px')
            .attr('y1', '0px')
            .attr('y2', Lib.px(this.tlHeight))
            .attr('id', 'statusLine-tl')
            .attr('transform', this.timeline.statusDateTranslationPx())
            .attr('style', 'stroke: red');

        this.bars
            .append('line')
            .attr('x1', '0px')
            .attr('x2', '0px')
            .attr('y1', '0px')
            .attr('y2', Lib.px(this.chartHeight))
            .attr('id', 'statusLine-chart')
            .attr('transform', this.timeline.statusDateTranslationPx())
            .attr('style', 'stroke: red');
        }
        

        console.log('LOG: DONE Drawing Chart');
    }

    private drawTable(acts: Activity[]) {
        //////////////////////////////////////////////////////////////// Choose columns based off config
        console.log('LOG: Drawing Table');
        var _this = this;
        //TODO: WARNING: implement named headers instead of hard code!!
        // let s: string[] = this.configuration.getDisplayNames();
        let s: string[] = ['Activity Name'];

        this.divActivityHeader.select('tr').selectAll('th').data(s).join('th').text(d => d);
        this.divActivityHeader.select('th').classed('col-name', true);

        //create the number of trs required.
        this.divActivityBody
            .select('table')
            .selectAll('tr')
            .data(acts)
            .join('tr')
            .classed('tr-activity', true);

        var td = this.divActivityBody.selectAll('.tr-activity')
            .selectAll('td')//select all tds, there are 0
            .data(function (d: Activity) { return [d.getTableText()[0]]; })//THIS DATA COMES FROM THE TR's _data_ PROPERTY
            .join('td')
            .classed('col-name', true)
            .text(function (d) { return d; });

        //this is a workaround since I couldnt get d3.data(acts).classed(function (d) { return d.getLevel().toString();}) working due to an error
        // (d: any) => string is not compatible with type string...
        // search for @indentTypeMismatch in activity.ts
        d3.selectAll('.col-name').attr('min-width', Lib.px(this.divActivityBody.node().getBoundingClientRect().width));

        d3.select('#table-activities').selectAll('.col-name').data(acts).attr('class', function (d: Activity) {
            if (d.getLevel() == _this.maxDepth) {
                return d.getLevelString() + " leaf";
            } else {
                return d.getLevelString();
            }
        }
        );
        td.classed('col-name', true);

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



    //[09:28] Jack Tran
    // Add Custom Formatting 
    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /** 
    * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
    * objects and properties you want to expose to the users in the property pane.
    * 
    */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }


    ////////////////////////////////////////////////////////////////
    //  END OF CLASS
    ////////////////////////////////////////////////////////////////
}

    ////////////////////////////////////////////////////////////////
    //  UNUSED CODE SNIPPETS
    ////////////////////////////////////////////////////////////////    
    
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
