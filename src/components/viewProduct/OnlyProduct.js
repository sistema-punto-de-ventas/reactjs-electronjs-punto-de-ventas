import React, { useState, useEffect, useCallback } from 'react';
import GaleriaRoutes from '../../routes/GaleriaRoutes';
import {Url} from '../../routes/Url';
//import styled from 'styled-components';
import pipocaPollo from '../../assets/pipocaDePollo.jpg';
import verticalImagen from '../../assets/vertical.jpg';
import verticalImagen1 from '../../assets/vertical1.jpg';
import verticalImagen2 from '../../assets/vertical2.jpg';
import video from '../../assets/video.mkv';
import video1 from '../../assets/video1.mp4';
import video2 from '../../assets/video2.mp4';
import video3 from '../../assets/video3.mp4';


import './Style.css'
const list = [
    { type: 'img', src: verticalImagen2, alt: 'imagen5', punto: 'activo' },
    { type: 'img', src: pipocaPollo, alt: 'imagen4', punto: '' },
    { type: 'video', src: video1, alt: 'video2', punto: '' },
    { type: 'img', src: verticalImagen, alt: 'imagen1', punto: '' },
    { type: 'video', src: video3, alt: 'video4', punto: '' },
    { type: 'img', src: verticalImagen1, alt: 'imagen3', punto: '' },
    { type: 'video', src: video1, alt: 'video2', punto: '' },
    { type: 'video', src: video, alt: 'video1', punto: '' },
    { type: 'video', src: video2, alt: 'video3', punto: '' },


    /* { type: 'img', src: pipocaPollo, alt: 'imagen4', punto: '' },
    
    { type: 'img', src: pipocaPollo, alt: 'imagen6', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen7', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen8', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen9', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen10', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen11', punto: '' },
    { type: 'img', src: verticalImagen, alt: 'imagen12', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen13', punto: '' },
    { type: 'img', src: verticalImagen1, alt: 'imagen14', punto: '' },
    { type: 'img', src: pipocaPollo, alt: 'imagen15', punto: '' },
    { type: 'img', src: verticalImagen2, alt: 'imagen16', punto: '' }, */

]
function OnlyProduct({msgToast}) {
    const [listImg, setListIMG] = useState(list);
    const [translateX, setTranslateX] = useState(0);
    const [calc, setCalc] = useState(0)

    const [windowsZise] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    const [isVideo, setIsvideo] = useState(false);
    const [isImg, setIsImg] = useState(true);
    const [imgP, setImgP] = useState(0);
    const [r, setR] = useState(false);

    useEffect(() => {
        const getListImg = async() => {
            const resp = await GaleriaRoutes.list();
            if (resp.error) {
                let err = resp.err;
                msgToast({
                    msg: err ? err?.message : 'No hay coneccion con la Base de datos',
                    tipe: 'warning',
                    title: err ? `Error ${err?.status}` : 'Error 500'
                });
                return;
            }
            if (resp.resp.status === 'No fount') {
                msgToast({
                    msg: resp.resp.message,
                    tipe: 'warning',
                    title: 'Error'
                });
                return;
            }
            if (resp.resp.status === 'ok') {
                let arr = [], data = resp.resp.result;
                for(let i = 0; i < data.length; i++){
                    arr.push({
                        type: data[i].type, src: ` ${Url.urlBackEnd}${data[i].img}`, alt: `imagen5${i}`, punto: i === 0? 'activo' : '' ,
                    })
                }
                console.log(arr, ' esto es el arr que quiero ver')
                setListIMG(arr)
            }
        }
        getListImg();
    }, [msgToast])

    const tr = useCallback((p) => {
        let t = 100 / listImg.length;
        for (let i = 0; i < listImg.length; i++) {
            if (p === i) {
                listImg[i].punto = 'activo'
            } else {
                listImg[i].punto = ''
            }
        }
        let sum = p > 9 ? 0.01 : 0.005
        let esto = p > 6 ? (p + sum) : p
        /* console.log(t, 't')
        console.log(t *  esto, ' *')
        console.log(t *  p)
        console.log(p > 4 ?( p + 0.5): p, ' esto m', p, ' esto es p') */
        setTranslateX(t * esto)
    }, [listImg])
    const windowsSinamic = useCallback(() => {
        let size = 0;
        console.log(windowsZise.width, '<=', 1080)
        if (windowsZise.width <= 1080) {
            console.log('esto es menor que 1080')
            size = 203
        } else {
            size = 100.5
        }
        setCalc(size);
    }, [windowsZise.width]);
    useEffect(() => {
        windowsSinamic();
    }, [windowsSinamic]);

    // trancision de imagenes 
    useEffect(() => {
        let p = listImg.length;

        if (p > 1) {
            const timer = setInterval(() => {
                if (isVideo === false) {
                    if (imgP <= p - 1 && r === false) {//recorremos el carrucel hacia adelante   
                        if (imgP < p - 1) {
                            setImgP(imgP1 => imgP1 + 1);
                        }
                        tr(imgP);
                        if (listImg[imgP]?.type === 'img') {
                            setIsImg(true)
                        }
                        if (/* listImg[imgP]?.type === 'img' && */ listImg[imgP + 1]?.type === 'video') {
                            handlePlayVideo(imgP + 1, 'play')
                        }
                        if (listImg[imgP]?.type === 'video') {
                            handlePlayVideo(imgP, 'play')
                            setIsvideo(true);
                            setIsImg(false);
                        }
                        if (imgP === p - 1) {
                            setR(true)
                        }
                    } else if (0 <= imgP && r === true) { // recorremos el carrucel hacia atras cuando esta en el tope                            
                        if (0 <= imgP) {
                            setImgP(imgP1 => imgP1 - 1);
                        }
                        tr(imgP);
                        if (listImg[imgP]?.type === 'img') {
                            setIsImg(true)
                        }
                        if (/* listImg[imgP]?.type === 'img' && */ listImg[imgP - 1]?.type === 'video') {
                            handlePlayVideo(imgP - 1, 'play')
                        }
                        if (listImg[imgP]?.type === 'video') {
                            handlePlayVideo(imgP, 'play')
                            setIsvideo(true)
                            setIsImg(false);
                        }
                        if (imgP === 0) { setR(false) }
                    }
                }

            }, isImg === true ? 5000 : 500);
            return () => {
                clearInterval(timer);
            };
        }
    }, [tr, isVideo, listImg, imgP, r, isImg]);
    const videoEnd = (p) => {
        setIsvideo(false)
    }
    const handlePlayVideo = (p, func) => {
        var vid = document.getElementById(`video${p}`);
        if (func === 'play') {
            vid.play();
        }
        if (func === 'pause') {
            vid.pause();
        }


    }
    return (
        <>
            <div className="carrousel">
                <div className="grande" style={{ transform: `translateX(-${translateX}%)`, width: `calc( ${calc * (0.5 * listImg.length)}% + 1em)` }}>
                    {listImg.map((data, keys) => {
                        if (data.type === 'img') {
                            return (

                                <img
                                    className='img'
                                    key={keys}
                                    src={data.src}
                                    alt={data.alt}
                                    style={{ width: `calc( 100% / ${listImg.length} - 1em)` }}
                                ></img>
                            );
                        } else {
                            return (
                                <video
                                    onEnded={() => { videoEnd(keys) }}
                                    id={`video${keys}`}
                                    onClick={() => handlePlayVideo(keys)}
                                    style={{ height: '100%', width: `calc( 100% / ${listImg.length} - 1em)`, objectFit: "scale-down" }}
                                    key={keys} src={data.src}
                                    autoPlay={false} muted
                                ></video>
                            );
                        }

                    })}


                </div>
                <ul className="puntos">
                    {listImg.map((data, keys) => {

                        return (
                            <li key={keys} onClick={() => tr(keys)} className={`punto ${data.punto}`}></li>
                        );


                    })}
                </ul>
            </div>
        </>
    );
}

export default OnlyProduct;
