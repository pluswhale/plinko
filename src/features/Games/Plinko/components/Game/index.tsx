import ballAudio from '../../../../../assets/sounds/ball.wav';
import { Bodies, Body, Composite, Engine, Events, IEventCollision, Render, Runner, World } from 'matter-js';
import { useCallback, useEffect, useState } from 'react';

import { LinesType, MultiplierValues } from './@types';
import { BetActions } from './components/BetActions';
import { PlinkoGameBody } from './components/GameBody';
import { MultiplierHistory } from './components/MultiplierHistory';
import { config } from './config';
import { getMultiplierByLinesQnt, getMultiplierSound } from './config/multipliers';
import { useAuthStore } from '../../../../../store/auth';
import { useGameStore } from '../../../../../store/game';
import { random } from '../../../../../shared/utils/random';
import { Button } from '../../../../../shared/components/button';
import styles from './index.module.scss';
import { Typography } from '../../../../../shared/components/typography';
import cat from '../../../../../assets/images/kitty.png';

export function Game() {
    // #region States
    const incrementCurrentBalance = useAuthStore((state) => state.incrementBalance);
    const engine = Engine.create();
    const [lines, setLines] = useState<LinesType>(8);
    const [betValue, setBetValue] = useState(0);
    const inGameBallsCount = useGameStore((state) => state.gamesRunning);
    const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
    const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);
    const currentBalance = useAuthStore((state) => state.wallet.balance);
    const decrementCurrentBalance = useAuthStore((state) => state.decrementBalance);
    const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);
    const { pins: pinsConfig, colors, ball: ballConfig, engine: engineConfig, world: worldConfig } = config;

    const worldWidth: number = worldConfig.width;
    const worldHeight: number = worldConfig.height;
    // #endregion

    useEffect(() => {
        engine.gravity.y = engineConfig.engineGravity;
        const element = document.getElementById('plinko');
        const render = Render.create({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

            const pinY = worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

            const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
                label: `pin-${i}`,
                render: {
                    fillStyle: '#F5DCFF',
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

    const addBall = useCallback(
        (ballValue: number) => {
            addInGameBall();
            const ballSound = new Audio(ballAudio);
            ballSound.volume = 0.2;
            ballSound.currentTime = 0;
            ballSound.play();

            const minBallX = worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap;
            const maxBallX = worldWidth / 2 - pinsConfig.pinSize * 3 - pinsConfig.pinGap + pinsConfig.pinGap / 2;

            const ballX = random(minBallX, maxBallX);
            const ballColor = ballValue <= 0 ? colors.text : colors.purple;
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
                },
                isStatic: false,
            });
            Composite.add(engine.world, ball);
        },
        [lines],
    );

    const leftWall = Bodies.rectangle(
        worldWidth / 3 - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth * 2,
        40,
        {
            angle: 90,
            render: {
                visible: false,
            },
            isStatic: true,
        },
    );
    const rightWall = Bodies.rectangle(
        worldWidth - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap - pinsConfig.pinGap / 2,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth * 2,
        40,
        {
            angle: -90,
            render: {
                visible: false,
            },
            isStatic: true,
        },
    );
    const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
        label: 'block-1',
        render: {
            visible: false,
        },
        isStatic: true,
    });

    const multipliers = getMultiplierByLinesQnt(lines);

    const multipliersBodies: Body[] = [];

    let lastMultiplierX: number = worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap;

    multipliers.forEach((multiplier) => {
        const blockSize = 20; // height and width
        const multiplierBody = Bodies.rectangle(
            lastMultiplierX + 20,
            worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap,
            blockSize,
            blockSize,
            {
                label: multiplier.label,
                isStatic: true,
                render: {
                    sprite: {
                        xScale: 1,
                        yScale: 1,
                        texture: multiplier.img,
                    },
                },
            },
        );
        lastMultiplierX = multiplierBody.position.x;
        multipliersBodies.push(multiplierBody);
    });

    Composite.add(engine.world, [...pins, ...multipliersBodies, leftWall, rightWall, floor]);

    function bet(betValue: number) {
        addBall(betValue);
    }

    async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
        ball.collisionFilter.group = 2;
        World.remove(engine.world, ball);
        removeInGameBall();
        const ballValue = ball.label.split('-')[1];
        console.log('ballValue', ball.label);

        const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues;

        const multiplierSong = new Audio(getMultiplierSound(multiplierValue));
        multiplierSong.currentTime = 0;
        multiplierSong.volume = 0.2;
        multiplierSong.play();
        setLastMultipliers((prev) => [multiplierValue, prev[0], prev[1], prev[2]]);

        console.log(ballValue, 'ballValue');

        if (+ballValue <= 0) return;

        const newBalance = +ballValue * multiplierValue;
        console.log('newBalance:', newBalance);

        await incrementCurrentBalance(newBalance);
    }

    async function onBodyCollision(event: IEventCollision<Engine>) {
        const pairs = event.pairs;
        for (const pair of pairs) {
            const { bodyA, bodyB } = pair;
            console.log('pair', pair);

            if (bodyB.label.includes('ball') && bodyA.label.includes('block'))
                await onCollideWithMultiplier(bodyB, bodyA);
        }
    }

    async function handleRunBet() {
        if (inGameBallsCount >= 15) return;
        if (betValue > currentBalance) {
            setBetValue(currentBalance);
            return;
        }
        bet(betValue);
        if (betValue <= 0) return;
        await decrementCurrentBalance(betValue);
    }

    Events.on(engine, 'collisionActive', onBodyCollision);

    return (
        <div className="flex h-fit flex-col-reverse items-center justify-center gap-4 md:flex-row">
            {/* <BetActions inGameBallsCount={inGameBallsCount} onChangeLines={setLines} onRunBet={bet} /> */}
            {/* <MultiplierHistory multiplierHistory={lastMultipliers} /> */}
            <div className="flex flex-1 items-center justify-center">
                <PlinkoGameBody />
            </div>
            {/* <button onClick={bet}>Bet</button> */}
            <div className={styles.game__score}>
                <div className={styles.game__score_count}>
                    <img className={styles.game__score_img} src={cat} />
                    <Typography>{currentBalance}</Typography>
                </div>

                <Button width="20%" onClick={handleRunBet} text="GO" />
            </div>
        </div>
    );
}

