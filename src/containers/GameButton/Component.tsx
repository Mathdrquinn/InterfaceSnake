import * as React from 'react';

export interface IGameButtonProps {
    on: boolean,
    nextFrame: () => any,
    powerOff: () => any,
    powerOn: () => any,
}

const GameButton: React.SFC<IGameButtonProps> = ({ on, nextFrame, powerOn, powerOff }) => {
    const flipPower = () => on ? powerOff() : powerOn();
    return (
        <div>
            <button onClick={flipPower}>{on ? 'PAUSE' : 'PLAY'}</button>
            <button onClick={nextFrame}>Next Frame</button>
        </div>
    );
}

export default GameButton;