import {connect} from 'react-redux';
import { Direction, IMap, IPosition, ISnake } from './../../reducers/index';
import Game, { IGameProps, ISnakeMap } from './Component';

export interface IStateToProps {
    map: IMap;
    snake: ISnake;
}
export interface IConnectStateProps {
    active: boolean,
    map: IMap,
    pixelSize: number,
    size: number,
    snakeMap: ISnakeMap
}
export interface IConnectDispatchProps {
    nextFrame: (map: IMap) => any,
    turn: (d: Direction) => any,
}
export default connect(
    (state: IStateToProps): IConnectStateProps => {
        const { map, snake } = state;
        const { grid, pixelSize, size } = map;
        return {
            active: snake.active,
            map,
            pixelSize,
            size,
            snakeMap: Object
                .keys(grid)
                .map((gridKey: string): { gridKey: string, gridUnit: IPosition } => ({ gridKey, gridUnit: grid[gridKey]}))
                .reduce((snakeMap: ISnakeMap, { gridKey, gridUnit }) => {
                    return {
                        ...snakeMap,
                        [gridKey]: {
                            ...gridUnit,
                            color: snake.links.indexOf(gridKey) !== -1 ? snake.color
                                : gridKey === snake.apple.position ? snake.apple.color
                                    : null,
                        }
                    }
                }, {}),
        };
    },
    (dispatch): IConnectDispatchProps => ({
        nextFrame: (map: IMap): { map: IMap, type: string } => dispatch({ map, type: 'NEXTFRAME' }),
        turn: (direction: Direction): { direction: Direction, type: string } => dispatch({ type: 'TURN', direction })
    }),
    ({ active, map, pixelSize, size, snakeMap }: IConnectStateProps, dispatchProps): IGameProps => ({
        ...dispatchProps,
        active,
        nextFrame: () => dispatchProps.nextFrame(map),
        pixelSize,
        size,
        snakeMap,
    })
)(Game);
