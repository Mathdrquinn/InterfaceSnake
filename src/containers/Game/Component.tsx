import * as React from 'react';
import {Direction, IMapPixel } from "./../../reducers";

const CANVAS_ID: string = "Game";

export interface IColoredSnakeMap extends Array<IMapPixel> { }
export interface IGameProps {
    active: boolean,
    apple: IMapPixel,
    nextFrame: () => any,
    pixelSize: number,
    size: number,
    snakeLinks: IColoredSnakeMap,
    turn: (direction: Direction) => any,
}

export default class Game extends React.Component<IGameProps> {
    private canvas?: HTMLCanvasElement;

    public componentDidMount(): void {
        this.addEventListeners();
        this.props.nextFrame();
    }

    public componentDidUpdate(): void {
        this.draw();
        setTimeout(() => this.props.nextFrame(), 200);
    }

    public shouldComponentUpdate(nextProps: IGameProps) {
        const oldMap = this.props.snakeLinks;
        const newMap = nextProps.snakeLinks;
        return JSON.stringify(oldMap) !== JSON.stringify(newMap);
    }

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
                const { apple, snakeLinks, pixelSize } = this.props;
                ctx.fillStyle = apple.color;
                ctx.fillRect(apple.position.X * pixelSize, apple.position.Y * pixelSize, pixelSize, pixelSize);
                snakeLinks
                    .forEach((link): void => {
                        ctx.fillStyle = link.color;
                        ctx.fillRect(link.position.X * pixelSize, link.position.Y * pixelSize, pixelSize, pixelSize);
                    });
            }
        }
    }
}
