// import React, {useState} from 'react';
// import './montodescuento.css';

// const ModalDescuento =()=>{
//     const [descuento, setDescuento] = useState(0.0);

//     const handleChange = (e) => {
//         var monto = e.target.value;
//         if(monto>0){
//             setDescuento(monto);
//         }else{
//             monto = 0;
//         }
//     }

//     return(
//         <div className='modal-content-descuento'>
//         <div className='moda-descuento'>
//             <h4>Introduzca el monto del descuento</h4>
//             <input onChange={handleChange} type='number' value={monto} className='input-descuento'/>

//         </div>

//         </div>
//     );
// }

// export default ModalDescuento;