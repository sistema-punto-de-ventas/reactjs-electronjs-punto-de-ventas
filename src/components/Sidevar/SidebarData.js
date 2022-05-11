import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title:'Home',
        path:'/',
        icon:<AiIcons.AiFillHome/>,
        cName:'nav-text'
    },
    {
        title:'Home',
        path:'/estadistica',
        icon:<AiIcons.AiFillHome/>,
        cName:'nav-text'
    },
    {
        title:'Reportes',
        path:'/reportes',
        icon:<IoIcons.IoIosPaper/>,
        cName:'nav-text'
    },
    {
        title:'Menu',
        path:'/menu',
        icon:<FaIcons.FaCartPlus/>,
        cName:'nav-text'
    },
    {
        title:'Usuarios',
        path:'/usuarios',
        icon:<IoIcons.IoMdPeople/>,
        cName:'nav-text'
    },
    {
        title:'Ventas',
        path:'/ventas',
        icon:<IoIcons.IoMdPeople/>,
        cName:'nav-text'
    },
    {
        title:'Mesas',
        path:'/mesas',
        icon:<IoIcons.IoMdPeople/>,
        cName:'nav-text'
    },
    {
        title:'Clientes',
        path:'/clientes',
        icon:<IoIcons.IoMdPeople/>,
        cName:'nav-text'
    },
    {
        title:'Categoria Gastos',
        path:'/gastos',
        icon:<IoIcons.IoMdPeople/>,
        cName:'nav-text'
    }
]