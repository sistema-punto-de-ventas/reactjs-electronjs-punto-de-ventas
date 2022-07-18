import React, { useState, useEffect, useCallback, useRef } from 'react'
import EstadoFinancieroRoute from '../../routes/EstadoFinanciero'
import Modal from '../Modal';
import getWindowDimensions from '../Hooks.js/windowDimensions'
import GeneratorPDF from '../generador_de_pdf/generador_de_pdf';


function ListVentasUser({ RouteOnliAdmin, colors, msgToast}) {
    const [listVentasDiarias, setlistVentasDiarias] = useState({});
    const [modal, setModal] = useState(false);
    const [oneVenta, setOneVenta] = useState({});
    const [buttonClick, setButtonClick] = useState(0);
    const [formP, setFormP] = useState({
        numPagina: 0,
        tamanioPagina: 30,
        buscador: '',
        isUser: true
    });
    const [pages, setPages] = useState({
        totalPages: 0,
        pageNum: 0,
    });
    const [pagina, setPagina] = useState({
        number: 0,
        c: 0,
    });
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heightR, setHeightR] = useState(0);
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let porcent = 0.63;
        if(windowDimensions.height < 976) porcent = 0.64;
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
    //para el form de paginacion de ventas -->> usanfo en la otra ventana
    const changeFormPaginationVentas = (e) => {
        const { value, name } = e.target;
        setFormP({
            ...formP,
            [name]: value,
            numPagina: 0
        })
        getLisVentasUser({
            numPagina: 0,
            tamanioPagina: name === 'tamanioPagina' ? value : formP.tamanioPagina,
            buscador: name === 'buscador' ? value : formP.buscador,
            isUser: formP.isUser
        })
        setPagina({
            number: 0,
            c: 0,
        })
    }
    const changePage = (page) => {
        if (page === 0) { // para paginar la paginas
            setPagina({
                number: 0,
                c: 0,
            })
        } else {
            if (page === pages.totalPages - 1) {
                setPagina({
                    number: pages.totalPages > 3? pages.totalPages - 4:0,
                    c: pages.totalPages - 1
                })
            } else {
                if (page > pagina.c) {
                    if (page > 2) {
                        console.log(page - 2, ' 989898')
                        let obj = pagina;
                        obj['number'] = page - 2
                        setPagina(obj)
                    }
                    let obj1 = pagina;
                    obj1['c'] = page
                    setPagina(obj1)

                } else {
                    if (page < pages.totalPages - 1) {
                        if (pagina.number !== 0) {
                            setPagina({
                                number: page - 2 < 0 ? 0 : page - 2,
                                c: page
                            });
                        }
                    }

                }
            }
        }
        setFormP({
            ...formP,
            numPagina: page
        })
        getLisVentasUser({
            ...formP,
            numPagina: page
        })
    }

    const buttonTableClick = (p, funct) => {
        setButtonClick(p)
        if (funct === 'listVentas') {
            setFormP({
                ...formP,
                isUser: false,
                numPagina: 0
            })
            getLisVentasUser({
                ...formP,
                isUser: false,
                numPagina: 0
            });
            setPagina({
                number: 0,
                c: 0,
            })
            return;
        }
        if (funct === 'listVentasUser') {
            setFormP({
                ...formP,
                isUser: true,
                numPagina: 0
            })
            getLisVentasUser({
                ...formP,
                isUser: true,
                numPagina: 0
            });
            setPagina({
                number: 0,
                c: 0,
            })
            return;
        }
    }

    const openModal = (data, key) => {
        setOneVenta(data)
        setModal(!modal)
    }

    const getLisVentasUser = useCallback(async (form = formP) => {
        const resp = await EstadoFinancieroRoute.getVentasEstadoFinanciero(form)
        //console.log(resp, ' =================================================================')
        if (resp.error) {
            msgToast({
                msg: resp.err ? resp.err.message : 'No hay coneccion con la bd',
                tipe: 'warning',
                title: `Error ${resp.err ? resp.err.status : '400'}`
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
            setlistVentasDiarias(resp.resp.result)
            setPages({
                totalPages: resp.resp.result.listVentas.pageCount,
                pageNum: resp.resp.result.listVentas.pageNumber,
            })
        }


    }, [msgToast, formP])

    useEffect(() => {

        getLisVentasUser();
    }, [getLisVentasUser]);


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
        <div>
            <div className="contend-gastos">
                <div className="conted-left">
                    <h2>{listVentasDiarias.message}</h2>{/* no esta funcionando */}
                </div>
                <div className="conted-right">

                    <button
                        onClick={() => buttonTableClick(0, 'listVentasUser')}
                        className={buttonClick === 0 ? 'button-table active-button-table' : 'button-table'}
                    >Mis Ventas</button>

                    <button
                        onClick={() => buttonTableClick(1, 'listVentas')}
                        className={buttonClick === 1 ? 'button-table active-button-table' : 'button-table'}
                    >Todas las ventas</button>


                </div>
                <div style={{height: heightR}} className={RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
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
                                    onChange={changeFormPaginationVentas}
                                    value={formP.tamanioPagina}
                                    className='sizePage'
                                >
                                    <option value='30'>30</option>
                                    <option value='50'>60</option>
                                    <option value='100'>100</option>

                                </select>
                                <label></label>
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
                                    onChange={changeFormPaginationVentas}
                                    value={formP.buscador}
                                    className='input-search'
                                    placeholder='Cliente, usuario, hora'
                                />
                            </div>
                        </div>
                        <table ref={myRef} className="table" style={style}>
                            <thead className="table-head">
                                <tr className="table-headers">


                                    <th className="header" scope="col" style={style}>N°</th>
                                    <th className="header" scope="col" style={style}>Usuario</th>
                                    <th className="header" scope="col" style={style}>Cliente</th>
                                    <th className="header" scope="col" style={style}>N° venta</th>
                                    <th className="header" scope="col" style={style}>Fecha de Registro</th>
                                    <th className="header" scope="col" style={style}>Hora de Registro</th>
                                    <th className="header" scope="col" style={style}>Efectivo</th>
                                    <th className="header" scope="col" style={style}>Cambio</th>
                                    <th className="header" scope="col" style={style}>Total</th>

                                    <th className="header" scope="col">Opciones</th>


                                </tr>
                            </thead>
                            <tbody className="table-body" style={style}>
                                {listVentasDiarias.listVentas?.result.map((data, key) => {
                                    return (
                                        <tr key={key} className="table-row">
                                            <td className="row-cell">{key + 1}</td>
                                            <td className="row-cell">{data.idUser}</td>
                                            <td className="row-cell">{data.idCLiente}</td>
                                            <td className="row-cell">{data.venta}</td>
                                            <td className="row-cell">{data.dateCreate?.split('T')[0]}</td>
                                            <td className="row-cell">{data.hora}</td>

                                            <td className="row-cell">{data.pagoCliente} Bs</td>
                                            <td className="row-cell">{data.cambioCliente} Bs</td>
                                            <td className="row-cell">{data.precioTotal} Bs</td>

                                            <td className="row-cell">
                                                <button onClick={() => openModal(data, key)} className='tableButton'>Detalles</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="table-head" >
                                <tr >
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col" style={style}>Efectivo: {listVentasDiarias.ventas?.sumEfectivoTotal} Bs</th>
                                    <th className="header" scope="col" style={style}>Cambio: {listVentasDiarias.ventas?.sumCambio} Bs</th>
                                    <th className="header" scope="col" style={style}>Total: {listVentasDiarias.ventas?.total} Bs</th>

                                    <th className="header" scope="col"></th>
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
            </div>
            <Modal
                colors={colors}
                isOpen={modal}
                onClose={openModal}
                size='60%'
                title='Detalles de venta'
            >
                <table className="table" style={style}>
                    <thead className="table-head">
                        <tr className="table-headers">
                            <th className="header" scope="col">N°</th>
                            <th className="header" scope="col">Nombre</th>
                            <th className="header" scope="col">Descripcion</th>
                            <th className="header" scope="col">Categoria</th>
                            <th className="header" scope="col">Precio</th>
                            <th className="header" scope="col">Cantidad Vendido</th>
                            <th className="header" scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {oneVenta.products?.map((data, key) => {
                            return (
                                <tr key={key} className="table-row">
                                    <td className="row-cell">{key + 1}</td>
                                    <td className="row-cell">{data.nameProduct}</td>
                                    <td className="row-cell">{data.detalleVenta}</td>
                                    <td className="row-cell">{data.category}</td>
                                    <td className="row-cell">{data.precioUnitario} Bs</td>
                                    <td className="row-cell">{data.unidadesVendidos}</td>
                                    <td className="row-cell">{data.total} Bs</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="table-head" >
                        <tr>

                            <th className="header" scope="col">{oneVenta.idUser}</th>
                            <th className="header" scope="col"></th>
                            {/*  <th className="header" scope="col">N° venta</th> */}
                            <th className="header" scope="col">Venta:{oneVenta.venta}</th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col">Total: {oneVenta.precioTotal} Bs</th>


                        </tr>
                    </tfoot>
                </table>
                <button onClick={openModal} className="buttonMenu"> Cerrar</button>
            </Modal>
        </div>
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

export default ListVentasUser
