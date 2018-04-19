import * as React from 'react';

export interface IGameButtonProps {
    on: boolean,
    powerOff: () => any,
    powerOn: () => any,
}

const GameButton: React.SFC<IGameButtonProps> = ({ on, powerOn, powerOff }) => {
    const flipPower = () => on ? powerOff() : powerOn();
    return (
        <button onClick={flipPower}>{on ? 'PAUSE' : 'PLAY'}</button>
    );
}

export default GameButton;