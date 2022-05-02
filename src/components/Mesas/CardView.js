import React, { useState, useEffect } from 'react';
import './StyleCardView.css';
import Add from '../../assets/Add2.png'
import Mesa from '../../assets/mesa.png'
import LoginRoutes from '../../routes/Login';
import iziToast from 'izitoast';
import IpServerF from '../../config/config';
import Url from '../../routes/Url';
import imgProduct from '../../assets/brand3.png';
import Loading from '../Loading/Loading';
//import ImgStatic from '../../assets/mesa.png'
/* const lista = [
    {
        id: 1,
        nombre: 'esto 1'
    },
    {
        id: 2,
        nombre: 'esto 2'
    },
    {
        id: 3,
        nombre: 'esto 3'
    },
    {
        id: 4,
        nombre: 'esto 4'
    },
    {
        id: 5,
        nombre: 'esto 4'
    },
    {
        id: 6,
        nombre: 'esto 4'
    },
    {
        id: 7,
        nombre: 'esto 432'
    }
] */
export default function CardView(props) {
    const { clickProduct, butonActivate, arrDatas, btnStyleColor, titleButton, type } = props;
    const [permitButtons, setPermitButtons] = useState(false)
    /* const [hoverPosition, setHoverPosition] = useState('') */
    const btnStyle = () => {
        if (btnStyleColor) {
            return btnStyleColor;
        }
        return '';
    };
    const titleBtn = () => {
        if (titleButton) return titleButton;
        return 'Insertar';
    }
    /* const descriptionText = (data) => {
        let text = ''
        if (data.length > 82) {
            text = `${data.substr(0, 82)}...`
        } else {
            text = data
        }
        return text;
    }
    const hoverDiv = (e, p) => {
        setHoverPosition(e ? p : '')
    } */
    useEffect(() => {
        let isMounted = true
        const buttonsPermit = async (arrRoles) => {
            const token = await JSON.parse(localStorage.getItem('tokTC'));
            const resp = await LoginRoutes.userListRole(token.user.id);
            if (resp.error) {
                //user un hooks o funcion de  de mensajes
                iziToast.show({
                    timeout: 5000,
                    icon: 'bi bi-slash-circle-fill',
                    iconColor: '#D8DBE2',
                    title: 'Error',
                    titleColor: '#D8DBE2',
                    message: 'No se puede mostrar los datos',
                    messageColor: '#D8DBE2',
                    backgroundColor: '#A30000',
                    position: 'topCenter'
                });
                setPermitButtons(false);
                return;
            }
            if (resp.resp.status === 'No fount') {
                iziToast.show({
                    timeout: 5000,
                    icon: 'bi bi-slash-circle-fill',
                    iconColor: '#D8DBE2',
                    title: 'Error',
                    titleColor: '#D8DBE2',
                    message: resp.resp.message,
                    messageColor: '#D8DBE2',
                    backgroundColor: '#A30000',
                    position: 'topCenter'
                });
                setPermitButtons(false);
                return;
            }
            if (resp.resp.status === 'ok') {
                ///[{"_id": "6","name": "user",},{"_id": "63","name": "caja",}]                
                let listRoles = resp.resp.result;
                let isPermit = false;
                for (let i = 0; i < listRoles.length; i++) {
                    for (let j = 0; j < arrRoles.length; j++) {
                        if (arrRoles[j] === listRoles[i].name) {
                            isPermit = true
                        }
                    }
                }
                console.log(isPermit)
                setPermitButtons(isPermit);
                //return isPermit;
            }
        }
        if (isMounted) {
            buttonsPermit(['admin', 'caja']);
        }
        return () => isMounted = false;
    }, [])

    if (arrDatas) {
        return (
            <>
           
                {arrDatas.map((data, key) => {
                    return (
                        <div key={key} className='containerCardList'>
                            
                            <div className='cardContainer'>
                                <div className='image-content' style={{background:"white"}}>
                                    {type === 'mesas' ?
                                        <img src={Mesa} alt='imagen'></img>
                                        :
                                    <img className='img' src={data.img?Url.urlBackEnd+data.img:imgProduct} alt='' ></img>
                                        // <div>{data}</div>
                                    }
                                </div>
                                <div className='card-body'>
                                    {type === 'mesas' ?
                                        <>
                                            <span>{data.name} </span>
                                            <br className='br-card-list' />
                                            <span>Para {data.numberChair} personas</span>
                                            <span>Cantidad: {data.quantity}</span>
                                        </>
                                        :
                                        <>
                                            {/* <span >{data.nombre}</span>
                                            <br className='br-card-list' />
                                            <span>{data.precioUnitario}bs</span>
                                            <span>Cantidad: {data.quantity}</span> */}
                                            <p className='title-carHeader'>{data?.nombre?.substr(0, 35)}</p>
                                            <div className='precio-producto-content'>
                                                <p className='precio-producto'>{data.precioUnitario}Bs.</p>
                                            </div>
                                            <p className='cantidad-disponible'>
                                                Disponible: {data.quantity}
                                            </p>

                                        </>
                                    }


                                    <div className='btn-options'>
                                        {butonActivate ?
                                          
                                          <div className='cardFooter'>
                                                <button onClick={() => clickProduct('showDetailsTable')}
                                                    className={`btn-cardFooter`}
                                                >
                                                    Detalles
                                                </button>
                                                <button
                                                    className='btn-cardFooter buttonRight'
                                                >
                                                    Ocupado
                                                </button>
                                            </div> 
                                            : permitButtons ?
                                                <div className='cardFooter'>
                                                    <button
                                                        onClick={() => clickProduct(data, 'showDetails')}
                                                        className={`btn-cardFooter`}
                                                    >
                                                        Detalles
                                                    </button>
                                                    <button
                                                        onClick={() => clickProduct(data, 'deleteMenu')}
                                                        className={`btn-cardFooter buttonRight ${btnStyle()}`}
                                                    >
                                                      {titleBtn()}
                                                    </button>
                                                </div>
                                                :
                                                <></>
                                        }
                                    </div>

                                </div>
                                {/* <div className='cardBody' onMouseEnter={() => hoverDiv(true, data.id)} onMouseOut={() => hoverDiv(false, data.id)}>
                                    {type === 'mesas' ?
                                        <p className='description-menu'>aqui entra la descripcion del menu</p>
                                        :
                                        <p className='description-menu'>{descriptionText(data.ingredientes)}</p>
                                    }
                                </div> */}
                                {/* {data.id === hoverPosition &&
                                    <div className='hover-text'>
                                        <p className='hover-text-description'>{data.ingredientes}</p>
                                    </div>
                                } */}


                            </div>
                            {/* {type === 'mesas' ?
                                <img src={Mesa} alt='imagen'></img>
                                :
                                 <img src={data.img} alt='imagen'></img>
                            } */}
                        </div>
                    );
                })}
                {type === 'mesas' &&
                    <div className='containerCardList' style={{ width: 200, height: 190 }}>
                        <div onClick={() => clickProduct('registerTable')} className='cardContainer'>

                            {/* <div className='cardHeader'>
                            <span>sd</span>
                            <br />
                            <span>dd33bs</span>
                        </div>
                        <div className='cardBody' style={{ height: '95px' }}>
                            <span>sdfsdfsdf</span>
                        </div> */}
                        </div>
                        <img src={Add} alt='add'></img>
                    </div>
                }
            </>
        );
    }
    return (
        <>
            {/* lo que tiene que ser dinamico es la imagen de fondo del card view tambien 
            los colores de las letras y los background */}
            <h1>No hay registro de mesas</h1>
            {/* {lista.map((data, key) => {
                return (
                    <div key={key} className='containerCardList' style={{ width: 200, height: 190 }}>
                        <div className='cardContainer'>
                            <div className='cardHeader'>
                                <span>Mesa 1</span>
                                <br />
                                <span>Para 5 personas</span>
                            </div>
                            <div className='cardBody' style={{ height: '95px' }}>
                                <span>aqui entra la descripcion del menu</span>
                            </div>
                            <div className='cardFooter'>
                                <button
                                className='btn-cardFooter'
                                    style={{ backgroundColor: colors.colorHeader.contendNavigation, color: colors.colorHeader.colorText }}>Atendido</button>
                                <button
                                    className='btn-cardFooter buttonRight'
                                    style={{ backgroundColor: colors.colorHeader.contendNavigation, color: colors.colorHeader.colorText }}>Ocupado</button>
                            </div>
                        </div>
                        <img src={ImgStatic} alt='imagen'></img>
                    </div>
                );
            })} */}
        </>
    );
}

