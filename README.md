# tbh-gantt
A prototype Power BI Visual for a Gantt Chart.

Author: `Brandon Lu`

Work email: `brandon.lu@tbhint.com`

Personal email: `brandonlu001@gmail.com`

LinkedIn: https://www.linkedin.com/in/brandonlu001/

## Summary
The aim of this project is to produce a prototype of a gantt chart that is easily extensible.
The gantt chart should have featuers that allow for some customisation of the bars, and configuraiton of the layout so the visual can be used for different purposes at different levels of fidelity.

## Procedure
### Setup
1. Download Power BI Desktop.
1. Setup the development environment. src: https://docs.microsoft.com/en-us/power-bi/developer/visuals/environment-setup
1. From the above tutorial, include `d3`, TypeScript definitions, `core-js` and `powerbi-visual-api`.

Tutorials and Doc:

https://docs.microsoft.com/en-us/power-bi/developer/visuals/develop-power-bi-visuals

https://docs.microsoft.com/en-us/power-bi/developer/visuals/develop-circle-card

### CircleCard Tutorial
Follow the CircleCard tutorial above as an introduction to developing a visual.

#### Getting the visual service to render a visual on a Power BI web report.

Ensure https://localhost:8080/assets/status is authorised on your browser.

![Successful blank visual displaying in a report.](readme-assets/000-SuccessInitialDeveloperVisual.jpg)

CircleCard visual tutorial complete (with sample Power BI data).

![The end result of the CircleCard tutorial.](readme-assets/001-CircleCardComplete.jpg)

### Understanding Data Mappings

https://docs.microsoft.com/en-us/power-bi/developer/visuals/dataview-mappings

### Prototype of the front end DOM

Initial positionings of elements in a web page and in ts.

![Web area mappings](readme-assets/003-webPositioningExperiment.jpg)
![TS visual area mappings](readme-assets/002-tsPositioningExperiment.jpg)
![Web blockout](readme-assets/004-webBlockout.jpg)
![Web prototype (static) using tables and svg](readme-assets/005-webProtoUsingTables.jpg)
![Div blockout in developer visual using ts.](readme-assets/006-ganttProtoPBIBlockout.jpg)


After the first iteration, it is proposed to use the following layout for overflow-y scrolling and dynamic sizing of the tasks table. Scrolling-x should not be allowed because we would be moving svgs around and dynamically rendering new lines and bars etc. Use other controls instead.

![Proposed layout of iteration 2](readme-assets/007-iteration2layout.jpg)

## Requirements Definition

### Primary

- Timeline (at top by default, axis units YYYY and MMM by default)
- Timeline scaleable (zoom in or out)
- Activities (bar, blue by default) and Milestones (diamond, black by default)
- Summaries?
- Links between activities and milestones
- Critical activities identified as red (pull in total float)
- Status date line

### Secondary

- Mobile compatible
- Display multiple activities on one line (like rollup summaries)

### Features

- Expand / Collapse summaries
- [Optional] Timeline position options (bottom of gantt)
- [Optional] Timeline axis units adjustable

## Mockups / Layouts
