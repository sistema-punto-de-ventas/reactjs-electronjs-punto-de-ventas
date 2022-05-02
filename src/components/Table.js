import React from 'react'
import './Styles/StyleTable.css'

export default function Table(props) {
    const { tableDatas,clickProduct } = props;
    
    if (tableDatas) {        
        return (
            <>
                <div className="contend-table tableOutModal">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-headers">
                                {tableDatas.tableHeadDatas.map((data, key) => {
                                    return (
                                        <th key={key} className="header" scope="col">{data.headName}</th>
                                    );
                                })}

                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {tableDatas.tableBodyDatas.map((data, key) => {
                                return (
                                    <tr key={key} className="table-row">
                                        <td className="row-cell">{data.nombre}</td>
                                        <td className="row-cell">{data.ingredientes}</td>
                                        <td className="row-cell">{data.precio}</td>
                                        <td className="row-cell"> 
                                            <button onClick={()=>clickProduct(key,'delete')} className='tableButton'>Quitar</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </>
        );
    }
    return (
        <>
            <div className="contend-table tableOutModal">
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-headers">
                            <th className="header" scope="col">#</th>
                            <th className="header" scope="col">Nombre</th>
                            <th className="header" scope="col">Cantidad</th>
                            <th className="header" scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        <tr className="table-row">
                            <td className="row-cell">1</td>
                            <td className="row-cell">pollo</td>
                            <td className="row-cell">2</td>
                            <td className="row-cell">algunbutton</td>
                        </tr>
                        <tr className="table-row">
                            <td className="row-cell">1</td>
                            <td className="row-cell">pollo</td>
                            <td className="row-cell">2</td>
                            <td className="row-cell">algunbutton</td>
                        </tr>
                        <tr className="table-row">
                            <td className="row-cell">1</td>
                            <td className="row-cell">pollo</td>
                            <td className="row-cell">2</td>
                            <td className="row-cell">algunbutton</td>
                        </tr>
                        <tr className="table-row">
                            <td className="row-cell">1</td>
                            <td className="row-cell">pollo</td>
                            <td className="row-cell">2</td>
                            <td className="row-cell">algunbutton</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </>
    );
}
