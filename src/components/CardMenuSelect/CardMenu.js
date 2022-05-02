import React, { useState } from 'react';
import {motion} from 'framer-motion'
import './cardMenu.css'
import Url from '../../routes/Url';
import srcImage from '../../assets/brand3.png';

function CardMenu({ arrDatas, clickProduct }) {

    //console.log('%c ---arrDatas---','color:yellow',arrDatas)

    const [hoverPosition, setHoverPosition] = useState('')

    const descriptionText = (data) => {
        let text = ''
        if (data.length > 90) {
            text = `${data.substr(0, 90)}...`
        } else {
            text = data
        }
        return text;
    }
    const hoverDiv = (e, p) => {
        setHoverPosition(e ? p : '')
    }
    return (
        <>
          
            {
            arrDatas.length===0?
            <div className='content-card-menu'>No Hay productos</div>
            :
            arrDatas.map((data, key) => {
                return (
                    <div key={key} className='container-card-list' >
                        <div className='card-container'>
                            <div className='card-header-list'>

                                {/* <span>{data.nombre}</span>
                                <br className='br-vard-menu'/>
                                <span>{data.precio}bs</span>
                                <br className='br-vard-menu'/>
                                <span>Cantidad: {data.quantity}</span> */}
                                
                                <motion.p initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className='text-header'>
                                     {data.precio}Bs<br className='br-vard-menu' />
                                </motion.p>
                               <div className='content-nombre-cantidad'>
                                   
                                    <motion.div  initial={{opacity:0}} animate={{opacity:1}}  transition={{duration:0.6}} className='text-header-title'>
                                            {data.nombre} 
                                        </motion.div>
                                        <motion.div   initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6}} className='text-cantidad'>
                                            Cantidad: {data.quantity}
                                        </motion.div>
                                  
                                   
                               </div>

                            </div>
                            <div className='card-body-list'
                                onMouseEnter={() => hoverDiv(true, data.id)} onMouseOut={() => hoverDiv(false, data.id)}
                            >

                                {/* <p className='tex-description'>{descriptionText(data.ingredientes)}</p> */}
                                <p className='tex-description'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </p>

                            </div>
                            {data.id === hoverPosition &&
                                <div className='description-text-hover'>
                                    <p>{data.ingredientes}</p>
            
                                </div>
                            }


                            <div className='card-footer-list'>
                                <button onClick={() => clickProduct(data)}
                                    className={`btn-card-footer`}
                                >
                                    Insertar
                                </button>
                                {/* <button
                                    className='btn-cardFooter buttonRight'
                                >
                                    Ocupado
                                </button> */}
                            </div>


                        </div>
                        <img src={data.img?Url.urlBackEnd+data.img:srcImage}  alt=''></img>
                    </div>
                );
            })}
        </>
    )
}

export default CardMenu
