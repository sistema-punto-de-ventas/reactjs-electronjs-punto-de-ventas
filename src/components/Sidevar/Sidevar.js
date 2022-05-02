import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';

import './sidevar.css';

function Sidevar({ color, sidebar, showSidebarAdmin,onliAdmin,singOut }) {

    return (
        <div className='contend-sidebar'>
            <IconContext.Provider value={{ color: color.colorHeader.colorText }}>
                <div className='navbar'>
                    <Link to="#" className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebarAdmin} />
                    </Link>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} style={{ backgroundColor: color.colorHeader.contendNavigation }}>
                    <ul className='nav-menu-items' style={{ backgroundColor: color.colorHeader.contendNavigation }}>
                        <li onClick={showSidebarAdmin} className='navbar-toggle' style={{ backgroundColor: color.colorHeader.contendNavigation }}>
                            <Link to='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                            
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span className='span-navbar'>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        <li className='nav-text' style={{ backgroundColor: color.colorHeader.contendNavigation }}>
                            <Link to='#' onClick={()=>onliAdmin('user')}>
                                <FaIcons.FaStore />
                                <span className='span-navbar'>Tienda</span>
                            </Link>
                        </li>
                        <li className='nav-text sign-off' style={{ backgroundColor: color.colorHeader.contendNavigation }}>
                            <Link to='#' onClick={singOut}>
                                <FaIcons.FaSignOutAlt />
                                <span className='span-navbar'>Cerrar sesión</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>

    )
}

export default Sidevar
