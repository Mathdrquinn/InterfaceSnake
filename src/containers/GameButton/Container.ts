import { connect } from 'react-redux';
import {IMap, IState} from '../../reducers/index';
import GameButton, { IGameButtonProps } from './Component';

interface IConnectStateProps {
    on: boolean,
    map: IMap
}
interface IConnectDispatchProps {
    nextFrame: (map: IMap) => any,
    powerOff: () => any,
    powerOn: () => any
}
export default connect(
    ({ snake, map }: IState): IConnectStateProps => ({ on: snake.active, map }),
    (dispatch: any): IConnectDispatchProps => ({
        nextFrame: (map: IMap): { map: IMap, type: string } => dispatch({ map, type: 'NEXTFRAME' }),
        powerOff: (): any => dispatch({ type: 'OFF' }),
        powerOn: (): any => dispatch({ type: 'ON' }),
    }),
    ({ on, map }: IConnectStateProps, { nextFrame, powerOff, powerOn }: IConnectDispatchProps): IGameButtonProps => ({
        nextFrame: () => nextFrame(map),
        on,
        powerOff,
        powerOn,
    })
)(GameButton);
