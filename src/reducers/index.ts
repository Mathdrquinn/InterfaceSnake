import { combineReducers } from 'redux'

export interface IAction { type: string, [key: string]: any }

/*
 * SNAKE
 */

// TYPES
export interface IPosition { X: number, Y: number }
export interface IMapPixel {
    position: IPosition,
    color: string,
}
export enum Direction { UP = "UP", DOWN = "DOWN", LEFT = "LEFT", RIGHT = "RIGHT" }
export interface ISnakeLinks extends Array<IPosition> { }
export interface IDirectionMoves extends Array<Direction> { }
export interface ISnake {
    active: boolean,
    color: string,
    direction: IDirectionMoves,
    links: ISnakeLinks,
    apple: IMapPixel,
    pixelSize: number,
    size: number
}

// DEFAULTS
const MAP_SIZE: number = 50;
const PIXEL_SIZE: number = 8;
const SNAKE_START: ISnakeLinks = [{ X: 2, Y: 0 }, { X: 1, Y: 0 }, { X: 0, Y: 0 }];
const APPLE_START_POSITON: IPosition = { X: 5, Y: 0 };

// HELPERS
const newSnakeHead = (links: ISnakeLinks, direction: Direction): IPosition => {
    const safeIncrement = ((modulo: number) => (num: number) => ((num + 1) % modulo))(MAP_SIZE);
    const safeDecrement = ((modulo: number) => (num: number) => {
        const decNum = num - 1;
        if (decNum >= 0) {
            return decNum;
        }
        return modulo - 1;
    })(MAP_SIZE);
    const moveUp = (position: IPosition): IPosition => ({ ...position, Y: safeIncrement(position.Y) });
    const moveDown = (position: IPosition): IPosition => ({ ...position, Y: safeDecrement(position.Y) });
    const moveLeft = (position: IPosition): IPosition => ({ ...position, X: safeDecrement(position.X) });
    const moveRight = (position: IPosition): IPosition => ({ ...position, X: safeIncrement(position.X) });
    let head: IPosition = links[0];
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

    console.info('move head', head)
    return head;
}
const DEFAULT_SNAKE_STATE: ISnake = {
    active: true,
    apple: { position: APPLE_START_POSITON, color: 'red' },
    color: 'black',
    direction: [Direction.RIGHT],
    links: SNAKE_START,
    pixelSize: PIXEL_SIZE,
    size: MAP_SIZE,
};
const moveApple = (links: ISnakeLinks, size: number): IPosition => {
    const map: number[] = Array.apply(null, {length: size}).map(Number.call, Number);
    const unX: number[] = links.map(p => p.X).filter((x, i, s) => s.indexOf(x) === i);
    const unY: number[] = links.map(p => p.Y).filter((y, i, s) => s.indexOf(y) === i);

    //     const randomGridIndex: number = Math.floor(Math.random() * openGridUnits.length);
    return {
        X: map.slice().filter(x => unX.indexOf(x) === -1)[0],
        Y: map.slice().filter(y => unY.indexOf(y) === -1)[0],
    };
}
const snakeReducer = (state: ISnake = DEFAULT_SNAKE_STATE, action: IAction): ISnake => {
    switch(action.type) {
        case 'NEXTFRAME': {
            const { apple, direction, links } = state;

            let newLinks: ISnakeLinks;
            let newApple: IMapPixel;
            const head: IPosition = newSnakeHead(links, direction[0]);
            if (JSON.stringify(head) === JSON.stringify(apple.position)) {
                newLinks = [head, ...links];
                newApple = { ...apple, position: moveApple(newLinks, state.size) }
            } else {
                newLinks = [head, ...links.slice(0, links.length - 1)]
                newApple = { ...apple };
            }

            if (newLinks.slice(1).indexOf(head) !== -1) {
                // GAME OVER
                return { ...DEFAULT_SNAKE_STATE };
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

export interface IState {
    snake: ISnake,
}
export default combineReducers({
    snake: snakeReducer,
})