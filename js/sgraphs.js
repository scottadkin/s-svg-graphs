


class SGraph{

    constructor(parent, width, bg, title, data){

        this.parent = document.getElementById(parent);
        this.ns = "http://www.w3.org/2000/svg";
        this.width = width;
        this.height = width * 0.5625;
        this.bg = bg;
        this.title = title;

        this.maxValue = 0;
        this.minValue = 0;
        this.maxData = 0;
        this.valueOffset = 0;

        this.data = data;


        this.gridStartX = 15;
        this.gridStartY = 75;

        this.graphWidth = 84;
        this.graphHeight = 60;

        this.setMaxValue();

        this.createSVG();

        this.drawGraph();
        
    }

    x(input){
        return (this.width / 100) * input;
    }

    y(input){
        return (this.height / 100) * input;
    }

    createSVG(){

        this.elem = document.createElementNS(this.ns,"svg");

        this.elem.setAttribute("width", this.width);
        this.elem.setAttribute("height", this.height);

        this.parent.appendChild(this.elem);
    }

    drawRect(x, y, width, height, style){

        //x = this.x(x);
       // y = this.x(y);
       // width = this.x(width);
        //height = this.y(height);

        const elem = document.createElementNS(this.ns, "rect");
        elem.setAttribute("x", x);
        elem.setAttribute("y", y);
        elem.setAttribute("width", width);
        elem.setAttribute("height", height);
        elem.setAttribute("style", style);

        this.elem.appendChild(elem);

    }

    drawText(x, y, text, style){

        const elem = document.createElementNS(this.ns, "text");

       // x = this.x(x);
       // y = this.y(y);

        elem.setAttribute("x",x);
        elem.setAttribute("y",y);
        elem.setAttribute("style",style);
        
        elem.innerHTML = text;

        this.elem.appendChild(elem);
    }

