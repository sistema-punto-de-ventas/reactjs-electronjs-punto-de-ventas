import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './styleHeader.css';
//import Mesa from '../../assets/mesa.png';
//import Cocinero from '../../assets/cocina.png';
import Menu from '../../assets/menu.png';
//import Mesero from '../../assets/mesero1.png';
import Products from '../../assets/product_.png';
import Config from '../../assets/config.png';
import Usuarios from '../../assets/team.png';
import Ventas from '../../assets/ventas.png';
import Clientes from '../../assets/clientess.png';
import Gastos from '../../assets/gastoss.png';
import LoginRutes from "../../routes/Login";
import UserImg from '../../assets/user.png';
import CategoriaImg from '../../assets/categoria2.png'
import Galeria from '../../assets/galeria.png'
import getWindowDimensions from '../Hooks.js/windowDimensions';

const menuArray = [
    /*  { active: false, path: '/mesas', img: Mesa, alt: 'mesa', name: 'Mesas', rolePermit: [{ name: 'admin' }, { name: 'mesero' }, { name: 'caja' }, { name: 'cocinero' }] }, */
    /*{ active: false, path: '/menu', img: Products, alt: 'menu', name: 'Productos', rolePermit: [{ name: 'admin' }, { name: 'user' }, { name: 'mesero' }, { name: 'caja' }, { name: 'cocinero' }] }, */
    { active: false, path: '/menu', img: Products, alt: 'menu', name: 'Productos', rolePermit: [{ name: 'admin' }] },
    { active: false, path: '/usuarios', img: Usuarios, alt: 'usuarios', name: 'Usuarios', rolePermit: [{ name: 'admin' }, { name: 'caja' }] },
    { active: false, path: '/ventas', img: Ventas, alt: 'ventas', name: 'Ventas', rolePermit: [{ name: 'admin' }, { name: 'caja' }] },
    { active: false, path: '/clientes', img: Clientes, alt: 'cliente', name: 'Clientes', rolePermit: [{ name: 'admin' }, { name: 'caja' }] },
    { active: false, path: '/gastos', img: Gastos, alt: 'gastos', name: 'Gastos', rolePermit: [{ name: 'admin' }] },
    { active: false, path: '/PCategoria', img: CategoriaImg, alt: 'pcategoria', name: 'Categoria', rolePermit: [{ name: 'admin' }] },
    // { active: false, path: '/galeria', img: Galeria, alt: 'galeria', name: 'Galeria', rolePermit: [{ name: 'admin' }, { name: 'onwer' }] },
    // { active: false, path: '/config', img: Config, alt: 'config', name: 'Configuracion', rolePermit: [{ name: 'admin' }, { name: 'onwer' }] },

]
function Header(props) {
    const { colorHeader, singOut, msgToast } = props;
    const [path, setPath] = useState('/mesas');
    const [links, setLinks] = useState(menuArray);
    const [dataUserNegocio, setDataUserNegocio] = useState({});
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heightR, setHeightR] = useState(0);
    const [heightNavigator, setHeightNavigator] = useState(0)
    const [sizeLabel, setSizeLabel] = useState(0)
    const [buttonSize, setButtonSize] = useState(20)

    const [imgUser, setImgUser] = useState(0)
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let porcent = 0, sizeL = 28, imgU = 65, buttonS = 22;
        if(windowDimensions.height < 920 || windowDimensions.width < 1255) sizeL = 25;
        if(windowDimensions.height < 905 || windowDimensions.width < 1140) sizeL = 21;
        if(windowDimensions.height < 880 || windowDimensions.width < 960) sizeL = 18;
        if(windowDimensions.height < 820 || windowDimensions.width < 768) {sizeL = 16;}
        if(windowDimensions.height < 780 || windowDimensions.width < 675) {porcent = 0.47; sizeL = 15;}
        if(windowDimensions.height < 700 || windowDimensions.width < 640) {porcent = 0.465; sizeL = 14.3;}

        if (windowDimensions.height < 920) { porcent = 0.53; imgU = 50;};
        if (windowDimensions.height < 820) { porcent = 0.52;  buttonS = 18 };
        if (windowDimensions.height < 640) { porcent = 0.46; sizeL = 14; imgU = 40; buttonS = 15 };
        if (windowDimensions.height < 510) { porcent = 0.44; sizeL = 13; buttonS = 12 };
        if (windowDimensions.height < 480) { porcent = 0.41; sizeL = 12; buttonS = 11 };
        if (windowDimensions.height < 405) { porcent = 0.39; sizeL = 11; buttonS = 10 };
        let r = (windowDimensions.height * 0.19)
        let hn = r * (porcent !== 0 ? porcent : 0.545)
        if (r >= 95) { 
            setHeightR(r);
            setHeightNavigator(hn);
            setSizeLabel(sizeL);
            setImgUser(imgU)
            setButtonSize(buttonS)
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);
    //En esta funcion se selecciona la ruta y se manda al local storage
    const changeRoute = async (route) => {
        const parsed = await JSON.stringify({
            route,
        });
        localStorage.setItem('ruteTC', parsed);
        setPath(route);
    };
    useEffect(() => {
        //saca los datos de local storage donde esta la ruta y luego la remplaza
        async function getRouteEstorage() {
            const path = await JSON.parse(localStorage.getItem("ruteTC"));
            if (path === null) {
                setPath('/mesas')
            } else {
                setPath(path.route);
            }

        }
        getRouteEstorage();
    }, []);

    useEffect(() => {
        async function menuDinamic() {
            const token = await JSON.parse(localStorage.getItem('tokTC'));
            const resp = await LoginRutes.userListRole(token.user.id);
            if (resp.error) {
                msgToast({
                    msg: 'No hay coneccion con la base de datos',
                    time: 10000,
                    tipe: 'warning',
                    title: 'Error 400'
                });
                return;
            }
            if (resp.resp.status === 'No fount') {
                msgToast({
                    msg: resp.resp.result,
                    time: 10000,
                    tipe: 'warning',
                    title: 'Error'
                });
                return;
            }
            if (resp.resp.status === 'ok') {
                const arrMenu = await menuArray.map((data, keys) => {
                    for (let i = 0; i < resp.resp.result.length; i++) {
                        for (let j = 0; j < data.rolePermit.length; j++) {
                            if (data.rolePermit[j].name === resp.resp.result[i].name) {
                                return {
                                    ...data,
                                    active: true
                                };
                            }

                        }
                    }
                    return data;
                })
                setLinks(arrMenu);
            }
        }
        menuDinamic();
    }, [msgToast])



    useEffect(() => {
        const dataUserNegocio = async () => {
            const resp = await LoginRutes.getDataNegocioUser();
            if (resp.error) {
                msgToast({
                    msg: 'No hay coneccion con la base de datos',
                    time: 10000,
                    tipe: 'warning',
                    title: 'Error 400'
                });
                return;
            }
            if (resp.resp.status === 'No fount') {
                msgToast({
                    msg: resp.resp.result,
                    time: 10000,
                    tipe: 'warning',
                    title: 'Error'
                });
                return;
            }
            if (resp.resp.status === 'ok') {
                setDataUserNegocio(resp.resp.result)
            }
        }
        dataUserNegocio();
    }, [msgToast])


    return (
        <>
         {/* style={{ height: `${heightR}px` }} */}
            <div className='head-container menuSatate'>
                {/* navbar */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className='navbar-content'>

                    
                    <div className='content-user'>
                        {/* MENU */}
                        {/* <svg className="icon-menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg> */}
                        <img style={{ width: `${imgUser}px` }} src={UserImg} className='user-img' alt='userImagen'></img>
                        <div className='user-name'>
                            <li style={{ color: colorHeader.colorText }}>{dataUserNegocio.usuario?.name} {dataUserNegocio.usuario?.lastname}</li>
                            <li className="textRole" style={{ color: colorHeader.colorText }}>{dataUserNegocio.usuario?.role[0]?.name}</li>
                        </div>
                    </div>


                    <div className='col-sm-auto logo'>
                        <h1 className='nameLogo' style={{ color: colorHeader.colorText, fontSize: windowDimensions.height > 920 ? '2rem' : sizeLabel }} >{dataUserNegocio.negocio?.nombre}</h1>{/* para que algo este en el centro es d-flex justify-content-center */}
                    </div>


                    <div className='contendButtons'>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            className='button-getOut'
                            onClick={singOut}
                            style={{ backgroundColor: colorHeader.contendNavigation, color: colorHeader.colorText, fontSize: `${buttonSize}px` }}
                        >
                            Salir
                        </motion.button>
                    </div>

                </motion.div>
                {/* end navbar */}

                {
                    true?



                <div className="navigation-contend" style={{ gridTemplateColumns: `repeat(${links.length}, 1fr)`, backgroundColor: colorHeader.contendNavigation }}>
                    {links.map((data, keys) => {
                        if (data.active) {
                            if (data.alt === 'config') {
                                return (
                                    <a
                                        style={{ height: `${heightNavigator}px` }}
                                        href='/#' key={keys} className='navigator'>
                                        <img
                                            className={path === data.path ? 'logoImg selected' : 'logoImg'} src={data.img} alt={data.alt} ></img>
                                        <label
                                            className={path === data.path ? 'labelLogo labelSelected' : 'labelLogo'}
                                            style={{ color: colorHeader.colorText, fontSize: sizeLabel }}
                                        >
                                            {data.name}
                                        </label>
                                    </a>


                                );
                            }
                            return (
                           
                                <Link
                                    style={{ height: `${heightNavigator}px` }}
                                    key={keys} to={data.path} className='navigator' onClick={() => changeRoute(data.path)}>
                                    
                                    <img
                                        className={path === data.path ? 'logoImg selected' : 'logoImg'} src={data.img} alt={data.alt}
                                    ></img>
                                    <label
                                        className={path === data.path ? 'labelLogo labelSelected' : 'labelLogo'}
                                        style={{ color: colorHeader.colorText, fontSize: sizeLabel }}
                                    >
                                        {data.name}
                                    </label>

                                </Link>
                               
                            );
                        }
                        return (<div key={keys}></div>);
                    })}

                    {/* <Link to='/menu' className='navigator' onClick={() => changeRoute('/menu')}>
                        <img className={path === '/menu' ? 'logo selected' : 'logo'} src={Menu} alt="menu"></img>
                        <label className={path === '/menu' ? 'labelLogo labelSelected' : 'labelLogo'} style={{ color: colorHeader.colorText }}>Menu</label>
                    </Link>
                    <Link to='/menu' className='navigator' onClick={() => changeRoute('/menu')}>
                        <img className={path === '/menu' ? 'logo selected' : 'logo'} src={Menu} alt="menu"></img>
                        <label className={path === '/menu' ? 'labelLogo labelSelected' : 'labelLogo'} style={{ color: colorHeader.colorText }}>Menu</label>
                    </Link>
                    <Link to='/menu' className='navigator' onClick={() => changeRoute('/menu')}>
                        <img className={path === '/menu' ? 'logo selected' : 'logo'} src={Menu} alt="menu"></img>
                        <label className={path === '/menu' ? 'labelLogo labelSelected' : 'labelLogo'} style={{ color: colorHeader.colorText }}>Menu</label>
                    </Link>
                    <Link to='/menu' className='navigator' onClick={() => changeRoute('/menu')}>
                        <img className={path === '/ventas' ? 'logo selected' : 'logo'} src={Ventas} alt="menu"></img>
                        <label className={path === '/ventas' ? 'labelLogo labelSelected' : 'labelLogo'} style={{ color: colorHeader.colorText }}>Menu</label>
                    </Link> */}
                </div>
                :''
                }

            </div>
        </>
    );
}
export default Header;