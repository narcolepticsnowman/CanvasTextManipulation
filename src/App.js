import React, {Component} from 'react';
import './App.css';

/**
 * https://codepen.io/rachsmith/pen/LEyLON?editors=0010
 */
class App extends Component {

    constructor(props){
        super(props);
        this.state={
            text: '',
            red: 0,
            green: 0,
            blue: 0,
            alpha: 255,
            textPixels: []
        };
    }
    
    componentDidMount(){

        this.canvas = document.getElementById('canvas');

        let resize = ()=>{
            this.setState({textPixels: []}, ()=>{
                this.canvas.width = window.innerWidth*.8;
                this.canvas.height = window.innerHeight*.8;
                this.createText(this.state.text);
            });
        };
        window.addEventListener('resize', resize);

        this.setState({text: "IyIyIyIyIy"}, resize);
    }

    handleChange(prop){
        return (event)=>{
            let newState = {};
            newState[prop] = event.target.value;
            this.setState(newState, this.createText.bind(this))
        }
    }

    render() {
        return (
            <div className="App">
                <div>
                    <input type="text" id="inputText" value={this.state.text} onChange={this.handleChange("text")} />
                    <input type="number" id="red" value={this.state.red} onChange={this.handleChange("red")} />
                    <input type="number" id="green" value={this.state.green} onChange={this.handleChange("green")} />
                    <input type="number" id="blue" value={this.state.blue} onChange={this.handleChange("blue")} />
                    <input type="number" id="alpha" value={this.state.alpha} onChange={this.handleChange("alpha")} />
                </div>
                <canvas id="canvas"/>
            </div>
        );
    }

    createText() {

        /*
        font size set to 100
        10 chars
        600 total width (measureText.width)
        100^2 - 60^2 = 80^2

        60^2+80^2=100^2
        A _a_
         |\ -|
        b| \c|
         |-_\|
        C   B

        A=36.9 (0.644026494 radians)
        B=53.1

        Do the same with 50 font size and found same ratio

        Since we know the angles of the right triangle, we can calculate the hypotenuse, aka font size like so:
        c=a/sin(A)

        This gives us the exact font size to use in order to fit the text exactly to the width of the screen

     */
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if(this.state.text<1) return;

        let a = Math.floor(this.canvas.width/this.state.text.length);
        let c = Math.floor(a/Math.sin(0.644026494));
        let b = Math.floor(Math.sqrt(c*c - a*a));

        ctx.font =  c + "px 'Courier'";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(this.state.text, this.canvas.width/2, this.canvas.height/2);
        let textData = ctx.measureText(this.state.text);
        if(!textData.width || textData.width<1) return;
        let textTopLeftCornerY = Math.floor(this.canvas.height/2)-b;
        let imageData  = ctx.getImageData(0, textTopLeftCornerY, this.canvas.width, b*2);
        this.textPixels = this.getTextPixels(imageData);
        let img =ctx.createImageData(imageData);



        for(let y in this.textPixels){
            for(let x in this.textPixels[y]){
                this.setPixel(img, parseInt(x), parseInt(y));
            }
        }
        ctx.putImageData(img, 0, textTopLeftCornerY);

    }

    getTextPixels(imageData) {
        if(this.state.textPixels.length>0){
            return this.state.textPixels;
        }
        let textPixels = [];
        let y=0;
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (i>0 && (i / 4) % imageData.width === 0) {
                y++;
            }
            if (imageData.data[i + 3] > 0) {
                if(!textPixels[y]){
                    textPixels[y]=[];
                }
                textPixels[y][Math.floor((i/4 - y*imageData.width))] = imageData.data.slice(i, i+4);
            }
        }
        this.setState({textPixels: textPixels});
        return textPixels;
    }

    setPixel(imageData,x,y){
        let thisPixel = (imageData.width * y + x)*4;
        imageData.data[thisPixel]=this.state.red;
        imageData.data[thisPixel + 1]=this.state.green;
        imageData.data[thisPixel + 2]=this.state.blue;
        imageData.data[thisPixel + 3]=this.state.alpha;
    }
}

export default App;
