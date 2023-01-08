import React, {useState,useEffect} from 'react';
import getWindowDimensions from '../Hooks.js/windowDimensions';

function Gastos({modalFunction,buttonTableClick,buttonTable,RouteOnliAdmin,colors,changeFormPaginationGastos,formGastosPagination,listGastos,totalGastos,pages,pagina,changePage }) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heightR, setHeightR] = useState(0);
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let porcent = 0.63;
        if(windowDimensions.height < 976) porcent = 0.61;
        if(windowDimensions.height < 840) porcent = 0.59;
        if(windowDimensions.height < 750) porcent = 0.57;
        if(windowDimensions.height < 680) porcent = 0.55;
        if(windowDimensions.height < 645) porcent = 0.53;
        if(windowDimensions.height < 580) porcent = 0.51;
        if(windowDimensions.height < 550) porcent = 0.49;

        let r =  (windowDimensions.height * porcent);
        let b =  (windowDimensions.height * 0.81)
        if(b>=420){
            setHeightR(r);
        }        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);
    return (
        <>
            <div className="contend-gastos">
                <div className="conted-left">
                    <h3>Lista de gastos</h3>
                </div>
                <div className="conted-right">
                    <button onClick={() => modalFunction(1)} className="button-table">Nuevo gasto</button>

                    <button onClick={() => buttonTableClick(0, 'listGastosUser')}
                        className={buttonTable === 0 ? 'button-table active-button-table' : 'button-table'}>
                        Mis gastos
                    </button>

                    <button onClick={() => buttonTableClick(1, 'listGastos')}
                        className={buttonTable === 1 ? 'button-table active-button-table' : 'button-table'}>
                        Gastos del dia
                    </button>



                </div>
                <div  className={RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                    <div className="contend-table tableOutModal">
                        <div className='content-search-sizePage'>
                            <div className='content-left'>
                                <select
                                    style={{
                                        border: colors ? `0.4px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    name='tamanioPagina'
                                    onChange={changeFormPaginationGastos}
                                    value={formGastosPagination.tamanioPagina}
                                    className='sizePage'
                                >
                                    {/* <option value='2'>2</option> */}
                                    <option value='5'>5</option>
                                    <option value='10'>10</option>
                                    <option value='30'>30</option>

                                </select>
                                <label>Tamaño de pagina</label>
                            </div>
                            <div className='content-right'>
                                <label>Buscar:</label>
                                <input
                                    style={{
                                        border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    name='buscador'
                                    onChange={changeFormPaginationGastos}
                                    value={formGastosPagination.buscador}
                                    className='input-search'
                                    placeholder='Usuario, tipo, hora'
                                />
                            </div>
                        </div>
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-headers">
                                    <th className="header" scope="col">Num</th>
                                    <th className="header" scope="col">Tipo de gasto</th>
                                    <th className="header" scope="col">Descripcion</th>
                                    <th className="header" scope="col">Usuario</th>
                                    <th className="header" scope="col">Asignado a:</th>
                                    <th className="header" scope="col">Hora</th>
                                    <th className="header" scope="col">fecha</th>
                                    <th className="header" scope="col">Bs</th>
                                    {/* <th className="header" scope="col">Opciones</th> */}
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {listGastos.map((data, key) => {
                                    return (
                                        <tr key={key} className={`table-row ${key%2==0?'bl':'wi'}`}>
                                            <td className="row-cell">{key + 1}</td>
                                            <td className="row-cell">{data.idTipoGastos}</td>
                                            <td className="row-cell">{data.description}</td>
                                            <td className="row-cell">{data.idUser}</td>
                                            <td className="row-cell">{data.montoAsignadoA}</td>
                                            <td className="row-cell">{data.hora}</td>
                                            <td className="row-cell">{data.dateCreate?.split('T')[0]}</td>
                                            <td className="row-cell">{data.montoGasto} Bs</td>
                                            {/* <td className="row-cell">
                                                            <button onClick={() => this.clickProduct(data, data._id)} className='tableButton'>Detalles</button>
                                                        </td> */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="table-head">
                                <tr>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col">Total: {totalGastos} Bs</th>
                                    {/* <th className="header" scope="col"></th> */}
                                </tr>
                            </tfoot>
                        </table>
                        <div className="content-pagination">
                            <div className='content-pagination-left'>
                                <label>Pagina {pages.pageNum + 1} de {pages.totalPages}</label>
                            </div>
                            <div className='content-pagination-right'>

                                {pagina.c > 2 && pages.totalPages > 3 &&

                                    <div onClick={() => changePage(0)} className='pagination-number'>
                                        1
                                    </div>
                                }
                                {pagina.c > 2 && pages.totalPages > 3 &&
                                    <div className='pagination-number'>
                                        ...
                                    </div>
                                }
                                <List number={pages.totalPages} num={pagina.number}>
                                    {(index) => {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => changePage(index)}
                                                className={pages.pageNum === index ? 'pagination-number select' : 'pagination-number'} >
                                                {index + 1}
                                            </div>
                                        );
                                    }
                                    }
                                </List>
                                {pagina.c < pages.totalPages - 3 &&
                                    <div className='pagination-number'>
                                        ...
                                    </div>
                                }
                                {pagina.c < pages.totalPages - 3 &&
                                    <div
                                        className='pagination-number'
                                        onClick={() => changePage(pages.totalPages - 1)}
                                    >
                                        {pages.totalPages}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function List(props) {
    let item = [];
    for (let i = 0; i < props.number; i++) {
        item.push(props.children(i));
    }
    const data = item.slice(0 + props.num, 5 + props.num);
    return data
}

export default Gastos