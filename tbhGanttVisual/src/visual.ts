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
    private timelineTable: Selection<HTMLTableElement>;
    private ganttGridTable: Selection<HTMLTableElement>;

    //svgs

    //text

    ////////////////DEV VARS\\\\\\\\\\\\\\\\
    private style: CSSStyleDeclaration;//should be a CSSStyleDeclaration
    private timeline: Timeline;
    private verbose: boolean = false; //verbose logging?

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(options: VisualConstructorOptions) {
        if (this.verbose) { console.log('LOG: Constructing Visual Object', options); }

        var _this = this; //get a reference to self so that d3's anonymous callbacks can access member functions

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

        ////////////////////////////////////////////////////////////////
        //  Generate Timeline object from data (put in function later)
        ////////////////////////////////////////////////////////////////

        let myData: Activity[] = [

            new Activity(dayjs(new Date(2022, 3, 2)), dayjs(new Date(2030, 3, 4)), 'Activity A'),
            new Activity(dayjs(new Date(2025, 5, 2)), dayjs(new Date(2024, 3, 4)), 'Activity B'),
            new Activity(dayjs(new Date(2023, 7, 2)), dayjs(new Date(2024, 3, 4)), 'Activity C'),
            new Activity(dayjs(new Date(2023, 8, 2)), dayjs(new Date(2024, 3, 4)), 'Activity D'),
            new Activity(dayjs(new Date(2023, 9, 2)), dayjs(new Date(2024, 3, 4)), 'Activity E'),
            new Activity(dayjs(new Date(2022, 9, 2)), dayjs(new Date(2024, 3, 4)), 'Activity F'),
            new Activity(dayjs(new Date(2023, 2, 2)), dayjs(new Date(2024, 3, 4)), 'Activity G'),
            new Activity(dayjs(new Date(2028, 6, 2)), dayjs(new Date(2030, 3, 4)), 'Activity B'),
            new Activity(dayjs(new Date(2029, 3, 2)), dayjs(new Date(2030, 3, 4)), 'Activity C'),
            new Activity(dayjs(new Date(2022, 7, 2)), dayjs(new Date(2030, 3, 4)), 'Activity D'),
            new Activity(dayjs(new Date(2021, 3, 2)), dayjs(new Date(2030, 3, 4)), 'Activity E'),
            new Activity(dayjs(new Date(2021, 8, 2)), dayjs(new Date(2030, 3, 4)), 'Activity F'),
            new Activity(dayjs(new Date(2022, 3, 2)), dayjs(new Date(2030, 3, 4)), 'Activity G')
        ];

        console.log('a');
        // console.log(dayjs.min(dayjs(new Date(2000,1,1)),dayjs(new Date(2001,1,1))));

        let d1: dayjs.Dayjs = Time.minDayjs([
            dayjs(new Date(2022, 3, 2)),
            dayjs(new Date(2025, 5, 2)),
            dayjs(new Date(2023, 7, 2)),
            dayjs(new Date(2023, 8, 2)),
            dayjs(new Date(2023, 9, 2)),
            dayjs(new Date(2022, 9, 2)),
            dayjs(new Date(2023, 2, 2)),
            dayjs(new Date(2028, 6, 2)),
            dayjs(new Date(2029, 3, 2)),
            dayjs(new Date(2022, 7, 2)),
            dayjs(new Date(2021, 3, 2)),
            dayjs(new Date(2021, 8, 2)),
            dayjs(new Date(2022, 3, 2))]);

        let d2: dayjs.Dayjs = Time.maxDayjs([
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2024, 3, 4)),
            dayjs(new Date(2030, 3, 4)),
            dayjs(new Date(2030, 3, 4)),
            dayjs(new Date(2030, 3, 4)),
            dayjs(new Date(2030, 3, 4)),
            dayjs(new Date(2030, 3, 4)),
            dayjs(new Date(2030, 3, 4))]);

        console.log('a');
        let status: dayjs.Dayjs = dayjs(new Date(2022, 6, 16));
        console.log('a');
        this.timeline = new Timeline(d1, d2, status);
        let padding: number = 0;//this.timeline.getPadding();

        let tlWidth: number = Math.ceil(this.timeline.getDays() * this.timeline.getDayScale());//cannot be less than div width!

        let tlHeight: number = Lib.pxToNumber(this.style.getPropertyValue('--timelineHeight'));


        let rowHeight: number = Lib.pxToNumber(this.style.getPropertyValue('--rowHeight'));

        let ts: TimeScale = this.timeline.getTimeScale();

        ////////////////////////////////////////////////////////////////
        //  Create body level child elements
        ////////////////////////////////////////////////////////////////
        // help from lines 377 onwards at https://github.com/microsoft/powerbi-visuals-gantt/blob/master/src/gantt.ts

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

        //div to contain the act table and chart
        this.divContent = this.statusAndContent
            .append('div')
            .attr('id', 'div-content');

        ////////////////////////////////////////////////////////////////
        //  Create content elements (must set timeline width using selection.style())...
        ////////////////////////////////////////////////////////////////

        //div to hold the activity data in a table
        this.divActivities = this.divContent
            .append('div')
            .attr('id', 'div-activities');

        //div to hold the chart elements including background, bars, text, controls
        this.divChartContainer = this.divContent
            .append('div')
            .attr('id', 'div-chart');

        ////////////////////////////////////////////////////////////////
        //  Chart Configuration
        ////////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////////
        //  Create svg timeline
        ////////////////////////////////////////////////////////////////

        let gantt: Selection<SVGSVGElement> = this.divChartContainer
            .append('svg')
            .attr('id', 'tl-top')
            .attr('height', Lib.px(tlHeight + (myData.length * rowHeight)))
            .attr('width', Lib.px(tlWidth));

        let gMonths: Selection<SVGGElement> = gantt.append('g')
            .classed('g-tl', true);

        let gYears: Selection<SVGGElement> = gantt.append('g')
            .classed('g-tl', true);

        //////////////////////////////////////////////////////////////// YearText
        gYears.selectAll('text')
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
        gYears.selectAll('line').data(ts.yearScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', '0px')
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', tlHeight)
            .attr('stroke-width', '2px')
            .attr('style', 'stroke:black');

        //////////////////////////////////////////////////////////////// MonthText
        gMonths.selectAll('text')
            .data(ts.monthScale)
            .enter()
            .append('text')
            .attr('x', function (d) {
                return Lib.px(d.offset + d.textAnchorOffset);
            })
            .attr('y', Lib.px(tlHeight / 2))
            .text(function (d) { return d.text; })
            .attr('text-anchor', 'top')
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'middle')
            .classed('monthText', true);

        //////////////////////////////////////////////////////////////// YMonthLine
        gMonths.selectAll('line').data(ts.monthScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(tlHeight / 2))
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', tlHeight)
            .attr('style', 'stroke:red');

        //////////////////////////////////////////////////////////////// Grid
        let chartHeight: number = this.divChartContainer.node().getBoundingClientRect().height;

        gMonths.selectAll('.grid-months')
            .data(ts.monthScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(tlHeight))
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', Lib.px(chartHeight))
            .attr('style', 'stroke:green');

        gYears.selectAll('.grid-years')
            .data(ts.yearScale).enter().append('line')
            .attr('x1', function (d) { return Lib.px(d.offset); })
            .attr('y1', Lib.px(tlHeight))
            .attr('x2', function (d) {
                return Lib.px(d.offset);
            })
            .attr('y2', Lib.px(chartHeight))
            .attr('style', 'stroke:gray');
        ////////////////////////////////////////////////////////////////
        //  Create #table-activities
        ////////////////////////////////////////////////////////////////

        // https://stackoverflow.com/questions/43356213/understanding-enter-and-exit
        // https://www.tutorialsteacher.com/d3js/function-of-data-in-d3js
        // https://stackoverflow.com/questions/21485981/appending-multiple-non-nested-elements-for-each-data-member-with-d3-js/33809812#33809812
        // https://stackoverflow.com/questions/37583275/how-to-append-multiple-child-elements-to-a-div-in-d3-js?noredirect=1&lq=1
        // https://stackoverflow.com/questions/21485981/appending-multiple-non-nested-elements-for-each-data-member-with-d3-js

        this.activityTable = this.divActivities
            .append('table')
            .attr('id', 'table-activities');






        //this.populateActivityTable(myData, null, 'table-activities');

        ////////////////////////////////////////////////////////////////
        //  Prepare for chart drawing
        ////////////////////////////////////////////////////////////////

        let bars: Selection<SVGSVGElement> = gantt
            .append('g')
            .append('svg')
            .attr('id', 'svg-bars');

        console.log('a');
        bars.selectAll('rect')
            .data(myData)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return Lib.px(_this.timeline.dateLocation(d.getStart()));
            })
            .attr('height', rowHeight)
            .attr('width', function (d) {
                return Lib.px(_this.timeline.dateLocation(d.getEnd()) - _this.timeline.dateLocation(d.getStart()));
            })
            .attr('y', function (d, i) { return Lib.px(tlHeight + (rowHeight * i)) })
            .attr('rx', '3px')
            .attr('ry', '3px')
            .classed('activityBar', true);

        ////////////////////////////////////////////////////////////////
        //  Draw chart
        ////////////////////////////////////////////////////////////////

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
            .attr('y2', (d3.select('#div-chart').node() as HTMLDivElement)
                .getBoundingClientRect()
                .height
                .toString()
                .concat('px'))
            .attr('transform', 'translate(' + this.timeline.statusDateLocation() + ')');

    }

    ////////////////////////////////////////////////////////////////
    //  UPDATE VISUAL ON REFRESH
    ////////////////////////////////////////////////////////////////

    public update(options: VisualUpdateOptions) {
        //this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        if (this.verbose) { console.log('Visual update', options); }
        // if (this.textNode) {
        //     this.textNode.textContent = (this.updateCount++).toString();
        // }

        let dataView: DataView = options.dataViews[0];
        //options.dataViews[0].metadata.columns.entries

        this.checkConfiguration(dataView);
        // let width: number = options.viewport.width;
        // let height: number = options.viewport.height;
        // this.svg.attr('width', width);
        // this.svg.attr('height', height);
        // let radius: number = Math.min(width, height) / 2.2;
        // this.circle
        //     .style('fill', 'white')
        //     .style('fill-opacity', 0.5)
        //     .style('stroke', 'black')
        //     .style('stroke-width', 2)
        //     .attr('r', radius)
        //     .attr('cx', width / 2)
        //     .attr('cy', height / 2);
        // let fontSizeValue: number = Math.min(width, height) / 5;
        // this.textValue
        //     .text(<string>dataView.single.value)
        //     .attr('x', '50%')
        //     .attr('y', '50%')
        //     .attr('dy', '0.35em')
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', fontSizeValue + 'px');
        // let fontSizeLabel: number = fontSizeValue / 4;
        // this.textLabel
        //     .text(dataView.metadata.columns[0].displayName)
        //     .attr('x', '50%')
        //     .attr('y', height / 2)
        //     .attr('dy', fontSizeValue / 1.2)
        //     .attr('text-anchor', 'middle')
        //     .style('font-size', fontSizeLabel + 'px');

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

    //     //https://www.tutorialsteacher.com/d3js/data-binding-in-d3js
    //     //https://www.dashingd3js.com/d3-tutorial/use-d3-js-to-bind-data-to-dom-elements
    //     //BEWARE: I had to change the types of all these following to var and not Selection<T,T,T,T>. the second function (d)
    //     //call returned a type that wasnt compatible with Selction<T,T,T,T> and I couldn't figure out which type to use.

    //     if (this.verbose) { console.log('LOG: populateActivityTable called with some number of rows.'); }

    //     //create the number of trs required.
    //     var tr = d3.select('#' + tableID)//select the table
    //         .selectAll('tr')//select all tr elements (which there are none)
    //         .data(data)//select every array element of array myData (there are 7). DATA IS NOW BOUND TO TRs
    //         .enter()//since we have 0 trs and 7 elements in myData, we stage 7 references
    //         .append('tr');//append a tr to each reference

    //     var v = tr.selectAll('td')//select all tds, there are 0
    //         .data(function (d) { return d; })//THIS DATA COMES FROM THE TR's _data_ PROPERTY
    //         .enter()
    //         .append('td')
    //         .text(function (d) { return d; });//we are taking d from the bound data from the trs
    //     // .attr('class','style'+d.wbsIndex);
    // }

    /**
     * Returns the configuration of the desired graph to determine which elements to render based on the data in dataView.
     * @param dataView The DataView object to configure the visual against.
     */
    private checkConfiguration(dataView: DataView) {
        console.log('LOG: DATAVIEW CONFIGURATION');
        console.log('LOG: number of heirachy levels: ' + dataView.matrix.rows.levels.length);
        //console.log(dataView.matrix.rows.root.children[0]);

        let acts: string[] = [];
        this.dfsPreorder(acts, dataView.matrix.rows.root.children[0]);

        console.log(acts);
    }




    private dfsPreorder(activities: string[], node: powerbi.DataViewMatrixNode) {

        let isLeaf: boolean = false;

        if (node.children == null) {isLeaf = true;}

        console.log("LOG: RECURSION: level = " + node.level + ', value = '+node.levelValues[0].value)
        activities.push(node.levelValues[0].value + ', level = ' + node.level);//need to check type?

        if (!isLeaf) {
            for (let i = 0; i < node.children.length; i++) {
                this.dfsPreorder(activities, node.children[i]);
            }
        }
    }



    /**
     * Synchronises the left scrolling of the div-timeline and div-chart depending on which one was scrolled.
     * 
     * KNOWN ISSUE: since the event listener that fires this callback is on both div-timeline and div-chart, 
     * it first updates scrollTop for both divs, and then it is fired again from the other div, but with a scroll change of 0.
     * @param div the div that was scrolled by the user.
     */
    private syncScrollTimeline(div: Selection<HTMLDivElement>) {
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

    ////////////////////////////////////////////////////////////////
    //  END OF CLASS
    ////////////////////////////////////////////////////////////////
}