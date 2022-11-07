import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';

import ChatGroup from './ChatGroup';
import styles from './GroupList.module.scss';
import { AppContext } from '~/Context/AppProvider';
const cx = classNames.bind(styles);
function GroupList() {
  const { groups, setIsOpenAddGroup } = useContext(AppContext);
  const [searchValue, setSearchValue] = useState('');
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
        <input
          className={cx('search-input')}
          placeholder="Search groups..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={cx('search-btn')}>
          <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
        </div>
      </form>
      <div className={cx('groups')}>
        {searchValue.trim() === ''
          ? groups.map((group) => <ChatGroup key={group.id} {...group} />)
          : groups
              .filter((group) => group.name.toLowerCase().includes(searchValue.trim().toLowerCase()))
              .map((group) => {
                <ChatGroup key={group.id} {...group} />;
              })}
      </div>
    </div>
  );
}

export default GroupList;
