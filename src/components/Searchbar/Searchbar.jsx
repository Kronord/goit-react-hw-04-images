import { useState } from 'react';
import s from './Searchbar.module.css';
import { BiSearchAlt } from 'react-icons/bi';
import propTypes from 'prop-types';

export const Searchbar = ({ onSubmit }) => { 
  const [imgName, setImgName] = useState('');

  const handleSubmit = e => { 
    e.preventDefault();
    onSubmit(imgName);
    setImgName('');
  };

  return (
      <header className={s.Searchbar}>
        <form className={s.SearchForm} onSubmit={handleSubmit}>
          <button type="submit" className={s.SearchFormButton}>
            <span>
              <BiSearchAlt
                style={{ fill: 'blue', width: '20px', height: '20px' }}
              />
            </span>
          </button>

          <input
            className={s.SearchFormInput}
            type="text"
            value={imgName}
            onChange={evt => setImgName(evt.target.value)}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
};

Searchbar.propTypes = {
  onSubmit: propTypes.func.isRequired,
};
