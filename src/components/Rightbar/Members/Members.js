import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './Members.module.scss';
import { faCaretDown, faCaretLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { members } from '~/MockData/data';
import Member from '../Member';

const cx = classNames.bind(styles);
function Members() {
  const [expanded, setExpanded] = useState(true);
  const handleToggleList = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <h5 className={cx('title')}>People</h5>
        <div className={cx('tools')}>
          <IconButton className={cx('btn')}>
            <FontAwesomeIcon icon={faUserPlus} />
          </IconButton>
          <IconButton className={cx('btn')} onClick={handleToggleList}>
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} />
          </IconButton>
        </div>
      </header>
      <div className={cx('members', expanded ? 'show' : '')}>
        {members
          .filter((member) => member.isUser === false)
          .map((member) => (
            <Member key={member.id} {...member} />
          ))}
      </div>
    </div>
  );
}

export default Members;
