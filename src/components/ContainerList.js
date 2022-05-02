import React, { useEffect, useState } from 'react';
import './Styles/StyleContainerList.css';
import getWindowDimensions from '../components/Hooks.js/windowDimensions'

export default function ContainerList(props) {
    const { /* heigth, heigthPrimary, */ cardUser } = props
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heigthContainer, setHeightContainer] = useState(0)

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let r = (windowDimensions.height * 0.81);
        let porcent = 0.857;
        if (r >= 420) {
            
            if (r < 790) porcent = 0.828;
            if (r < 725) porcent = 0.824;
            if (r < 665) porcent = 0.82;
            if (r < 635) porcent = 0.81;
            if (r < 590) porcent = 0.80;
            if (r < 550) porcent = 0.78;
            if (r < 505) porcent = 0.77;
            if (r < 485) porcent = 0.758;
            if (r < 445) porcent = 0.73;
            if (r < 425) porcent = 0.71;
            let heightCL = (r * porcent)
            //console.log(porcent, ' esto es ', r)
            setHeightContainer(heightCL)
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);
    return (
        <>
            <div className={cardUser ? 'containerList user-container' : 'containerList'} style={{ height: `${heigthContainer}px`, marginTop:'10px', paddingBottom:'70px' }} >
                {props.children}
            </div>
        </>
    )
}
