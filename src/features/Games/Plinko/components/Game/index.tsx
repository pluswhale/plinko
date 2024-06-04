import ballAudio from '../../../../../assets/sounds/ball.wav';
import { Bodies, Body, Composite, Engine, Events, IEventCollision, Render, Runner, World } from 'matter-js';
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
        if (inGameBallsCount > 15) return;
        incrementInGameBallsCount();
    }

    function removeInGameBall() {
        decrementInGameBallsCount();
    }

    function bet(betValue: number) {
        addBall(betValue);
    }

    async function handleRunBet() {
        if (inGameBallsCount >= 15) return;
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
        pinsConfig.pinGap / 2 - 45, // x-coordinate
        worldHeight / 2,
        20, // Reduced width to 20 (you can adjust this value as needed)
        worldHeight,
        {
            render: {
                visible: true,
            },
            isStatic: true,
        },
    );

    const rightWall = Bodies.rectangle(
        worldWidth - pinsConfig.pinGap / 2 + 45, // x-coordinate
        worldHeight / 2,
        20, // Reduced width to 20 (you can adjust this value as needed)
        worldHeight,
        {
            render: {
                visible: true,
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
    const multiplierGap = worldWidth / multipliers.length;
    let lastMultiplierX = multiplierGap / 2;

    multipliers.forEach((multiplier) => {
        const blockWidth = 40;
        const blockHeight = 40;
        const multiplierBody = Bodies.rectangle(lastMultiplierX, worldHeight - 70, blockWidth, blockHeight, {
            label: multiplier.label,
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

    async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
        ball.collisionFilter.group = 2;
        World.remove(engine.world, ball);
        removeInGameBall();
        const ballValue = ball.label.split('-')[1];
        const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues;

        const multiplierSong = new Audio(getMultiplierSound(multiplierValue));
        multiplierSong.currentTime = 0;
        multiplierSong.volume = 0.2;
        multiplierSong.play();

        if (+ballValue <= 0) return;

        const newBalance = parseFloat((+ballValue * multiplierValue).toFixed(2)); // Ensure that newBalance is a number with two decimal places
        console.log('newBalance', newBalance);

        incrementCurrentBalance(newBalance);
    }

    async function onCollideWithPin(pin: Body) {
        const originalFillStyle = '#4D506A';
        const originalStrokeStyle = 'none';
        const originalLineWidth = 0;

        pin.render.fillStyle = 'white';
        pin.render.strokeStyle = 'white'; // Initial stroke color
        pin.render.lineWidth = 3; // Stroke width

        // const hitSound = new Audio(ballAudio);
        // hitSound.volume = 0.5;
        // hitSound.play();

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
    }

    async function onBodyCollision(event: IEventCollision<Engine>) {
        const pairs = event.pairs;
        for (const pair of pairs) {
            const { bodyA, bodyB } = pair;

            if (bodyA.label.includes('pin')) {
                await onCollideWithPin(bodyA);
            }

            if (bodyB.label.includes('ball') && bodyA.label.includes('block')) {
                await onCollideWithMultiplier(bodyB, bodyA);
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

        if (userData?.unclaimedTokens && +value > userData?.unclaimedTokens) {
            changePoints(String(userData?.unclaimedTokens));
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
                    isDisabled={points <= 0}
                    stylesForTexts={{ main: { fontSize: '32px' }, sub: {} }}
                    fontSize="60px"
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

