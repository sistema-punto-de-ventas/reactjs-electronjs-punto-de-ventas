import React, {useState, useEffect, useRef} from 'react';
import EstadoFinancieroRoute from '../../routes/EstadoFinanciero'
import GeneratorPDF from '../generador_de_pdf/generador_de_pdf';

import io  from 'socket.io-client'

function ListaEstadosFinancieros({msgToast}) {
    const [list, setList] = useState([]);

    useEffect(async() =>{
        const listaEstadoFinanciero = async () => {
            const resp = await EstadoFinancieroRoute.listEstadoFinanciero();
            if (resp.error) {
                msgToast({
                    msg: 'No hay coneccion con la base de datos',
                    tipe: 'warning',
                    title: 'Error 400'
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
                setList(resp.resp.result);
            }
        }
        listaEstadoFinanciero();

         const socket = io('http://192.168.100.9:4000');
         await socket.on('[ventasGastos] reporte',(data)=>{
            console.log(data)
            console.log('1010101010101010100110llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
            // getEstdoFinancieroActivo();
        })
       
    },[msgToast])


    // cambia de color al text de ala tabal para generar el pdf con letras de color negro
    const [style, setStyle]= useState({style:{color:"white !important"}});
    const handlerColor=async(e)=>{
        
        style.color==='black'?setStyle({...style,color:'white'}):setStyle({...style,color:'black'})
    }
    
    // genera un pdf de al tabla
    const myRef = useRef();
    const generatePdf =()=>{
        
        GeneratorPDF(myRef, 'a0');
    }
    
    return (
        <div  className='content-list-estados-financieros' >
            <h3>Lista de cierre de cajas</h3>
            <div className="contend-table tableOutModal">
                <table ref={myRef} className="table" style={style}>
                    <thead className="table-head">
                        <tr className="table-headers">
                            <th className="header" scope="col" style={style}>N°</th>
                            <th className="header" scope="col" style={style}>Monto inicial en caja</th>
                            <th className="header" scope="col" style={style}>Gastos</th>
                            <th className="header" scope="col" style={style}>Ventas</th>
                            <th className="header" scope="col" style={style}>Total</th>                          
                            
                            <th className="header" scope="col" style={style}>Responsable</th>
                            <th className="header" scope="col" style={style}>Cajero</th>
                            <th className="header" scope="col" style={style}>Fecha de cierre</th>
                            <th className="header" scope="col" style={style}>hora de cierre</th>
                            {/* <th className="header" scope="col">Opciones</th> */}
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {list.map((data, key) => {
                            return (
                                <tr key={key} className={`table-row ${key%2==0?'bl':'wi'}`}>
                                    <td className="row-cell" style={style}>{key + 1}</td>
                                    <td className="row-cell" style={style}>{data.montoInicial}</td>
                                    <td className="row-cell" style={style}>{data.montoActualUtilizado}</td>
                                    <td className="row-cell" style={style}>{data.ventas}</td>
                                    <td className="row-cell" style={style}>{data.montoActualDisponble}</td>
                                    
                                    <td className="row-cell" style={style}>{data.cierreDeCaja.idAdmin}</td>
                                    <td className="row-cell" style={style}>{data.cierreDeCaja.idCajero}</td>
                                    <td className="row-cell" style={style}>{data.cierreDeCaja.fechaCierre}</td>
                                    <td className="row-cell" style={style}>{data.cierreDeCaja.horaCierre}</td>
                                    
                                </tr>
                            );
                        })}
                    </tbody>

                  

                    {/* <tfoot className="table-head">
                        <tr>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col">Total: {this.state.totalGastos} Bs</th>
                            
                        </tr>
                    </tfoot> */}
                </table>

                {/* btn download pdf */}
                <div className='content-btn-pdf'>
                    <label class="label-imprimir">
                        <input onChange={(e)=>handlerColor(e)} 
                        type="checkbox" name="radio" value="false"/>
                        Descargar reporte
                        </label>
                    {
                        style.color==="black"?
                        <div onClick={generatePdf} className='btn-donwload-pdf'>
                            Descargar pdf
                        </div>
                        :''
                    }
                </div>
            </div>

            
        </div>
    );
}

export default ListaEstadosFinancieros;
