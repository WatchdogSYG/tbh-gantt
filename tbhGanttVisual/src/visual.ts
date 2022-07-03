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

import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

//import { VisualSettings } from './settings';

import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from 'd3';
import { DSVRowAny, style, text } from 'd3';
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
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
    private divTATH: Selection<HTMLDivElement>;
    private divStatusLine: Selection<HTMLDivElement>;
    private divTasks: Selection<HTMLDivElement>;
    private divChartContainer: Selection<HTMLDivElement>;
    private divStructureLayer: Selection<HTMLDivElement>;
    private divSvgLayer: Selection<HTMLDivElement>;
    private divTimeline: Selection<HTMLDivElement>;
    private divChart: Selection<HTMLDivElement>;
    private divOverlay: Selection<HTMLDivElement>;

    //tables

    private tasksTable: Selection<any>;
    private timelineTable: Selection<HTMLTableElement>;
    private ganttGridTable: Selection<HTMLTableElement>;

    //svgs

    //text
    private svg: Selection<SVGElement>;

    private container: Selection<SVGElement>;
    private circle: Selection<SVGElement>;
    private textValue: Selection<SVGElement>;
    private textLabel: Selection<SVGElement>;


    ////////////////DEV VARS\\\\\\\\\\\\\\\\
    private rows: number;
    private cols: number;



    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);

        this.rows = 5;
        this.cols = 3;

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

        // help from lines 377 onwards at https://github.com/microsoft/powerbi-visuals-gantt/blob/master/src/gantt.ts


        //////// BODY

        //Assigns the first (and only) html element to this.body and then appends a div
        this.divHeader = d3.select(options.element)
            .append('div')
            .attr('id', 'div-header');

        this.divHeader.append('h4')
            .text('Header (include space for title, legend & logos');

        this.statusAndContent = d3.select(options.element)
            .append('div')
            .attr('id', 'div-statusAndContent');

        //////// STATUSANDCONTENT

        this.divTATH = this.statusAndContent
            .append('div')
            .attr('id', 'div-timelineAndTasksHeader');

        this.divContent = this.statusAndContent
            .append('div')
            .attr('id', 'div-content');

        this.divStatusLine = this.statusAndContent
            .append('div')
            .attr('id', 'div-statusLine')
            .attr('class', 'highlight');

        this.divTasks
        ////////TIMELINEANDTASKSHEADER


        //////// CONTENT
        this.divTasks = this.divContent
            .append('div')
            .attr('id', 'div-tasks');

        this.divChartContainer = this.divContent
            .append('div')
            .attr('id', 'div-chartContainer');


        this.divStructureLayer = this.divChartContainer
            .append('div')
            .attr('class', 'gridStack')
            .attr('id', 'div-structureLayer');

        this.divSvgLayer = this.divChartContainer
            .append('div')
            .attr('class', 'gridStack')
            .attr('id', 'div-svgLayer');

        this.divTimeline = this.divTATH
            .append('div')
            .attr('id', 'div-timeline');

        this.divChart = this.divStructureLayer
            .append('div')
            .attr('id', 'div-chart');


        //https://stackoverflow.com/questions/43356213/understanding-enter-and-exit
        // https://www.tutorialsteacher.com/d3js/function-of-data-in-d3js
        // https://stackoverflow.com/questions/21485981/appending-multiple-non-nested-elements-for-each-data-member-with-d3-js/33809812#33809812
        // https://stackoverflow.com/questions/37583275/how-to-append-multiple-child-elements-to-a-div-in-d3-js?noredirect=1&lq=1
        // https://stackoverflow.com/questions/21485981/appending-multiple-non-nested-elements-for-each-data-member-with-d3-js

        this.tasksTable = this.divTasks
            .append('table')
            .attr('id', 'table-tasks').append('tr');

        // for (let i = 0; i < 5; i++) {
        //     this.tasksTable.append('tr').attr('class', 'row');
        // }


        let keys: string[] = ['a', 'b'];
        let values1: string[] = ['c', 'd', 'e', 'f', 'g'];
        let values2: string[] = ['e', 'f'];

        d3.select('#table-tasks')
            .selectAll('tr')
            .data(values1)
            .enter()
            .append('td')
            .text(function (d, i) {
                console.log('d:' + d + ',i:' + i);
                return d;
            });//why does this append tds after tr? should be in tr.
        //this.createTasksTable(null, this.divTasks);

        //also put this in a fn later for update()
        // getBBox() help here:
        // https://stackoverflow.com/questions/45792692/property-getbbox-does-not-exist-on-type-svgelement
        // https://stackoverflow.com/questions/24534988/d3-get-the-bounding-box-of-a-selected-element
        this.divSvgLayer.append('svg')
            .attr('id', 'statusLine').attr('width', '100%').attr('height', '100%')
            .append('line')
            .attr('x1', '0px')
            .attr('y1', '0px')
            .attr('x2', '0px')
            .attr('y2', (d3.select('#div-svgLayer')
                .node() as HTMLDivElement)
                .getBoundingClientRect()
                .height
                .toString()
                .concat('px'))
            .attr('transform', 'translate(30)');



        //this.divTasks.append(this.tasksTable);
    }

    /*
    * Returns a <table> element based on the Activities from the DataView.
    * Returns an empty table if options is null.
    */
    private createTasksTable(options: VisualUpdateOptions, divTasks: Selection<HTMLDivElement>) {
        if (options == null) {
            console.log('LOG: createTasksTable called with a null VisualUpdateOptions.');


            let tableRow: Selection<HTMLTableRowElement>;
            let tableData: Selection<HTMLTableCellElement>;


            tableData.text('null');


            for (let i = 0; i < this.rows; i++) {
                divTasks.append('tr').append('td').insert('td').insert('td').insert('td').insert('td');
            }

            console.log('LOG: createTasksTable called with a some number of rows.');
            //return table;
        }
    }

    private createTaskRow(taskData: string[]) {

    }

    public update(options: VisualUpdateOptions) {
        //this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        // if (this.textNode) {
        //     this.textNode.textContent = (this.updateCount++).toString();
        // }

        let dataView: DataView = options.dataViews[0];

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

    // private static parseSettings(dataView: DataView): VisualSettings {
    //     return <VisualSettings>VisualSettings.parse(dataView);
    // }

    // /**
    //  * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
    //  * objects and properties you want to expose to the users in the property pane.
    //  *
    //  */
    // public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    //     return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    // }
}