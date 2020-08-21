import React, { MouseEvent } from 'react';
import { c } from 'ttag';
import { classnames } from '../../helpers';
import Tooltip from '../tooltip/Tooltip';
import Icon from '../icon/Icon';

export interface LabelDescription {
    name: string;
    color?: string;
    title?: string;
    onClick?: (event: MouseEvent) => void;
    onDelete?: (event: MouseEvent) => void;
}

interface Props {
    labels: LabelDescription[];
    showDelete?: boolean;
    isStacked?: boolean;
    maxNumber?: number;
    className?: string;
}

const LabelStack = ({ labels, showDelete = true, isStacked = false, maxNumber, className }: Props) => {
    const labelsToShow = labels.slice(0, maxNumber);
    const labelsOverflow = labels.slice(maxNumber || labels.length);

    return (
        <ul
            className={classnames([
                'label-stack unstyled m0 inline-flex flew-row flex-items-center stop-propagation',
                isStacked && 'is-stacked',
                className,
            ])}
        >
            {labelsToShow.map((label: LabelDescription) => (
                <li
                    className="label-stack-item flex flex-row flex-items-center flex-justify-start flex-nowrap"
                    style={{ '--color': label.color }}
                    key={label.name}
                >
                    {label.onClick ? (
                        <button
                            type="button"
                            className="label-stack-item-button ellipsis"
                            onClick={label.onClick}
                            title={label.title}
                        >
                            {label.name}
                        </button>
                    ) : (
                        <span className="label-stack-item-button ellipsis" title={label.title}>
                            {label.name}
                        </span>
                    )}

                    {showDelete && (
                        <button
                            type="button"
                            className="label-stack-item-delete flex-item-noshrink"
                            onClick={label.onDelete}
                            title={`${c('Action').t`Remove`} ${label.title}`}
                        >
                            <Icon
                                name="close"
                                size={12}
                                className="label-stack-item-delete-icon"
                                alt={c('Action').t`Remove`}
                            />
                        </button>
                    )}
                </li>
            ))}
            {labelsOverflow.length > 0 && (
                <li className="label-stack-overflow-count flex">
                    <Tooltip title={labelsOverflow.map((label) => label.name).join(', ')}>
                        +{labelsOverflow.length}
                    </Tooltip>
                </li>
            )}
        </ul>
    );
};

export default LabelStack;