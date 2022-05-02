import React, {useState, useEffect} from 'react';
import EstadoFinancieroRoute from '../../routes/EstadoFinanciero'

function ListaEstadosFinancieros({msgToast}) {
    const [list, setList] = useState([]);

    useEffect(() =>{
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
    },[msgToast])
    return (
        <div className='content-list-estados-financieros'>
            <h3>Lista de cierre de cajas</h3>
            <div className="contend-table tableOutModal">
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-headers">
                            <th className="header" scope="col">N°</th>
                            <th className="header" scope="col">Monto inicial en caja</th>
                            <th className="header" scope="col">Gastos</th>
                            <th className="header" scope="col">Ventas</th>
                            <th className="header" scope="col">Total</th>                          
                            
                            <th className="header" scope="col">Responsable</th>
                            <th className="header" scope="col">Cajero</th>
                            <th className="header" scope="col">Fecha de cierre</th>
                            <th className="header" scope="col">hora de cierre</th>
                            {/* <th className="header" scope="col">Opciones</th> */}
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {list.map((data, key) => {
                            return (
                                <tr key={key} className="table-row">
                                    <td className="row-cell">{key + 1}</td>
                                    <td className="row-cell">{data.montoInicial}</td>
                                    <td className="row-cell">{data.montoActualUtilizado}</td>
                                    <td className="row-cell">{data.ventas}</td>
                                    <td className="row-cell">{data.montoActualDisponble}</td>
                                    
                                    <td className="row-cell">{data.cierreDeCaja.idAdmin}</td>
                                    <td className="row-cell">{data.cierreDeCaja.idCajero}</td>
                                    <td className="row-cell">{data.cierreDeCaja.fechaCierre}</td>
                                    <td className="row-cell">{data.cierreDeCaja.horaCierre}</td>
                                    
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
            </div>
        </div>
    );
}

export default ListaEstadosFinancieros;
