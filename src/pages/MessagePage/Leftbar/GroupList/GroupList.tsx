import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ButtonBase } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';

import ChatGroup from './ChatGroup';
import styles from './GroupList.module.scss';
import { AppContext } from '../../../../Context/AppProvider';
import notFoundSearchBackGround from '../../../../assets/images/not-found-search-bg.png';
const cx = classNames.bind(styles);

const plusIcon = faPlus as IconProp;
const searchIcon = faSearch as IconProp;

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
        <ButtonBase className={cx('add-btn')} onClick={handleOpenAddGroup}>
          <FontAwesomeIcon icon={plusIcon} className={cx('icon')} />
          Create Group
        </ButtonBase>
      </header>
      <div className={cx('search-field')}>
        <input
          className={cx('search-input')}
          placeholder="Search groups..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={cx('search-btn')}>
          <FontAwesomeIcon icon={searchIcon} className={cx('search-icon')} />
        </div>
      </div>
      <div className={cx('groups')}>
        {searchValue.trim() === ''
          ? groups.map((group) => <ChatGroup key={group.id} {...group} />)
          : groups
              .filter((group) => group.name.toLowerCase().includes(searchValue.trim().toLowerCase()))
              .map((group) => <ChatGroup key={group.id} {...group} />)}
        {groups.filter((group) => group.name.toLowerCase().includes(searchValue.trim().toLowerCase()))?.length ===
          0 && (
          <div className={cx('nogroup')}>
            <img className={cx('nogroup-image')} src={notFoundSearchBackGround} alt="not-found-bg" />
            <p className={cx('nogroup-notification')}>Opps there are no groups...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupList;
