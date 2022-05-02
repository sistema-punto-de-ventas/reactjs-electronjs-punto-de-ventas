import React from 'react';
import  './loading.css';

const Loading=({width=90, height=90})=>{

    const style = {
        'width': `${width}px`,
        'height': `${height}px`,
        'margin':'auto',
       
    }

    return(
        <div className="loading" style={style}>
            
        </div>
    );
}

export default Loading;