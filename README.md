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

![Successful blank visual displaying in a report.]{readme-assets/000-SuccessfulInitialDeveloperVisual}

### Requirements Definition
