import {connect} from 'react-redux';
import { IApple } from "../../reducers";
import {Direction, IAction, ISnake} from './../../reducers/index';
import Game, { IColoredSnakeMap, IGameProps } from './Component';

export interface IStateToProps {
    snake: ISnake;
}
export interface IConnectStateProps {
    active: boolean,
    apple: IApple,
    pixelSize: number,
    size: number,
    snakeLinks: IColoredSnakeMap,
}
export interface IConnectDispatchProps {
    nextFrame: () => any,
    turn: (d: Direction) => any,
}
export default connect(
    (state: IStateToProps): IConnectStateProps => {
        const { snake } = state;
        const { active, apple, color, pixelSize, size, links } = snake;
        return {
            active,
            apple,
            pixelSize,
            size,
            snakeLinks: links.map(link => ({ position: {...link}, color })),
        };
    },
    (dispatch): IConnectDispatchProps => ({
        nextFrame: (): IAction => dispatch({ type: 'NEXTFRAME' }),
        turn: (direction: Direction): { direction: Direction, type: string } => dispatch({ type: 'TURN', direction })
    }),
    (stateProps: IConnectStateProps, dispatchProps: IConnectDispatchProps): IGameProps => ({
        ...stateProps,
        ...dispatchProps,
    })
)(Game);
