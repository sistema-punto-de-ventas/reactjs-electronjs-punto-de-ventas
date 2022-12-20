import React, { useState, useEffect } from "react";
import './StyleBody.css';
import getWindowDimensions from '../Hooks.js/windowDimensions';
function Layout(props){
    const {color,isLoged, showMenu} = props;
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heightR, setHeightR] = useState(0);

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let r =  (windowDimensions.height * 0.81)
        if(r>=420){
            setHeightR(r);
        }        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);
    if(!isLoged){
        return(
            <>
            {props.children}
            </>
        );
    }
    return(
        
        <> 
        {}

            {/* <div className='containerBody' style={{height:`${heightR}px`}}> */}
            <div className='containerBody'>
                
            
                <div className={`contendRoutes ${showMenu===true?'grid-template':''}`} style={{backgroundColor:color.colorHeader.contendNavigation,color:color.colorHeader.colorText}}>
                    {/* {`${heightR} heigth total ${windowDimensions.height}`} */}
                    {props.children}
                </div>
            </div>
        </>
    );
}
export default Layout;