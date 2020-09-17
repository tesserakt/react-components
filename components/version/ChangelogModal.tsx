import React, { useState } from 'react';
import { c } from 'ttag';
import markdownit from 'markdown-it';

import { FormModal } from '../modal';
import './ChangeLogModal.scss';

const md = markdownit('default', {
    breaks: true,
    linkify: true,
});

interface Props {
    changelog?: string;
}

const ChangelogModal = ({ changelog = '', ...rest }: Props) => {
    const [html] = useState(() => {
        return {
            __html: md.render(changelog),
        };
    });

    return (
        <FormModal title={c('Title').t`Release notes`} close={c('Action').t`Close`} submit={null} {...rest}>
            <div className="pm-modalContentInner-changelog" dangerouslySetInnerHTML={html} />
        </FormModal>
    );
};

export default ChangelogModal;
