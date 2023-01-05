import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import VentasRoutes from '../routes/Ventas';

import './Styles/Modal.css';

const Modal =(props)=> {
        const [dataTicket, setDataTicket] = useState();
        useEffect(async()=>{
            var data = await VentasRoutes.getNumeroTicket();
            if(data.resp.status==='ok'){
                setDataTicket(data.resp.result);
            }
        },[])

    const {children,title,colors,size} = props;
    if (!props.isOpen) {
        return null;
    }


   

    return ReactDOM.createPortal(
        <div className="Modal">
            {/* el tamanio del modal se puede cambiar modal-sm, modal-lg, modal-xl y el modal-fullscreen */}           
            <div className="modalStyle-box">
                <div className="modalStyle-header" 
                style={{
                    background:colors?  colors.colorGlobal:'white',
                    color: colors? colors.colorHeader.colorText : 'black'
                }}>
                    <div onClick={props.onClose} className="close-modalStyle">✖</div>
                    {/* <h2>{title}: {dataTicket.numeroTicketActual}</h2> */}
                    <h2>{title}</h2>
                </div>
                <div className="modalStyle-body" style={{
                    background:colors?  colors.colorGlobal:'white',
                    color: colors? colors.colorHeader.colorText : 'black'
                }}>
                    {children}
                    {/* <button className="close-modal">Close!</button> */}
                </div>

            </div>
        </div>,
        document.getElementById('modal')
    );
}

export default Modal;


