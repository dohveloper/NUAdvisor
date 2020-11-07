import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <img className="header__logo" alt="logo" src={process.env.PUBLIC_URL + '/assets/img/logo(white).png'} />
      <div className="header__profile">profile^</div>
    </div>
  );
}

export default Header;
