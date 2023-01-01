import React from 'react';
import './Styles/CardUserStyle.css';
import User from '../assets/listUser2.png';
import cliente from '../assets/client.png';

import useButtonsRole from './Hooks.js/useButtonsRole';

function CardUser(props) {
    const { arrlist, clickButtonCard, isClient } = props;
    const [buttonRegisterIsPermit] = useButtonsRole(['admin']);
    if (arrlist) {
        if (isClient) {
            return (
                <>
                    {arrlist.map((data, keys) => {
                        return (
                            <div key={keys} className='cardUser client'>
                                <img src={cliente} alt='client'></img>
                                <div className='card-container-user'>
                                    <div className='cardUSer-body'>
                                        <p className='description'>
                                            Nombre: {data.name} <br />
                                            Apellido: {data.lastName}
                                        </p>
                                        {data.phoneNumber && <p className='description'>Telefono: {data.phoneNumber}</p>}
                                        {data.ci && <p className='description'>C.I.: {data.ci}</p>}                                        
                                    </div>
                                    <div className='cardUSer-footer'>
                                        <button onClick={() => clickButtonCard(data, 'showDetails', data._id)} className='btn-cardFooter'>Detalles</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            );
        }
        return (
            <>
                {arrlist.map((data, keys) => {

                    return (
                        <div key={keys} className='cardUser isUser '>
                            <img src={User} alt='userIMG'></img>
                            <div className='card-container-user'>
                                <div className='cardUSer-body'>
                                    <p>
                                        Nombre: {data.name} <br />
                                        Apellido: {data.lastName}
                                    </p>
                                    {data.phoneNumber && <p className='description'>Telefono: {data.phoneNumber}</p>}
                                    {data.ci && <p className='description'>C.I.: {data.ci}</p>}
                                    {data.direction && <p className='description'>Direccion: {data.direction}</p>}
                                </div>
                                <div className='cardUSer-footer users'>
                                    <button onClick={() => clickButtonCard(data, 'showDetails', data._id)} className='btn-cardFooter'>Detalles</button>
                                    {buttonRegisterIsPermit ? data.state ?
                                        <button onClick={() => clickButtonCard(data, 'delete', data._id)} className='btn-cardFooter buttonRight danger-btn'>Desactivar</button>
                                        :
                                        <button onClick={() => clickButtonCard(data, 'delete', data._id)} className='btn-cardFooter buttonRight'>Activar</button>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
    return (
        <div className='cardUser'>
            <img src={User} alt='userPrueba'></img>
            <div className='card-container-user'>
                <div className='cardUSer-body'>
                    <h5>Nombre: <label>Carlos</label></h5>
                    <h5>Apellido: <label>Mamani</label></h5>
                    <h5>Direccion: <label>Calle 34</label></h5>
                    <h5>Telefono: <label>78452255</label></h5>
                    <h5>Role: <label>Cajero</label></h5>
                </div>
                <div className='cardUSer-footer'>
                    <button className='btn-cardFooter'>Detalles</button>
                    <button className='btn-cardFooter buttonRight danger-btn'>Eliminar</button>
                </div>
            </div>
        </div>
    )

}

export default CardUser
