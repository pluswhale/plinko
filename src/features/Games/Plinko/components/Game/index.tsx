import ballAudio from '../../../../../assets/sounds/ball.wav';
import { Bodies, Body, Composite, Engine, Events, IEventCollision, Render, Runner, World, Vector } from 'matter-js';
import { useCallback, useEffect, useState } from 'react';
import { LinesType, MultiplierValues } from './@types';
import { PlinkoGameBody } from './components/GameBody';
import { config } from './config';
import { getMultiplierByLinesQnt, getMultiplierSound } from './config/multipliers';
import { useGameStore } from '../../../../../store/game';
import { random } from '../../../../../shared/utils/random';
import { Button } from '../../../../../shared/components/button';
import styles from './index.module.scss';
import cat from '../../../../../assets/images/kit.png';
import { Input } from '../../../../../shared/components/input/input';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppContext } from '../../../../../app/providers/AppContext';

export function Game() {
    // #region States
    const engine = Engine.create();
    const [lines] = useState<LinesType>(8);
    const inGameBallsCount = useGameStore((state) => state.gamesRunning);
    const { userData, decrementCurrentBalance, incrementCurrentBalance } = useAppContext();

    const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
    const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);

    const points = useGameStore((state) => state.points);
    const changePoints = useGameStore((state) => state.changePoints);
    const methods = useForm();

    const { pins: pinsConfig, colors, ball: ballConfig, engine: engineConfig, world: worldConfig } = config;

    const worldWidth = worldConfig.width;
    const worldHeight = worldConfig.height;
    // #endregion

    useEffect(() => {
        engine.gravity.y = engineConfig.engineGravity;
        const element = document.getElementById('plinko');
        const render = Render.create({
            element: element!,
            bounds: {
                max: {
                    y: worldHeight,
                    x: worldWidth,
                },
                min: {
                    y: 0,
                    x: 0,
                },
            },
            options: {
                background: colors.background,
                hasBounds: true,
                width: worldWidth,
                height: worldHeight,
                wireframes: false,
            },
            engine,
        });
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        return () => {
            World.clear(engine.world, true);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, [lines]);

    const pins: Body[] = [];

    for (let l = 0; l < lines; l++) {
        const linePins = pinsConfig.startPins + l;
        const lineWidth = linePins * pinsConfig.pinGap;
        for (let i = 0; i < linePins; i++) {
            const pinX = worldWidth / 2 - lineWidth / 2 + i * pinsConfig.pinGap + pinsConfig.pinGap / 2;
            const pinY = worldHeight / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;
            const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
                label: `pin-${i}`,
                render: {
                    fillStyle: '#4D506A',
                },
                isStatic: true,
            });
            pins.push(pin);
        }
    }

    function addInGameBall() {
        if (inGameBallsCount > 7) return;
        incrementInGameBallsCount();
    }

    function removeInGameBall() {
        decrementInGameBallsCount();
    }

    function bet(betValue: number) {
        addBall(betValue);
    }

    async function handleRunBet() {
        if (inGameBallsCount >= 7) return;
        bet(points);
        if (points <= 0) return;
        decrementCurrentBalance(points);
    }

    const addBall = useCallback(
        (ballValue: number) => {
            addInGameBall();
            const ballSound = new Audio(ballAudio);
            ballSound.volume = 0.2;
            ballSound.currentTime = 0;
            ballSound.play();

            const minBallX = worldWidth / 2 - (pinsConfig.pinSize + pinsConfig.pinGap);
            const maxBallX = worldWidth / 2 + (pinsConfig.pinSize + pinsConfig.pinGap);
            const ballX = random(minBallX, maxBallX);

            const ball = Bodies.circle(ballX, 20, ballConfig.ballSize, {
                restitution: 1,
                friction: 0.6,
                label: `ball-${ballValue}`,
                id: new Date().getTime(),
                frictionAir: 0.05,
                collisionFilter: {
                    group: -1,
                },
                render: {
                    fillStyle: 'red',
                    strokeStyle: 'white', // Add stroke style for the border
                    lineWidth: 3, // Specify the width of the border
                },
                isStatic: false,
            });
            Composite.add(engine.world, ball);
        },
        [lines],
    );

    const leftWall = Bodies.rectangle(
        pinsConfig.pinGap / 2 - 18, // x-coordinate
        worldHeight / 2,
        20, // Reduced width to 20 (you can adjust this value as needed)
        worldHeight,
        {
            render: {
                visible: false,
            },
            isStatic: true,
        },
    );

    const rightWall = Bodies.rectangle(
        worldWidth - pinsConfig.pinGap / 2 + 18, // x-coordinate
        worldHeight / 2,
        20, // Reduced width to 20 (you can adjust this value as needed)
        worldHeight,
        {
            render: {
                visible: false,
            },
            isStatic: true,
        },
    );

    const floor = Bodies.rectangle(worldWidth / 2, worldHeight - 40, worldWidth, 20, {
        label: 'floor',
        render: {
            fillStyle: 'white',
            visible: false,
        },
        isStatic: true,
    });

    const multipliers = getMultiplierByLinesQnt(lines);
    const multipliersBodies: Body[] = [];

    // Calculate the initial X position for the first multiplier
    const multiplierGap = worldWidth / multipliers.length - 3.5;
    let lastMultiplierX = multiplierGap / 2 + 15;

    multipliers.forEach((multiplier) => {
        const blockWidth = 40;
        const blockHeight = 40;
        const multiplierBody = Bodies.rectangle(lastMultiplierX, worldHeight - 70, blockWidth, blockHeight, {
            label: `multiplier-${multiplier.label}`,
            isStatic: true,
            render: {
                fillStyle: 'red',
                sprite: {
                    xScale: 0.35,
                    yScale: 0.35,
                    texture: multiplier.img,
                },
            },
        });

        lastMultiplierX += multiplierGap;
        multipliersBodies.push(multiplierBody);
    });

    Composite.add(engine.world, [...pins, ...multipliersBodies, leftWall, rightWall, floor]);

    let totalBets = 0;
    let totalWinnings = 0;

    // function getCurrentRTP() {
    //     if (totalBets === 0) return 1; // To avoid division by zero
    //     return totalWinnings / totalBets;
    // }

    async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
        ball.collisionFilter.group = 2;

        const ballValue = ball.label?.split('-')?.[1];
        const multiplierValue = +multiplier?.label?.split('-')?.[2] as MultiplierValues;

        const multiplierSong = new Audio(getMultiplierSound(multiplierValue));
        multiplierSong.currentTime = 0;
        multiplierSong.volume = 0.2;
        multiplierSong.play();

        if (+ballValue <= 0) return;

        const newBalance = parseFloat((+ballValue * multiplierValue).toFixed(2)); // Ensure that newBalance is a number with two decimal places
        console.log('newBalance', newBalance);

        totalBets += +ballValue;
        totalWinnings += newBalance;

        incrementCurrentBalance(newBalance);

        // Remove the ball from the world after collision with a multiplier
        Composite.remove(engine.world, ball);
        removeInGameBall();
    }

    // Define the function to steer the ball towards the center
    function steerBall(ball: Body) {
        const centerPosition = { x: worldWidth / 2, y: ball.position.y };
        const distanceFromCenter = Math.abs(ball.position.x - centerPosition.x);

        // Only steer if the ball is far enough from the center
        if (distanceFromCenter > pinsConfig.pinGap / 2) {
            // Adjusted condition for clearer steering

            // Adjust the force direction to steer the ball towards the center
            const direction = Vector.sub(centerPosition, ball.position); // Change direction to steer towards the center
            const magnitude = 0.01; // Increase magnitude to steer more clearly towards the center
            const force = Vector.mult(Vector.normalise(direction), magnitude);
            Body.applyForce(ball, ball.position, force);
        }
    }

    // Adjust the existing collision handling function to use the new steerBall function
    async function onCollideWithPin(pin: Body, ball: Body) {
        const originalFillStyle = '#4D506A';
        const originalStrokeStyle = 'none';
        const originalLineWidth = 0;

        pin.render.fillStyle = 'white';
        pin.render.strokeStyle = 'white'; // Initial stroke color
        pin.render.lineWidth = 3; // Stroke width

        const animationDuration = 1000;
        const startTime = performance.now();

        function animate(time: number) {
            const elapsedTime = time - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);

            pin.render.fillStyle = `rgba(255, 255, 255, ${1 - progress})`;

            // Calculate the stroke color transition
            const r = Math.round(255 * (1 - progress) + 77 * progress); // Assuming original stroke color is rgb(77, 80, 106)
            const g = Math.round(255 * (1 - progress) + 80 * progress);
            const b = Math.round(255 * (1 - progress) + 106 * progress);
            pin.render.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                pin.render.fillStyle = originalFillStyle;
                pin.render.strokeStyle = originalStrokeStyle;
                pin.render.lineWidth = originalLineWidth;
            }
        }

        requestAnimationFrame(animate);

        steerBall(ball); // Call the new steerBall function to steer the ball towards the center
    }

    async function onBodyCollision(event: IEventCollision<Engine>) {
        const pairs = event.pairs;
        for (const pair of pairs) {
            const { bodyA, bodyB } = pair;

            if (bodyA.label.includes('pin') && bodyB.label.includes('ball')) {
                await onCollideWithPin(bodyA, bodyB);
            } else if (bodyB.label.includes('pin') && bodyA.label.includes('ball')) {
                await onCollideWithPin(bodyB, bodyA);
            }

            if (bodyB.label.includes('ball') && bodyA.label.includes('multiplier')) {
                await onCollideWithMultiplier(bodyB, bodyA);
            } else if (bodyA.label.includes('ball') && bodyB.label.includes('multiplier')) {
                await onCollideWithMultiplier(bodyA, bodyB);
            }
        }
    }

    Events.on(engine, 'collisionStart', onBodyCollision);

    // Points input handling
    const onChangePoints = (value: string) => {
        if (value === '') {
            changePoints('0');
        }

        const isNumeric = /^\d+$/.test(value);
        if (!isNumeric) {
            return; // Exit the function if the input is not a number
        }

        if (userData?.points && +value > userData?.points) {
            changePoints(String(userData?.points));
        }

        changePoints(value);
    };

    return (
        <div className="flex h-fit flex-col items-center justify-center md:flex-row">
            <div className="flex flex-1 items-center justify-center">
                <PlinkoGameBody />
            </div>
            <div className={styles.game__score}>
                <div className={styles.game__score_count}>
                    <img className={styles.game__score_img} src={cat} />
                    <FormProvider {...methods}>
                        <Input value={String(points)} onChange={onChangePoints} name={'points'} />
                    </FormProvider>
                </div>
                <Button
                    isDisabled={points <= 0 || points > userData?.points}
                    stylesForTexts={{ main: { fontSize: '32px' }, sub: {} }}
                    fontSize="60px"
                    backgroundImage={
                        points <= 0 || points > userData?.points ? 'linear-gradient(#C0C0C0, #808080)' : undefined
                    }
                    fontFamily="Montserrat, sans-serif"
                    width="40%"
                    onClick={handleRunBet}
                    text="GO"
                    backgroundColor={points <= 0 ? 'gray' : undefined}
                />
            </div>
        </div>
    );
}

