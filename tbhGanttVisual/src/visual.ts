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

import * as dayjs from 'dayjs';
import * as MinMax from 'dayjs/plugin/minMax';

//UNIT TESTS
import * as jsUnit from './../tests/globalTests';
import { CursorPos } from 'readline';
import { start } from 'repl';

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
    private statusAndContent: Selection<HTMLDivElement>;
    private divActivities: Selection<HTMLDivElement>;
    private divChartContainer: Selection<HTMLDivElement>;

    //tables

    private activityTable: Selection<any>;

    //svgs

    private gantt: Selection<SVGSVGElement>;
    //text

    ////////////////DEV VARS\\\\\\\\\\\\\\\\
    private style: CSSStyleDeclaration;//should be a CSSStyleDeclaration
    private timeline: Timeline;
    private verbose: boolean = false; //verbose logging?

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

        this.generateBody(options);
        //generatetimeline with default dates

        this.status = dayjs(new Date(2019, 6, 19));

    }

    ////////////////////////////////////////////////////////////////
    //  UPDATE VISUAL ON REFRESH
    ////////////////////////////////////////////////////////////////

    public update(options: VisualUpdateOptions) {
        //this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        if (this.verbose) { console.log('Visual update()', options); }

        //CSS NOT WORKING, THIS IS A WORKAROUND
        //TODO FIX
        // this.divContent.style('height', Lib.px(document.body.clientHeight - Lib.pxToNumber(this.style.getPropertyValue('--headerHeight'))));

        let dataView: DataView = options.dataViews[0];
        //options.dataViews[0].metadata.columns.entries

        let acts: Activity[] = this.checkConfiguration(dataView);
        let ts: TimeScale = this.drawTimeline(acts);
        this.drawChart(acts, ts, this.gantt);
        this.drawTable(acts);

        // let ops : EnumerateVisualObjectInstancesOptions = new EnumerateVisualObjectInstancesOptions('subTotals')
        // let o: VisualObjectInstanceEnumeration = this.enumerateObjectInstances(EnumerateVisualObjectInstancesOptions);

    }

    private generateBody(options: VisualConstructorOptions) {

        ////////////////////////////////////////////////////////////////
        //  Create body level child elements
        ////////////////////////////////////////////////////////////////
        // help from lines 377 onwards at https://github.com/microsoft/powerbi-visuals-gantt/blob/master/src/gantt.ts


        // let wrapper: Selection<HTMLDivElement> = d3.select(options.element).append('div').attr('id', 'div-sizeControllerWorkaround');

        //the header including title, logos etc
        this.divHeader = d3.select(options.element)
            .append('div')
            .attr('id', 'div-header')
            .append('h4')
            .text('TBH Gantt Chart Visual (WIP)');

        //structure of the content below the header
        this.statusAndContent = d3.select(options.element)
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
        this.divActivities = this.statusAndContent
            .append('div')
            .attr('id', 'div-activities')
            .on('scroll', function () { _this.syncScrollTimelineTop(_this.divActivities) });

        //div to hold the chart elements including background, bars, text, controls
        this.divChartContainer = this.statusAndContent
            .append('div')
            .attr('id', 'div-chart')
            .on('scroll', function () { _this.syncScrollTimelineTop(_this.divChartContainer) });;

        // this.activityTable = this.divActivities
        //     .append('table')
        //     .attr('id', 'table-activities');

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

        //check verbose
        console.log(dataView.matrix.rows.root);

        let acts: Activity[] = [];
        let dt: dayjs.Dayjs[];

        this.dfsPreorder(acts, dataView.matrix.rows.root.children[0]);

        dt = this.summariseDates(acts);
        this.start = dt[0];
        this.end = dt[1];

        acts = this.reduceHeirarchy(acts);

        console.log(acts);
        console.log('LOG: DONE Checking Configuration');

        return acts;
    }

    private summariseDates(acts: Activity[]): dayjs.Dayjs[] {

        let aggregateBuffer: dayjs.Dayjs[] = [];
        let currentLevel: number = acts[acts.length - 1].getLevel();
        let globalStart: dayjs.Dayjs[] = [];
        let globalEnd: dayjs.Dayjs[] = [];


        for (let i = 0; i < acts.length; i++) {
            let l: number = acts[acts.length - i - 1].getLevel();

            if (l < currentLevel) {// going up indents, summarise
                acts[acts.length - i - 1].setStart(Time.minDayjs(aggregateBuffer));
                currentLevel = l;
            } else if (l > currentLevel) {//going down indents, clear buffer, add self
                currentLevel = l;
                aggregateBuffer = [(acts[acts.length - i - 1].getStart())];
            } else {//same indent, add to buffer
                aggregateBuffer.push(acts[acts.length - i - 1].getStart());
            }

            if (l == 0) {
                globalStart.push(acts[acts.length - i - 1].getStart());
            }
            // console.log(acts[acts.length - i - 1].getLevel(), acts[acts.length - i - 1].getName(), acts.length - i - 1, aggregateBuffer);
        }

        for (let i = 0; i < acts.length; i++) {
            let l: number = acts[acts.length - i - 1].getLevel();

            if (l < currentLevel) {// going up indents, summarise
                acts[acts.length - i - 1].setEnd(Time.maxDayjs(aggregateBuffer));
                currentLevel = l;
            } else if (l > currentLevel) {//going down andents, clear buffer
                currentLevel = l;
                aggregateBuffer = [(acts[acts.length - i - 1].getEnd())];
            } else {//same indent, add to buffer
                aggregateBuffer.push(acts[acts.length - i - 1].getEnd());
            }

            if (l == 0) {
                globalEnd.push(acts[acts.length - i - 1].getEnd());
            }
        }

        return [Time.minDayjs(globalStart), Time.minDayjs(globalEnd)];
    }

    private reduceHeirarchy(acts: Activity[]): Activity[] {
        console.log("LOG: Reducing heiracrchy");
        let a: Activity[] = [];
        let l: number;
        let target: number;

        // console.log(acts[0]);

        for (let i = 0; i < acts.length; i++) {
            l = acts[i].getLevel();

            console.log('LOG: i=' + i + ', level = ' + l +
                ', target = ' + target +
                ', name? = ' + (acts[i].getName() != '') +
                ', target? = ' + (target != null) +
                ', name = ' + acts[i].getName());

                //no target, no name
            if ((target == null) && (acts[i].getName() == '')) {
                target = acts[i].getLevel();
            }

            //has target, has name
            if ((target != null) && (acts[i].getName() != '')) {
                acts[i].setLevel(target);
                target = null;
            }

            if(acts[i].getName() != ''){
                a.push(acts[i]);
            }

        }

        return a;
    }
    /**
     * 
     * @param activities 
     * @param node 
     */
    private dfsPreorder(activities: Activity[], node: powerbi.DataViewMatrixNode) {

        if (node.children == null) {
            // console.log("LOG: RECURSION: level = " + node.level + ', name = ' + this.nodeName(node) + ', start = ' + node.values[0].value);
            if ((node.values[0] != null) && (node.values[1] != null)) {//every task must have a start and finish
                activities.push(new Activity(
                    this.nodeName(node),
                    dayjs(node.values[0].value as Date),
                    dayjs(node.values[1].value as Date),
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

    private nodeName(node: powerbi.DataViewMatrixNode): string {
        if (node.value == null) {
            return '';
        } else {
            return node.value.toString();
        }
    }

    private drawTimeline(acts: Activity[]): TimeScale {
        console.log('LOG: Drawing Timeline');

        this.timeline = new Timeline(this.start, this.end, this.status);

        this.tlWidth = Math.ceil(this.timeline.getDays() * this.timeline.getDayScale());//cannot be less than div width!
        this.tlHeight = Lib.pxToNumber(this.style.getPropertyValue('--timelineHeight'));
        this.rowHeight = Lib.pxToNumber(this.style.getPropertyValue('--rowHeight'));

        let ts: TimeScale = this.timeline.getTimeScale();

        ////////////////////////////////////////////////////////////////
        //  Create svg timeline
        ////////////////////////////////////////////////////////////////

        this.gantt = this.divChartContainer
            .append('svg')
            .attr('id', 'tl-top')
            .attr('height', Lib.px(this.tlHeight + (acts.length * this.rowHeight)))
            .attr('width', Lib.px(this.tlWidth));

        this.gMonths = this.gantt.append('g')
            .classed('g-tl', true);

        this.gYears = this.gantt.append('g')
            .classed('g-tl', true);

        //////////////////////////////////////////////////////////////// YearText
        this.gYears.selectAll('text')
            .data(ts.yearScale)
            .enter()
            .append('text')
            .attr('x', function (d) {
                return Lib.px(d.offset + d.textAnchorOffset);
            })
            .attr('y', '0px')
            .text(function (d) { return d.text; })
            .attr('text-anchor', 'top')
            .attr('alignment-baseline', 'hanging')
            .classed('yearText', true);

        //////////////////////////////////////////////////////////////// YearLine
        this.gYears.selectAll('line').data(ts.yearScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', '0px')
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', this.tlHeight)
            .attr('stroke-width', '2px')
            .attr('style', 'stroke:black');

        //////////////////////////////////////////////////////////////// MonthText
        this.gMonths.selectAll('text')
            .data(ts.monthScale)
            .enter()
            .append('text')
            .attr('x', function (d) {
                return Lib.px(d.offset + d.textAnchorOffset);
            })
            .attr('y', Lib.px(this.tlHeight / 2))
            .text(function (d) { return d.text; })
            .attr('text-anchor', 'top')
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'middle')
            .classed('monthText', true);

        //////////////////////////////////////////////////////////////// YMonthLine
        this.gMonths.selectAll('line').data(ts.monthScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(this.tlHeight / 2))
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
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

        //this.populateActivityTable(myData, null, 'table-activities');

        ////////////////////////////////////////////////////////////////
        //  Prepare for chart drawing
        ////////////////////////////////////////////////////////////////

        let bars: Selection<SVGSVGElement> = gantt
            .append('g')
            .append('svg')
            .attr('id', 'svg-bars');


        bars.selectAll('rect')
            .data(acts)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return Lib.px(_this.timeline.dateLocation(d.getStart()));
            })
            .attr('height', Lib.px(this.rowHeight - 4))
            .attr('width', function (d) {
                return Lib.px(_this.timeline.dateLocation(d.getEnd()) - _this.timeline.dateLocation(d.getStart()));
            })
            .attr('y', function (d, i) { return Lib.px(_this.tlHeight + (_this.rowHeight * i) + 2) })
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

        this.chartHeight = bars.node().getBoundingClientRect().height + this.tlHeight;

        //also put this in a fn later for update()
        // getBBox() help here:
        // https://stackoverflow.com/questions/45792692/property-getbbox-does-not-exist-on-type-svgelement
        // https://stackoverflow.com/questions/24534988/d3-get-the-bounding-box-of-a-selected-element
        gantt.append('g')
            .attr('id', 'statusLine').attr('width', '100%').attr('height', '100%')
            .append('line')
            .attr('x1', '0px')
            .attr('y1', '0px')
            .attr('x2', '0px')
            .attr('y2', Lib.px(this.chartHeight))
            .attr('transform', 'translate(' + this.timeline.statusDateLocation() + ')');

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



        console.log('LOG: DONE Drawing Chart');
    }

    private drawTable(acts: Activity[]) {
        console.log('LOG: Drawing Table');
        if (this.verbose) { console.log('LOG: populateActivityTable called with some number of rows.'); }


        d3.select('#div-activities')
            .append('table')
            .attr('id', 'table-activityHeader')
            .append('th')
            .attr('class', 'highlight');

        //create the number of trs required.
        let tr: Selection<HTMLTableRowElement> = d3.select('#div-activities')
            .append('table')
            .attr('id', 'table-activities')
            .selectAll('tr')
            .data(acts)
            .enter()
            .append('tr')
            .classed('tr-activity', true);



        let td: Selection<HTMLTableCellElement> = tr.selectAll('.td-name')//select all tds, there are 0
            .data(function (d) { return [d.getTableText()[0]]; })//THIS DATA COMES FROM THE TR's _data_ PROPERTY
            .enter()
            .append('td')
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

    /*
    * Returns a <table> element based on the Activities from the DataView.
    * Returns an empty table if options is null.
    * TODO change this to a d3 arg
    */
    // private populateActivityTable(data, headerID: string, tableID: string) {
    //     //check number of data elements and number of tr and tds to determine
    //     //whether to enter(), update() or exit()

    //     if (data == null) {
    //         if (this.verbose) { console.log('LOG: populateActivityTable called with a null VisualUpdateOptions.'); }

    //     }

    //https://www.tutorialsteacher.com/d3js/data-binding-in-d3js
    //https://www.dashingd3js.com/d3-tutorial/use-d3-js-to-bind-data-to-dom-elements
    //BEWARE: I had to change the types of all these following to var and not Selection<T,T,T,T>. the second function (d)
    //call returned a type that wasnt compatible with Selction<T,T,T,T> and I couldn't figure out which type to use.


    // }
    /**
     * Synchronises the left scrolling of the div-timeline and div-chart depending on which one was scrolled.
     * 
     * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-chart, 
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     * @param div the div that was scrolled by the user.
     */
    private syncScrollTimelineLeft(div: Selection<HTMLDivElement>) {
        //links i used to understand ts callbacks, d3 event handling
        //https://hstefanski.wordpress.com/2015/10/25/responding-to-d3-events-in-typescript/
        //https://rollbar.com/blog/javascript-typeerror-cannot-read-property-of-undefined/
        //https://www.d3indepth.com/selections/
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event
        //https://github.com/d3/d3-selection/blob/main/README.md#handling-events
        //https://www.tutorialsteacher.com/d3js/event-handling-in-d3js

        if (this.verbose) { console.log('Synchronising scroll...'); }

        let id: string = div.attr('id');//d3.select(d3.event.currentTarget)
        let chartID: string = 'div-chart';
        let timelineID: string = 'div-timeline';

        switch (id) {
            case chartID:
                document.getElementById(timelineID).scrollLeft = document.getElementById(chartID).scrollLeft;
                if (this.verbose) { console.log('LOG: Sync timeline scroll to chart scroll'); };

            case timelineID:
                document.getElementById(chartID).scrollLeft = document.getElementById(timelineID).scrollLeft;
                if (this.verbose) { console.log('LOG: Sync chart scroll to timeline scroll'); };
        }
    }

    /**
    * Synchronises the top scrolling of the div-timeline and div-chart depending on which one was scrolled.
    * 
    * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-chart, 
    * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
    * @param div the div that was scrolled by the user.
    */
    private syncScrollTimelineTop(div: Selection<HTMLDivElement>) {
        //links i used to understand ts callbacks, d3 event handling
        //https://hstefanski.wordpress.com/2015/10/25/responding-to-d3-events-in-typescript/
        //https://rollbar.com/blog/javascript-typeerror-cannot-read-property-of-undefined/
        //https://www.d3indepth.com/selections/
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event
        //https://github.com/d3/d3-selection/blob/main/README.md#handling-events
        //https://www.tutorialsteacher.com/d3js/event-handling-in-d3js

        if (this.verbose) { console.log('Synchronising scroll...'); }

        let id: string = div.attr('id');//d3.select(d3.event.currentTarget)
        let chartID: string = 'div-activities';
        let timelineID: string = 'div-chart';

        switch (id) {
            case chartID:
                document.getElementById(timelineID).scrollTop = document.getElementById(chartID).scrollTop;
                if (this.verbose) { console.log('LOG: Sync timeline scroll to chart scroll'); };

            case timelineID:
                document.getElementById(chartID).scrollTop = document.getElementById(timelineID).scrollTop;
                if (this.verbose) { console.log('LOG: Sync chart scroll to timeline scroll'); };
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