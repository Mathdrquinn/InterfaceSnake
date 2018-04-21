import { connect } from 'react-redux';
import { IState } from '../../reducers/index';
import GameButton, { IGameButtonProps } from './Component';

interface IConnectStateProps {
    on: boolean,
}
interface IConnectDispatchProps {
    powerOff: () => any,
    powerOn: () => any
}
export default connect(
    ({ snake }: IState): IConnectStateProps => ({ on: snake.active }),
    (dispatch: any): IConnectDispatchProps => ({
        powerOff: (): any => dispatch({ type: 'OFF' }),
        powerOn: (): any => dispatch({ type: 'ON' }),
    }),
    (stateProps: IConnectStateProps, dispatchProps: IConnectDispatchProps): IGameButtonProps => ({
        ...stateProps,
        ...dispatchProps,
    })
)(GameButton);
