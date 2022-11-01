import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext } from 'react';

import ChatGroup from './ChatGroup';
import styles from './GroupList.module.scss';
import { AppContext } from '~/Context/AppProvider';
const cx = classNames.bind(styles);
function GroupList() {
  const { groups, setIsOpenAddGroup } = useContext(AppContext);
  const handleOpenAddGroup = () => {
    setIsOpenAddGroup(true);
  };
  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <span>Chat Groups</span>
        <IconButton className={cx('add-btn')} onClick={handleOpenAddGroup}>
          <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
          Create Group
        </IconButton>
      </header>
      <form className={cx('search-field')}>
        <input className={cx('search-input')} placeholder="Search people..." />
        <IconButton className={cx('search-btn')}>
          <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
        </IconButton>
      </form>
      <div className={cx('groups')}>
        {groups.map((group) => (
          <ChatGroup key={group.id} {...group} />
        ))}
      </div>
    </div>
  );
}

export default GroupList;
