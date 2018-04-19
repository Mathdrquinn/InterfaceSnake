import { combineReducers } from 'redux'

const MAP_SIZE: number = 10;
const PIXEL_SIZE: number = 8;
const SNAKE_START: string[] = ["20", "10", "00"];
const APPLE_START_POSITON: string = "50";
interface IAction { type: string, [key: string]: any }

/*
 * SNAKE
 */
export enum Direction { UP = "UP", DOWN = "DOWN", LEFT = "LEFT", RIGHT = "RIGHT" }
export interface IPosition { x: number, y: number }
export interface ISnakeLinks extends Array<string> { }
export interface IDirectionMoves extends Array<Direction> { }
export interface IApple { position: string, color: string }
export interface ISnake {
    active: boolean,
    color: string,
    direction: IDirectionMoves,
    links: ISnakeLinks,
    apple: IApple
}
const newSnakeHead = (links: ISnakeLinks, direction: Direction): string => {
    const X: number = 0;
    const Y: number = 1;
    const safeIncrement = ((modulo: number) => (num: number) => ((num + 1) % modulo))(MAP_SIZE);
    const safeDecrement = ((modulo: number) => (num: number) => {
        const decNum = num - 1;
        if (num >= 0) {
            return Math.abs((decNum) % modulo);
        }
        return modulo - 1;
    })(MAP_SIZE);
    const moveUp = (position: string): string => (position[X] + safeIncrement(Number(position[Y])));
    const moveDown = (position: string): string => (position[X] + safeDecrement(Number(position[Y])));
    const moveLeft = (position: string): string => (safeIncrement(Number(position[X])) + position[Y]);
    const moveRight = (position: string): string => (safeIncrement(Number(position[X])) + position[Y]);
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

    console.info('move head', head, MAP_SIZE)
    return head;
}
const DEFAULT_SNAKE_STATE: ISnake = {
    active: true,
    apple: { position: APPLE_START_POSITON, color: 'red' },
    color: 'black',
    direction: [Direction.RIGHT],
    links: SNAKE_START,
};
const moveApple = (links: string[], { grid }: IMap): string => {
    const openGridUnits: string[] = Object.keys(grid)
        .filter(gridKey => links.indexOf(gridKey) === -1);
    const randomGridIndex: number = Math.floor(Math.random() * openGridUnits.length);
    console.info('new APPLE!', openGridUnits[randomGridIndex])
    return openGridUnits[randomGridIndex];
}
const snakeReducer = (state: ISnake = DEFAULT_SNAKE_STATE, action: IAction): ISnake => {
    switch(action.type) {
        case 'NEXTFRAME': {
            const { apple, direction, links } = state;

            let newLinks: ISnakeLinks;
            let newApple: IApple;
            const head = newSnakeHead(links, direction[0]);
            if (head === apple.position) {
                newLinks = [head, ...links];
                newApple = { ...apple, position: moveApple(newLinks, action.map) }
            } else {
                newLinks = [head, ...links.slice(0, links.length - 1)]
                newApple = { ...apple };
            }

            let newDirection: IDirectionMoves;
            if (direction.length > 1) {
                newDirection = direction.slice(1);
            } else {
                newDirection = direction.slice();
            }


            return { ...state, apple: newApple, direction: newDirection, links: newLinks };
        }
        case 'TURN': {
            return { ...state, direction: [ ...state.direction, action.direction ] }
        }
        case 'ON': {
            return { ...state, active: true };
        }
        case 'OFF': {
            return { ...state, active: false };
        }
        default: {
            return { ...state };
        }
    }
}

/*
 * Map
 */

export interface IGrid {
    [key: string]: IPosition
}
const generateMap = (size: number = MAP_SIZE, pixels: number): IGrid => {
    const mapCombination: number[] = [];
    const map: IGrid = {};
    while (size--) {
        mapCombination.push(size);
    }

    mapCombination.forEach((numX, index) => {
        mapCombination.forEach((numY) => {
            const key = numX + '' + numY;
            map[key] = {
                x: numX,
                y: numY,
            };
        })
    });
    return map;
}
export interface IMap { grid: IGrid, pixelSize: number, size: number };
const mapReducer = (state: IMap = { size: MAP_SIZE, grid: generateMap(MAP_SIZE, PIXEL_SIZE), pixelSize: PIXEL_SIZE }, action: IAction): IMap => {
    switch(action.type) {
        case "SIZE": {
            return { ...state, size: action.size, grid: generateMap(action.size, state.pixelSize) };
        }
        default: {
            return state;
        }
    }
}

export default combineReducers({
    map: mapReducer,
    snake: snakeReducer,
})