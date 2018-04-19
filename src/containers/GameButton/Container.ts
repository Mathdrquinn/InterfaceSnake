import { connect } from 'react-redux';
import { ISnake } from '../../reducers/index';
import GameButton from './Component';

export default connect(
    ({ snake }: { snake: ISnake }): { on: boolean } => ({ on: snake.active }),
    (dispatch: any): { powerOff: () => any, powerOn: () => any } => ({
        powerOff: (): any => dispatch({ type: 'OFF' }),
        powerOn: (): any => dispatch({ type: 'ON' }),
    }),
)(GameButton);
