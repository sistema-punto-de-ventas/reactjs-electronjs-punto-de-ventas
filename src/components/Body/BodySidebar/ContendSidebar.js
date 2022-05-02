import React, { useState, useEffect } from 'react'
import './contend.css';
import getWindowDimensions from '../../Hooks.js/windowDimensions';


function ContendSidebar(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [sLeft, setsLeft] = useState(225);
    const [sWidth, setsWidth] = useState(233);

    
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(()=>{
        let isMounted = true;
        function showSidebar (){
            if(props.sidebar){
                setsLeft(225)
                setsWidth(233)
            }else{
                setsLeft(10)
                setsWidth(25)
            }
        }
        if(isMounted){
            showSidebar();
        }
        return () => isMounted = false;
    },[props.sidebar])

    return (
        <div className={props.sidebar? 'contend active' : 'contend'} style={{
            height:windowDimensions.height -25,
            width:windowDimensions.width - sWidth, 
            left: sLeft,
            backgroundColor:props.color.colorHeader.contendNavigation 
        }}>
            {props.children}
        </div>
    )
}

export default ContendSidebar
