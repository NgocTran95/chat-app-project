import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './Members.module.scss';
import { faCaretDown, faCaretLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { members } from '~/MockData/data';
import Member from '../Member';

const cx = classNames.bind(styles);
function Members({ isOpen }) {
  const [expanded, setExpanded] = useState(true);
  const handleToggleList = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <h5 className={cx('title')}>People</h5>
        {isOpen && (
          <div className={cx('tools')}>
            <IconButton className={cx('btn')}>
              <FontAwesomeIcon icon={faUserPlus} />
            </IconButton>
            <IconButton className={cx('btn')} onClick={handleToggleList}>
              <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} />
            </IconButton>
          </div>
        )}
      </header>
      <div className={cx('members', expanded ? 'show' : '', isOpen ? '' : 'small')}>
        {members
          .filter((member) => member.isUser === false)
          .map((member) => (
            <Member key={member.id} {...member} isOpen={isOpen}/>
          ))}
      </div>
    </div>
  );
}

export default Members;
