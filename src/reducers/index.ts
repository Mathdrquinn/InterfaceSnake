import { combineReducers } from 'redux'

const MAP_SIZE: number = 5;
const PIXEL_SIZE: number = 8;
interface IAction { type: string, [key: string]: any }

/*
 * SNAKE
 */
export enum Direction { UP = "UP", DOWN = "DOWN", LEFT = "LEFT", RIGHT = "RIGHT" }
export interface IPosition { x: number, y: number }
export interface ISnakeLinks extends Array<string> { }
export interface ISnake { links: ISnakeLinks, direction: Direction }

const moveSnake = (links: ISnakeLinks, direction: Direction) => {
    const X: number = 0;
    const Y: number = 1;
    const moveUp = (position: string): string => (position[X] + (Number(position[Y]) + 1));
    const moveDown = (position: string): string => (position[X] + (Number(position[Y]) - 1));
    const moveLeft = (position: string): string => ((Number(position[X]) + 1) + position[Y]);
    const moveRight = (position: string): string => ((Number(position[X]) - 1) + position[Y]);
    let head = links[0];
    switch(direction) {
        case Direction.UP: {
            head = moveUp(head)
            break;
        }
        case Direction.DOWN: {
            head = moveDown(head)
            break;
        }
        case Direction.LEFT: {
            head = moveLeft(head)
            break;
        }
        case Direction.RIGHT: {
            head = moveRight(head)
            break;
        }
    }

    return [head, ...links.slice(0, links.length - 1)];
}
const snakeReducer = (state: ISnake = { links: ['00'], direction: Direction.RIGHT }, action: IAction): ISnake => {
    switch(action.type) {
        case Direction.UP: {
            return { ...state, links: moveSnake(state.links, Direction.UP), direction: Direction.UP }
        }
        case Direction.DOWN: {
            return { ...state, links: moveSnake(state.links, Direction.DOWN), direction: Direction.DOWN }
        }
        case Direction.LEFT: {
            return { ...state, links: moveSnake(state.links, Direction.LEFT), direction: Direction.LEFT }
        }
        case Direction.RIGHT: {
            return { ...state, links: moveSnake(state.links, Direction.RIGHT), direction: Direction.RIGHT }
        }
        default: {
            return state;
        }
    }
}

/*
 * Map
 */

export interface IMapPixel extends IPosition {
    X0Y0: IPosition,
    X0Y1: IPosition,
    X1Y0: IPosition,
    X1Y1: IPosition
}
export interface IMap {
    [key: string]: IMapPixel
}
const generateMap = (size: number = MAP_SIZE, pixels: number): IMap => {
    const mapCombination: number[] = [];
    const map: IMap = {};
    while (size--) {
        mapCombination.push(size);
    }

    mapCombination.forEach((numX, index) => {
        mapCombination.forEach((numY) => {
            const key = numX + '' + numY;
            map[key] = {
                X0Y0: {
                    x: numX * pixels,
                    y: numY * pixels,
                },
                X0Y1: {
                    x: numX * pixels,
                    y: (numY + 1) * pixels,
                },
                X1Y0: {
                    x: (numX + 1) * pixels,
                    y: numY * pixels,
                },
                X1Y1: {
                    x: (numX + 1) * pixels,
                    y: (numY + 1) * pixels,
                },
                x: numX,
                y: numY,
            };
        })
    });
    return map;
}
interface IMapState { size: number, grid: IMap, pixels: number };
const mapReducer = (state: IMapState = { size: MAP_SIZE, grid: generateMap(MAP_SIZE, PIXEL_SIZE), pixels: PIXEL_SIZE }, action: IAction): IMapState => {
    switch(action.type) {
        case "SIZE": {
            return { ...state, size: action.size, grid: generateMap(action.size, state.pixels) };
        }
        default: {
            return state;
        }
    }
}

/*
 * Apple
 */
//
// const SNAKE_START_POSITON: IPosition = { x: 1, y: 1 };
// interface IAppleState { position: IPosition, color: string }
// // const moveApple = (oldApple: IPosition, snake: ISnake, map: IMap) => ({})
// const appleReducer = (state: IAppleState = { color: 'red', position: SNAKE_START_POSITON }, action: IAction): IAppleState => {
//     switch(action.type) {
//         case "MOVE": {
//             return state;
//         }
//         default: {
//             return state;
//         }
//     }
// }

export default combineReducers({
    // apple: appleReducer,
    map: mapReducer,
    snake: snakeReducer,
})