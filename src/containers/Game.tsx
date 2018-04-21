import * as React from 'react';
import {connect} from 'react-redux';
import { Direction, IMap, IMapPixel, ISnake } from './../reducers';

const CANVAS_SIZE: string = "500px";
const CANVAS_ID: string = "Game";

class Game extends React.Component<{ direction: Direction, snakeMap: ISnakeMap, nextFrame: (d: Direction) => any }> {
    private canvas?: HTMLCanvasElement;

    // private draw():void {
    //     const { map, snake } = this.props;
    // }
    //
    public componentDidMount(): void {
        if (this.canvas && this.canvas.getContext) {
            const ctx = this.canvas.getContext('2d');

            if (ctx) {
                // ctx.fillRect(25, 25, 100, 100);
                // ctx.clearRect(45, 45, 60, 60);
                ctx.strokeRect(50, 50, 50, 50);
            }
        }
    }

    public render() {
        return (
            <div>
                <canvas
                    id={CANVAS_ID}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    style={{ border: "1px solid black" }}
                    ref={(ref) => this.canvas = ref || undefined}
                />
                <code style={{textAlign: 'left'}}>
                    <pre>{JSON.stringify(this.props, null, '  ')}</pre>
                </code>
            </div>
        )
    }
}

interface ISnakeMapPixel extends IMapPixel {
    hasSnake?: boolean;
}
interface ISnakeMap {
    [key: string]: ISnakeMapPixel;
}
interface IStateToProps {
    map: IMap;
    snake: ISnake;
}
export default connect(
    (state: IStateToProps): { snakeMap: ISnakeMap, direction: Direction } => {
        const { map, snake } = state;
        const { grid } = map;
        return {
            direction: snake.direction,
            snakeMap: Object
                .keys(grid)
                .map((pixelKey: string): { pixelKey: string, pixel: IMapPixel } => ({ pixelKey, pixel: grid[pixelKey]}))
                .reduce((snakeMap: ISnakeMap, { pixelKey, pixel }) => {
                    return {
                        ...snakeMap,
                        [pixelKey]: {
                            ...pixel,
                            hasSnake: snake.links.indexOf(pixelKey) !== -1,
                        }
                    }
                }, {}),
        };
    },
    (dispatch): { nextFrame: (d: Direction) => any } => ({
        nextFrame: (direction: Direction):any => dispatch({ type: direction })
    })
)(Game);
