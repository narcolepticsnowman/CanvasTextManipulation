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
            alpha: 255
        };
    }
    
    componentDidMount(){

        this.canvas = document.getElementById('canvas');

        let resize = ()=>{
            this.canvas.width = window.innerWidth*.8;
            this.canvas.height = window.innerHeight*.8;
            this.createText(this.state.text);
        };
        window.addEventListener('resize', resize);

        this.setState({text: "IyIyIyIyIy"}, resize);
    }

    handleInput(event){
        this.setState({text: event.target.value}, ()=>{
            this.createText.bind(this)(this.state.text);
        })
    }
    handleRed(event){
        this.setState({red: event.target.value}, ()=>{
            this.createText.bind(this)(this.state.text);
        })
    }
    handleGreen(event){
        this.setState({green: event.target.value}, ()=>{
            this.createText.bind(this)(this.state.text);
        })
    }
    handleBlue(event){
        this.setState({blue: event.target.value}, ()=>{
            this.createText.bind(this)(this.state.text);
        })
    }
    handleAlpha(event){
        this.setState({alpha: event.target.value}, ()=>{
            this.createText.bind(this)(this.state.text);
        })
    }


    render() {
        return (
            <div className="App">
                <div>
                    <input type="text" id="inputText" value={this.state.text} onChange={this.handleInput.bind(this)} />
                    <input type="number" id="red" value={this.state.red} onChange={this.handleRed.bind(this)} />
                    <input type="number" id="green" value={this.state.green} onChange={this.handleGreen.bind(this)} />
                    <input type="number" id="blue" value={this.state.blue} onChange={this.handleBlue.bind(this)} />
                    <input type="number" id="alpha" value={this.state.alpha} onChange={this.handleAlpha.bind(this)} />
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

        let fontSize = c;
        console.log("text height: "+b);
        ctx.font =  fontSize + "px 'Courier'";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(this.state.text, this.canvas.width/2, this.canvas.height/2);
        let textData = ctx.measureText(this.state.text);
        if(!textData.width || textData.width<1) return;
        let textTopLeftCornerY = Math.floor(this.canvas.height/2)-b;
        //imageData.data
        let imageData  = ctx.getImageData(0, textTopLeftCornerY, this.canvas.width, b*2);
        // let imageData  = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.textPixels = this.getTextPixels(imageData);
        let img =ctx.createImageData(imageData);

        console.log(this.textPixels);
        for(let y=0; y<this.textPixels.length; y++){
            if(this.textPixels[y]){
                for(let x=0; x<this.textPixels[y].length; x++){
                    if(this.textPixels[y][x]){
                        this.setPixel(img, x,y);
                    }
                }
            }
        }
        console.log(this.getTextPixels(img));
        ctx.putImageData(img, 0, textTopLeftCornerY);

    }

    getTextPixels(imageData) {
        let textPixels = [];
        let y=0;
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (i>0 && (i / 4) % imageData.width === 0) {
                y++;
                textPixels[y] = [];
            }
            if (imageData.data[i + 3] > 0) {

                textPixels[y][Math.floor((i/4 - y*imageData.width))] = imageData.data.slice(i, i+4);
            }
        }
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
