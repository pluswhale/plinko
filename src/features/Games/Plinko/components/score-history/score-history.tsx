import { FC, ReactElement } from 'react';
import styles from './score-history.module.scss';
import './score-history.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Typography } from '../../../../../shared/components/typography';

type Props = {
    scoreHistory: ScoreHistory[];
};

export type ScoreHistory = {
    id: number;
    label: string;
    disappears: boolean;
    nodeRef: any;
};

const colorsForScore = {
    x30: '#DE1A17',
    x4: '#F05A2C',
    'x1.5': '#FFB700',
    'x0.3': '#00C667',
    'x0.2': '#0092D4',
} as { [key: string]: string };

export const ScoreHistory: FC<Props> = ({ scoreHistory }): ReactElement => {
    return (
        <div className={styles.score_history}>
            <TransitionGroup className="todo-list">
                {scoreHistory &&
                    scoreHistory.map((score) => {
                        return (
                            <CSSTransition key={score.id} nodeRef={score.nodeRef} timeout={1000} classNames="item">
                                <div
                                    ref={score.nodeRef}
                                    className={styles.score_history__score}
                                    style={{ backgroundColor: colorsForScore[score.label] }}
                                >
                                    <Typography className={styles.score_history__score_text} fontSize="13px">
                                        {score.label}
                                    </Typography>
                                </div>
                            </CSSTransition>
                        );
                    })}
            </TransitionGroup>
        </div>
    );
};

