import ballAudio from '../../../../../assets/sounds/ball.wav';
import { Bodies, Body, Composite, Engine, Events, IEventCollision, Render, Runner, World } from 'matter-js';
import { createRef, useCallback, useEffect, useState } from 'react';
import { LinesType, MultiplierValues } from './@types';
import { PlinkoGameBody } from './components/GameBody';
import { config } from './config';
import { getMultiplierByLinesQnt, getMultiplierSound } from './config/multipliers';
import { useGameStore } from '../../../../../store/game';
import { random } from '../../../../../shared/utils/random';
import { Button } from '../../../../../shared/components/button';
import styles from './index.module.scss';
import cat from '../../../../../assets/images/kit.png';
import catIdle from '../../../../../assets/animations/cat idle.json';
// import catOn4 from '../../../../../assets/animations/cat1.lottie';
import catOn30 from '../../../../../assets/animations/cat2.json';
import { Input } from '../../../../../shared/components/input/input';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { ScoreHistory } from '../score-history/score-history';
import { LottieAnimation } from '../../../../../entities/lottie-animation/lottie-animation';

export function Game() {
    // #region States
    const engine = Engine.create();
    const [lines] = useState<LinesType>(8);
    const inGameBallsCount = useGameStore((state) => state.gamesRunning);
    const { userData, decrementCurrentBalance, incrementCurrentBalance } = useAppContext();
    // const [res, setRes] = useState<any>({
    //     30: 0,
    //     4: 0,
    //     1.5: 0,
    //     0.3: 0,
    //     0.2: 0,
    //     count: 0,
    // });
    const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
    // const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [animationDisplay, setAnimationDisplay] = useState<'30' | '4' | 'idle'>('idle');

    // useEffect(() => {
    //     const img = new Image();
    //     img.onload = () => {
    //         setImageLoaded(true);
    //     };
    //     img.src = bigCharacter; // Start loading the image
    // }, []);

    const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
    const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);

    const points = useGameStore((state) => state.points);
    const changePoints = useGameStore((state) => state.changePoints);
    const methods = useForm();

    const { pins: pinsConfig, colors, ball: ballConfig, engine: engineConfig, world: worldConfig } = config;

    const worldWidth = worldConfig.width;
    const worldHeight = worldConfig.height;

    const magnet = {
        x: worldWidth / 2, // X position of the magnet
        y: worldHeight - 10, // Y position of the magnet
        strength: 0.00016, // Adjust the strength of the magnet
        influenceRadius: 400, // Radius of the magnet's influence
    };
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

        // Adding afterUpdate event to apply magnetic force
        Events.on(engine, 'afterUpdate', () => {
            const bodies = Composite.allBodies(engine.world);
            for (const body of bodies) {
                if (body.label.includes('ball')) {
                    applyMagneticForce(body, magnet);
                }
            }
        });

        return () => {
            World.clear(engine.world, true);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, [lines]);

    function applyMagneticForce(ball: any, magnet: any) {
        const dx = magnet.x - ball.position.x;
        const dy = magnet.y - ball.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < magnet.influenceRadius) {
            const forceMagnitude = (magnet.strength * (magnet.influenceRadius - distance)) / magnet.influenceRadius;
            const force = {
                x: (dx / distance) * forceMagnitude,
                y: (dy / distance) * forceMagnitude,
            };

            Body.applyForce(ball, ball.position, force);
        }
    }

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
        if (inGameBallsCount > 8) return;
        incrementInGameBallsCount();
    }

    function removeInGameBall() {
        decrementInGameBallsCount();
    }

    function bet(betValue: number) {
        addBall(betValue);
    }

    async function handleRunBet() {
        if (inGameBallsCount >= 8) return;
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
                friction: 0.85,
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
    const magnetBody = Bodies.circle(magnet.x, magnet.y, 50, {
        isStatic: true,
        render: {
            fillStyle: 'blue',
            visible: false,
        },
    });

    Composite.add(engine.world, [...pins, ...multipliersBodies, magnetBody, leftWall, rightWall, floor]);

    // let totalBets = 0;
    // let totalWinnings = 0;

    // function getCurrentRTP() {
    //     if (totalBets === 0) return 1; // To avoid division by zero
    //     return totalWinnings / totalBets;
    // }

    async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
        ball.collisionFilter.group = 2;
        World.remove(engine.world, ball);
        removeInGameBall();
        const ballValue = ball.label.split('-')[1];
        const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues;

        // setRes((prev: any) => {
        //     return { ...prev, [multiplierValue]: prev[multiplierValue] + 1, count: prev.count + 1 };
        // });

        const multiplierSong = new Audio(getMultiplierSound(multiplierValue));
        multiplierSong.currentTime = 0;
        multiplierSong.volume = 0.2;
        multiplierSong.play();

        if (+ballValue <= 0) return;

        const newBalance = parseFloat((+ballValue * multiplierValue).toFixed(2)); // Ensure that newBalance is a number with two decimal places

        switch (multiplierValue) {
            case 30: {
                setAnimationDisplay('30');
                setTimeout(() => {
                    setAnimationDisplay('idle');
                }, 2000);
                break;
            }
            case 4: {
                setAnimationDisplay('30');
                setTimeout(() => {
                    setAnimationDisplay('idle');
                }, 2000);
                break;
            }
        }

        // totalBets += +ballValue;
        // totalWinnings += newBalance;

        // const currentRTP = getCurrentRTP();
        // const desiredRTP = 0.98; // 98%

        // if (currentRTP > desiredRTP && Math.random() > 0.5) {
        //     // If RTP is too high, sometimes steer balls to lower multipliers
        //     steerBallsToLowerMultipliers();
        // } else {
        incrementCurrentBalance(newBalance);
        updateScoreHistory({ id: 0, label: 'x' + multiplierValue, disappears: false, nodeRef: createRef() });
        // }
    }

    console.log('animation display', animationDisplay);

    async function onCollideWithPin(pin: Body) {
        const originalFillStyle = '#4D506A';
        const originalStrokeStyle = 'none';
        const originalLineWidth = 0;

        pin.render.fillStyle = 'white';
        pin.render.strokeStyle = 'white';
        pin.render.lineWidth = 3;

        // const hitSound = new Audio(ballAudio);
        // hitSound.volume = 0.5;
        // hitSound.play();

        const animationDuration = 1000;
        const startTime = performance.now();

        function animate(time: number) {
            const elapsedTime = time - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);

            pin.render.fillStyle = `rgba(255, 255, 255, ${1 - progress})`;

            const r = Math.round(255 * (1 - progress) + 77 * progress);
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

        if (userData?.points && +value > userData?.points) {
            changePoints(String(userData?.points));
        }

        changePoints(value);
    };

    const updateScoreHistory = (score: ScoreHistory) => {
        setScoreHistory((prevData) => {
            const newScore = {
                ...score,
                id: prevData.length > 0 ? prevData[0].id + 1 : 1,
            };

            let updatedData = [newScore, ...prevData];

            if (updatedData.length > 10) {
                updatedData = updatedData.slice(0, 10);
            }

            return updatedData;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setScoreHistory((prevHistory) => {
                if (prevHistory.length === 0) {
                    clearInterval(interval);
                    return prevHistory;
                }
                return prevHistory.slice(0, -2);
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [scoreHistory]);

    return (
        <div className="flex h-fit flex-col items-center justify-center md:flex-row">
            <div className="flex flex-1 items-center justify-center relative">
                <PlinkoGameBody />

                <div className={styles.game__big_character}>
                    <LottieAnimation
                        animationData={
                            animationDisplay === 'idle' ? catIdle : animationDisplay === '30' ? catOn30 : catOn30
                        }
                        loop={true}
                    />
                </div>

                <ScoreHistory scoreHistory={scoreHistory} />
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

