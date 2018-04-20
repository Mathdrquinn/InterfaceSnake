import { connect } from 'react-redux';
import {IAction, IState} from '../../reducers/index';
import GameButton, { IGameButtonProps } from './Component';

interface IConnectStateProps {
    on: boolean,
}
interface IConnectDispatchProps {
    nextFrame: () => any,
    powerOff: () => any,
    powerOn: () => any
}
export default connect(
    ({ snake }: IState): IConnectStateProps => ({ on: snake.active }),
    (dispatch: any): IConnectDispatchProps => ({
        nextFrame: (): IAction => dispatch({ type: 'NEXTFRAME' }),
        powerOff: (): any => dispatch({ type: 'OFF' }),
        powerOn: (): any => dispatch({ type: 'ON' }),
    }),
    (stateProps: IConnectStateProps, dispatchProps: IConnectDispatchProps): IGameButtonProps => ({
        ...stateProps,
        ...dispatchProps,
    })
)(GameButton);
