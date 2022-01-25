import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import BackIcon from './back.svg';
import HomeIcon from './home.svg';
import SettingsIcon from './settings.svg';
// import './Buttons.scss'

export function BackButton() {
    const location = useLocation();
    const navigator = useNavigate();
    const isAtHome = () => location.pathname === '/';
    const handleClick = () => navigator(-1);

    return (
        <>
            {!isAtHome() && (
                <div className="back-button" onClick={handleClick}>
                    <img src={BackIcon} alt="" />
                </div>
            )}
        </>
    );
}

export function HomeButton() {
    const location = useLocation();
    const isAtHome = () => location.pathname === '/';

    return (
        <>
            {!isAtHome() && (
                <Link className="home-button" to="/">
                    <img src={HomeIcon} alt="" />
                </Link>
            )}
        </>
    );
}

export function SettingsButton() {
    return (
        <>
            <Link className="home-button" to="/settings">
                <img src={SettingsIcon} alt="" />
            </Link>
        </>
    );
}
