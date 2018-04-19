import * as React from 'react';
import { Direction, IPosition } from "./../../reducers";

const CANVAS_ID: string = "Game";

export interface ISnakeMapPixel extends IPosition {
    color: string;
}
export interface ISnakeMap {
    [key: string]: ISnakeMapPixel;
}
export interface IGameProps {
    active: boolean,
    nextFrame: () => any,
    pixelSize: number,
    size: number,
    snakeMap: ISnakeMap,
    turn: (direction: Direction) => any,
}

export default class Game extends React.Component<IGameProps> {
    private canvas?: HTMLCanvasElement;

    public componentDidMount(): void {
        this.draw();
        this.nextFrame();
    }

    public componentDidUpdate(): void {
        this.addEventListeners();
        this.draw();
        if (this.props.active) {
            this.nextFrame();
        }
    }

    // public shouldComponentUpdate() {
    //     // use this to fix stuff!
    // }

    public render() {
        const canvasSize = this.props.size * this.props.pixelSize;
        return (
            <canvas
                id={CANVAS_ID}
                width={canvasSize}
                height={canvasSize}
                style={{ border: "1px solid black" }}
                ref={(ref) => this.canvas = ref || undefined}
            />
        )
    }

    private addEventListeners(): void {
        window.addEventListener('keydown', ({ code }) => {
            switch(code) {
                case 'ArrowLeft': {
                    this.props.turn(Direction.LEFT);
                    break;
                }
                case 'ArrowRight': {
                    this.props.turn(Direction.RIGHT);
                    break;
                }
                case 'ArrowUp': {
                    this.props.turn(Direction.DOWN);
                    break;
                }
                case 'ArrowDown': {
                    this.props.turn(Direction.UP);
                    break;
                }
            }
        });
    }

    private draw():void {
        if (this.canvas && this.canvas.getContext) {
            const ctx = this.canvas.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const { snakeMap, pixelSize } = this.props;
                Object.keys(snakeMap)
                    .map(gridKey => snakeMap[gridKey])
                    .filter(gridUnit => gridUnit.color)
                    .forEach((gridUnit): void => {
                        ctx.fillStyle = gridUnit.color;
                        ctx.fillRect(gridUnit.x * pixelSize, gridUnit.y * pixelSize, pixelSize, pixelSize);
                    });
            }
        }
    }

    private nextFrame(): void {
        setTimeout(() => this.props.nextFrame(), 1000);
    }
}