    drawCircle(x, y, size, color){

        const elem = document.createElementNS(this.ns, "circle");

        elem.setAttribute("cx", x);
        elem.setAttribute("cy", y);
        elem.setAttribute("r", size);
        elem.setAttribute("fill", color);

        this.elem.appendChild(elem);

        //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    }

    drawAxes(){

        let elem = document.createElementNS(this.ns, "path");

        const valueOffset = this.y(this.graphHeight) / 4;
        const dataOffset = this.x(this.graphWidth) / this.maxData;

        const barWidth = this.x(1);
        const barHeight = this.y(2);

        const textOffsetX = this.x(13);
        const fontSize = 2.25;

        elem.setAttribute("d",`
        m ${this.x(this.gridStartX)} ${this.y(this.gridStartY) - this.y(this.graphHeight)} 
        l 0 ${this.y(this.graphHeight)}
        m 0 0
        l ${this.x(this.graphWidth)} 0

        m -${this.x(this.graphWidth)} 0
        l -${barWidth} 0  

        m  0 -${valueOffset}
        l   ${barWidth} 0  

        m  0 -${valueOffset}
        l -${barWidth} 0  

        m 0 -${valueOffset}
        l ${barWidth} 0  

        m 0 -${valueOffset}
        l -${barWidth} 0  
        
        z
        `);

        this.drawText(textOffsetX, this.y(15 + (fontSize / 2)), this.maxValue,"fill:yellow;font-family:arial;text-anchor:end;font-size:"+this.y(fontSize)+"px;");
        this.drawText(textOffsetX, this.y(30 + (fontSize / 2)), this.minValue + (this.valueOffset * 3),"fill:yellow;font-family:arial;text-anchor:end;font-size:"+this.y(fontSize)+"px;");
        this.drawText(textOffsetX, this.y(45 + (fontSize / 2)), this.minValue + (this.valueOffset * 2),"fill:yellow;font-family:arial;text-anchor:end;font-size:"+this.y(fontSize)+"px;");
        this.drawText(textOffsetX, this.y(60 + (fontSize / 2)), this.minValue + this.valueOffset,"fill:yellow;font-family:arial;text-anchor:end;font-size:"+this.y(fontSize)+"px;");
        this.drawText(textOffsetX, this.y(75 + (fontSize / 2)), this.minValue,"fill:yellow;font-family:arial;text-anchor:end;font-size:"+this.y(fontSize)+"px;");

        elem.setAttribute("style","stroke:rgba(255,255,255,0.9);stroke-width:"+this.y(0.25)+"px;");

        this.elem.appendChild(elem);

        elem = document.createElementNS(this.ns, "path");

        elem.setAttribute("style","stroke:rgba(255,255,255,0.9);stroke-width:"+this.y(0.35)+"px;");

        /*let string = `m 0 0  
        l 0 ${barHeight} 
        m 0 -${barHeight} `;




        for(let i = 0; i < this.maxData; i++){

            string += `m ${dataOffset} 0  
                       l 0 ${barHeight} 
                       m 0 -${barHeight} `;
        }

        elem.setAttribute("d", `
        m ${this.x(this.gridStartX)} ${this.y(this.gridStartY)} 
        
        ${string}
        z
        `);


        this.elem.appendChild(elem);*/
    }


    drawLine(sx, sy, ex, ey, width, color){

        const elem = document.createElementNS(this.ns, "path");

        elem.setAttribute("style", "stroke:"+color+";stroke-width:"+width+"px;");

        elem.setAttribute("d", `
        m ${sx} ${sy}
        l ${ex} ${ey}
        
        z
        `);

        this.elem.appendChild(elem);
    }

    plotData(){

        const dotSize = this.y(1);


        const dataOffset = this.graphWidth / this.maxData;

        const dataBit = this.graphHeight / this.totalValueOffset;

       // console.log("totalValueOffset = "+this.totalValueOffset);

        const startX = this.gridStartX;
        const startY = this.gridStartY;

        let yOffset = 0;

        if(this.minValue < 0){

            yOffset = Math.abs(this.minValue);
        }

        let currentData = 0;
        let nextData = 0;

        let x = 0;
        let y = 0;

        let nextX = 0;
        let nextY = 0;

        for(let i = 0; i < this.maxData; i++){

            //console.log(i);
            currentData = startY - (dataBit * (this.data[0].data[i] + yOffset));
            nextData = startY - (dataBit * (this.data[0].data[i+1] + yOffset));

            x = this.x(startX + (dataOffset * (i + 1)));
            y = this.y(currentData) + (dotSize / 2);

            nextX = this.x(startX + (dataOffset * (i + 2))) ;
            nextY = this.y(nextData) + (dotSize / 2);

            this.drawCircle(x, y, this.x(0.15), "yellow");

            if(i < this.maxData - 1){

                this.drawLine(x, y, nextX - x, nextY - y, this.x(0.2), "yellow");
            }

            //this.drawRect(this.x(startX + (dataOffset * (i + 1))) - (dotSize / 2), this.y(currentData) - (dotSize / 2), dotSize, dotSize, "fill:red");

        }
    }

    drawGraph(){

        this.drawRect(0, 0, this.x(100), this.y(100), "fill:"+this.bg);

        const quarter = 15;

        this.drawRect(this.x(this.gridStartX), this.y(15), this.x(this.graphWidth), this.y(60), "fill:rgb(12,12,12);stroke-width:1px;stroke:rgb(0,0,0);");


        this.drawRect(this.x(this.gridStartX), this.y(15), this.x(this.graphWidth), this.y(quarter), "fill:rgba(0,0,0,0.75);");

        this.drawRect(this.x(this.gridStartX), this.y(15 + (quarter * 2 )), this.x(this.graphWidth), this.y(quarter), "fill:rgba(0,0,0,0.75);");


        this.drawText(this.x(50),this.y(9),this.title,"fill:yellow;font-family:arial;text-anchor:middle;font-size:"+this.y(4.6)+"px;");

        this.drawAxes();

        this.plotData();


    }

    setMaxValue(){

        let d = 0;

        let currentData = 0;

        this.maxData = -1;

        for(let i = 0; i < this.data.length; i++){

            if(i != 0){

                if(currentData > this.maxData){
                    this.maxData = currentData;
                }
            }

            currentData = 0;

            for(let x = 0; x < this.data[i].data.length; x++){

                currentData++;

                d = this.data[i].data[x];

                if(i == 0 && x == 0){

                    this.maxValue = d;
                    this.minValue = d;

                }else if(d > this.maxValue){

                    this.maxValue = d;

                }else if(d < this.minValue){

                    this.minValue = d;

                }

            }
        }

        if(currentData > this.maxData){
            this.maxData = currentData;
        }

        if(this.maxData < 1){
            this.maxData = 1;
        }

        if(this.minValue > 0){
            this.minValue = 0;
        }

        const offset = this.maxValue - this.minValue;

        this.totalValueOffset = offset;

        this.valueOffset = offset * 0.25;
    }
}


const data = [];



let t = 0;

for(let i = 0; i < 220 + Math.ceil(Math.random() * 50); i++){

    t += -1 + (Math.random() * 2.2);

    data.push(t);
}

const testData = [
    {"name":"data - 1", "data": data}

];

const aaa = new SGraph("box-1",1200, "rgb(32,32,32)", "Frag Performance", testData);