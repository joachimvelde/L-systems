import React from 'react';
import logo from './logo.svg';
import './App.css';
import Rules from './Rules'

function App() {
    return (
        <div className="App">
            <h1>L-systems</h1>
            <canvas></canvas>
            <div className="seed-box">
                <h2>Seed</h2>
                <p>
                    An L-system need a starting seed to expand from. Click "Grow" to expand
                    the current seed once.
                </p>
                <input key="seed" placeholder="Enter seed"/>
                <button>Grow</button>
            </div>
            <Rules></Rules>
        </div>
    );
}

export default App;
