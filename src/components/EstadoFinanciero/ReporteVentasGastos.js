import React, { useState, useEffect, useCallback } from 'react'
import Modal from '../Modal'
import Menu from '../Menu'
import CategoriaProductosRoute from '../../routes/CategoriaProductos'
import getWindowDimensions from '../Hooks.js/windowDimensions';
const buttonsArr = [
    { button: 'Productos', selected: 'buttonSeleccted' },
    { button: 'Gastos', selected: '' },
]
const menuButton = [
    { rolePermit: [{ name: 'admin' }], button: 'Ventas', selected: 'buttonSeleccted', possition: 'left' },

    //dinamicButton menu

]
function ReporteVentasGastos({ changeFormFecha, formFecha, reporteVentaGatos, reportVentaGastos, RouteOnliAdmin, colors, msgToast }) {
    const [buttons, setButtons] = useState(buttonsArr);
    const [modalOneProduct, setModalOneProduct] = useState(false)
    const [productSelected, setProductSelect] = useState({});

    const [buttonsMenu, setButtonsMenu] = useState(menuButton);
    const [sectionCategori, setSectionCategori] = useState(0);

    const [section, setSection] = useState({
        title: 'Productos',
        position: 0
    });
    const [pagina, setPagina] = useState({
        number: 0,
        c: 0,
    });
    const [paginaG, setPaginaG] = useState({
        number: 0,
        c: 0,
    });
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heightR, setHeightR] = useState(0);
    const [heightT, setHeigthT] = useState(0);
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let porcent = 0.697;
        let porcentT = 0.57;

        if(windowDimensions.height < 976) porcent = 0.685;
        if(windowDimensions.height < 960) porcent = 0.67;
        if(windowDimensions.height < 820) porcent = 0.662;
        if(windowDimensions.height < 770) porcent = 0.65;
        if(windowDimensions.height < 695) porcent = 0.635;
        if(windowDimensions.height < 630) porcent = 0.62;
        if(windowDimensions.height < 575) porcent = 0.60;
        if(windowDimensions.height < 535) porcent = 0.585;

        if(windowDimensions.height < 976) porcentT = 0.54;
        if(windowDimensions.height < 840) porcentT = 0.52;
        if(windowDimensions.height < 805) porcentT = 0.50;
        if(windowDimensions.height < 750) porcentT = 0.47;
        if(windowDimensions.height < 680) porcentT = 0.45;
        if(windowDimensions.height < 645) porcentT = 0.43;
        if(windowDimensions.height < 580) porcentT = 0.385;
        if(windowDimensions.height < 550) porcentT = 0.35;

        let r =  (windowDimensions.height * porcent);
        let b =  (windowDimensions.height * 0.81)
        let hT =  (windowDimensions.height * porcentT);
        console.log(hT, ' esto es ht')
        if(b>=420){
            setHeightR(r);
            setHeigthT(hT);
        }        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);
    const fucntionMenu = async (p) => {
        let arr = buttonsMenu, name = '';
        for (let i = 0; i < arr.length; i++) {
            if (i === p) {
                name = arr[i].button
                arr[i].selected = 'buttonSeleccted'
            } else {
                arr[i].selected = ''
            }
        }
        setButtonsMenu(arr);
        setSectionCategori(p);
        if (p !== 0) {
            reportVentaGastos({
                ...formFecha,
                nameCategori: name,
            })
        }
    }
    const getListCategoriaP = useCallback(async () => {
        const resp = await CategoriaProductosRoute.list();
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
            let arrMenu = [
                { rolePermit: [{ name: 'admin' }], button: 'Ventas', selected: 'buttonSeleccted', possition: 'left' }
            ]
            for (let i = 0; i < resp.resp.result.length; i++) {
                /*  { rolePermit: [{ name: 'admin' }], button: 'Ventas', selected: 'buttonSeleccted', possition: 'left' } */
                arrMenu.push({
                    rolePermit: [{ name: 'admin' }],
                    button: resp.resp.result[i].nombre,
                    selected: '',
                    possition: 'left'
                })
            }
            setButtonsMenu(arrMenu)
        }
    }, [msgToast])

    useEffect(() => {
        getListCategoriaP();
    }, [getListCategoriaP])

    const modalOpenClose = () => {
        setModalOneProduct(!modalOneProduct)
    }
    const changeButtons = async (p, name) => {
        const change = await buttons.map((data, key) => {
            if (key === p) {
                return {
                    ...data,
                    selected: 'buttonSeleccted'
                }
            } else {
                return {
                    ...data,
                    selected: ''
                }
            }

        })

        setButtons(change);

        setSection({
            title: name,
            position: p
        })
    }

    const detalleProductSelected = (data) => {
        setProductSelect(data);
        modalOpenClose();
    }
    const changePageV = (page) => {
        if (page === 0) { // para paginar la paginas
            setPagina({
                number: 0,
                c: 0,
            })
        } else {
            if (page === reporteVentaGatos.productVendido?.pageCount - 1) {
                setPagina({
                    number: reporteVentaGatos.productVendido?.pageCount > 3 ? reporteVentaGatos.productVendido?.pageCount - 4 : 0,
                    c: reporteVentaGatos.productVendido?.pageCount - 1
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
                    if (page < reporteVentaGatos.productVendido?.pageCount - 1) {
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

        reportVentaGastos({
            ...formFecha,
            pgnV: page,
        })

    }
    const changePageG = (page) => {
        if (page === 0) { // para paginar la paginas
            setPaginaG({
                number: 0,
                c: 0,
            })
        } else {
            if (page === reporteVentaGatos.gastosRealizados?.pageCount - 1) {
                setPaginaG({
                    number: reporteVentaGatos.gastosRealizados?.pageCount > 3 ? reporteVentaGatos.gastosRealizados?.pageCount - 4 : 0,
                    c: reporteVentaGatos.gastosRealizados?.pageCount - 1
                })
            } else {
                if (page > paginaG.c) {
                    if (page > 2) {
                        console.log(page - 2, ' 989898')
                        let obj = paginaG;
                        obj['number'] = page - 2
                        setPaginaG(obj)
                    }
                    let obj1 = paginaG;
                    obj1['c'] = page
                    setPaginaG(obj1)

                } else {
                    if (page < reporteVentaGatos.gastosRealizados?.pageCount - 1) {
                        if (paginaG.number !== 0) {
                            setPaginaG({
                                number: page - 2 < 0 ? 0 : page - 2,
                                c: page
                            });
                        }
                    }

                }
            }
        }

        reportVentaGastos({
            ...formFecha,
            pgnG: page,
        })

    }
    const setForm = (e) => {
        setPagina({
            number: 0,
            c: 0,
        });
        changeFormFecha(e);
    }
    const setFormG = (e) => {
        setPaginaG({
            number: 0,
            c: 0,
        });
        changeFormFecha(e);
    }
    return (
        <div className="conted-cierreCaja">
            <div className="cierre-caja" style={{height:heightR}}>
                <div className="header">
                    <h4>Del {reporteVentaGatos?.Fecha}</h4>
                    <div className='contend-input-venta'>
                        <input
                            type="date"
                            onChange={changeFormFecha}
                            name='fechaInicio'
                            value={formFecha.fechaInicio}
                            className='input-venta report1'
                            autoComplete="off"
                        ></input>
                        <label className='venta-label lReport1'>Fecha Inicio</label>
                    </div>
                    <div className='contend-input-venta'>
                        <input
                            type="date"
                            onChange={changeFormFecha}
                            name='fechaFinal'
                            value={formFecha.fechaFinal}
                            className='input-venta report1'
                            autoComplete="off"
                        ></input>
                        <label className='venta-label lReport1'>Fecha Final</label>
                    </div>
                </div>
                <div className="body reporte-gastos">
                    <li> Monto inicial en caja: {reporteVentaGatos?.montoInicial}</li>
                    <li>CantidadVendido: {reporteVentaGatos?.cantidadVendido}</li>
                    <li>Gastos realizados: {reporteVentaGatos?.gastosLength}</li>
                    <li>Total Ventas:  {reporteVentaGatos?.totalVentas} Bs</li>
                    <li>Gastos: {reporteVentaGatos?.gasatoTotal} Bs</li>
                    <li>Total: {reporteVentaGatos?.total} Bs</li>
                    {/*  <li>Total:  Bs</li> */}
                </div>
                <div className="footer">
                    <button className="buttonMenu" onClick={() => reportVentaGastos({
                        ...formFecha,
                        pgnV: 0,
                        pgsV: 6,
                        buscadorV: '',
                        pgnG: 0,
                        pgsG: 6,
                        buscadorG: ''
                    })}>Buscar</button>
                    {buttons.map((data, keys) => {
                        return (
                            <button key={keys} onClick={() => changeButtons(keys, data.button)} className={`buttonMenu ${data.selected}`}>{data.button}</button>
                        )
                    })}
                </div>
            </div>
            <div className="detalle" style={{height:heightR}}>
                <h4>{section.title}</h4>
                {section.position === 0 &&
                    <div className={RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                        <Menu
                            colors={colors}
                            buttons={buttonsMenu}
                            isButtonPosition={true}
                            functionsMenu={fucntionMenu}
                        />
                        {sectionCategori === 0 &&
                            <div style={{height:heightT}} className="contend-table tableOutModal">
                                <div className='content-search-sizePage'>
                                    <div className='content-left'>
                                        <select
                                            style={{
                                                border: colors ? `0.4px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                                backgroundColor: colors ? colors.colorGlobal : 'red',
                                                color: colors ? colors.colorHeader.colorText : 'red'

                                            }}
                                            name='pgsV'
                                            onChange={setForm}
                                            value={formFecha.pgsV}
                                            className='sizePage'
                                        >
                                            <option value='6'>6</option>
                                            <option value='10'>10</option>
                                            <option value='30'>30</option>

                                        </select>
                                        <label>Tamanio de pagina</label>
                                    </div>
                                    <div className='content-right'>
                                        <label>Buscar:</label>
                                        <input
                                            style={{
                                                border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                                backgroundColor: colors ? colors.colorGlobal : 'red',
                                                color: colors ? colors.colorHeader.colorText : 'red'

                                            }}
                                            name='buscadorV'
                                            onChange={setForm}
                                            value={formFecha.buscadorV}
                                            className='input-search'
                                            placeholder=''
                                        />
                                    </div>
                                </div>
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-headers">
                                            <th className="header" scope="col">N°</th>
                                            <th className="header" scope="col">N° venta</th>
                                            <th className="header" scope="col">Usuario</th>
                                            <th className="header" scope="col">Cliente</th>
                                            <th className="header" scope="col">Fecha</th>
                                            <th className="header" scope="col">Hora</th>

                                            <th className="header" scope="col">Efectivo</th>
                                            <th className="header" scope="col">Cambio</th>
                                            <th className="header" scope="col">Total</th>

                                            <th className="header" scope="col">Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {reporteVentaGatos.productVendido?.result.map((data, key) => {

                                            return (
                                                <tr key={key} className="table-row">
                                                    <td className="row-cell">{key + 1}</td>
                                                    <td className="row-cell">{data.venta}</td>
                                                    <td className="row-cell">{data.idUser}</td>
                                                    <td className="row-cell">{data.idCLiente}</td>
                                                    <td className="row-cell">{data.dateCreate?.split('T')[0]}</td>
                                                    <td className="row-cell">{data.hora}</td>
                                                    <td className="row-cell">{data.pagoCliente} Bs</td>
                                                    <td className="row-cell">{data.cambioCliente} Bs</td>
                                                    <td className="row-cell">{data.precioTotal} Bs</td>

                                                    <td className="row-cell">
                                                        <button onClick={() => detalleProductSelected(data)} className='tableButton'>Detalles</button>
                                                    </td>
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
                                            <th className="header" scope="col">{/* Total: {dataEstadoFinanciero.ventas?.sumEfectivoTotal} Bs */}</th>
                                            <th className="header" scope="col">{/* Total: {dataEstadoFinanciero.ventas?.sumCambio} Bs */}</th>
                                            <th className="header" scope="col">Total: {reporteVentaGatos?.totalVentas} Bs</th>

                                            <th className="header" scope="col"></th>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div className="content-pagination">
                                    <div className='content-pagination-left'>
                                        <label>Pagina {reporteVentaGatos.productVendido?.pageNumber + 1} de {reporteVentaGatos.productVendido?.pageCount}</label>
                                    </div>
                                    <div className='content-pagination-right'>

                                        {pagina.c > 2 && reporteVentaGatos.productVendido?.pageCount > 3 &&

                                            <div onClick={() => changePageV(0)} className='pagination-number'>
                                                1
                                            </div>
                                        }
                                        {pagina.c > 2 && reporteVentaGatos.productVendido?.pageCount > 3 &&
                                            <div className='pagination-number'>
                                                ...
                                            </div>
                                        }
                                        <List number={reporteVentaGatos.productVendido?.pageCount} num={pagina.number}>
                                            {(index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => changePageV(index)}
                                                        className={reporteVentaGatos.productVendido?.pageNumber === index ? 'pagination-number select' : 'pagination-number'} >
                                                        {index + 1}
                                                    </div>
                                                );
                                            }
                                            }
                                        </List>
                                        {pagina.c < reporteVentaGatos.productVendido?.pageCount - 3 &&
                                            <div className='pagination-number'>
                                                ...
                                            </div>
                                        }
                                        {pagina.c < reporteVentaGatos.productVendido?.pageCount - 3 &&
                                            <div
                                                className='pagination-number'
                                                onClick={() => changePageV(reporteVentaGatos.productVendido?.pageCount - 1)}
                                            >
                                                {reporteVentaGatos.productVendido?.pageCount}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {sectionCategori !== 0 &&
                            <div className="contend-table tableOutModal">
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-headers">
                                            <th className="header" scope="col">N°</th>
                                            <th className="header" scope="col">Nombre</th>
                                            <th className="header" scope="col">Descripcion</th>
                                            <th className="header" scope="col">Categoria</th>
                                            <th className="header" scope="col">Precio</th>
                                            <th className="header" scope="col">Cantidad</th>
                                            <th className="header" scope="col">Total</th>


                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {reporteVentaGatos.productCategory?.arrProductCategory.map((data, key) => {

                                            return (
                                                <tr key={key} className="table-row">
                                                    <td className="row-cell">{key + 1}</td>
                                                    <td className="row-cell">{data.nameProduct}</td>
                                                    <td className="row-cell">{data.detalleVenta}</td>
                                                    <td className="row-cell">{data.category}</td>
                                                    <td className="row-cell">{data.precioUnitario} Bs</td>
                                                    <td className="row-cell">{data.cantidad}</td>
                                                    <td className="row-cell">{data.total}</td>


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
                                            <th className="header" scope="col">Total:{reporteVentaGatos.productCategory?.sumTotal} Bs</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        }

                    </div>
                }
                {section.position === 1 &&

                    <div className={RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                        <div className="contend-table tableOutModal">
                            <div className='content-search-sizePage'>
                                <div className='content-left'>
                                    <select
                                        style={{
                                            border: colors ? `0.4px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                            backgroundColor: colors ? colors.colorGlobal : 'red',
                                            color: colors ? colors.colorHeader.colorText : 'red'

                                        }}
                                        name='pgsG'
                                        onChange={setFormG}
                                        value={formFecha.pgsG}
                                        className='sizePage'
                                    >
                                        <option value='6'>6</option>
                                        <option value='10'>10</option>
                                        <option value='30'>30</option>

                                    </select>
                                    <label>Tamanio de pagina</label>
                                </div>
                                <div className='content-right'>
                                    <label>Buscar:</label>
                                    <input
                                        style={{
                                            border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                            backgroundColor: colors ? colors.colorGlobal : 'red',
                                            color: colors ? colors.colorHeader.colorText : 'red'

                                        }}
                                        name='buscadorG'
                                        onChange={setFormG}
                                        value={formFecha.buscadorG}
                                        className='input-search'
                                        placeholder=''
                                    />
                                </div>
                            </div>
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-headers">
                                        <th className="header" scope="col">N°</th>
                                        <th className="header" scope="col">Categoria</th>
                                        <th className="header" scope="col">Usuario</th>
                                        <th className="header" scope="col">Fecha</th>
                                        <th className="header" scope="col">Hora</th>

                                        <th className="header" scope="col">Descripcion</th>

                                        <th className="header" scope="col">Asignado a</th>
                                        {/* <th className="header" scope="col">¿Se actualizo?</th> */}
                                        <th className="header" scope="col">Monto de gasto</th>
                                        {/*  <th className="header" scope="col">Opciones</th> */}
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {reporteVentaGatos.gastosRealizados?.result.map((data, key) => {
                                        return (
                                            <tr key={key} className="table-row">
                                                <td className="row-cell">{key + 1}</td>
                                                <td className="row-cell">{data.idTipoGastos}</td>
                                                <td className="row-cell">{data.idUser}</td>

                                                <th className="header" scope="col">{data.dateCreate}</th>
                                                <th className="header" scope="col">{data.hora}</th>

                                                <td className="row-cell">{data.description}</td>
                                                <td className="row-cell">{data.montoAsignadoA}</td>
                                                {/* <td className="row-cell">{data.isUpdate ? 'si' : 'no'}</td> */}
                                                <td className="row-cell">{data.montoGasto} Bs</td>

                                                {/* <td className="row-cell">
                                                    <button className='tableButton'>Detalles</button>
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
                                        {/*  <th className="header" scope="col"></th> */}
                                        <th className="header" scope="col">Total: {reporteVentaGatos?.gasatoTotal} Bs</th>

                                        {/* <th className="header" scope="col"></th> */}
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="content-pagination">
                                <div className='content-pagination-left'>
                                    <label>Pagina {reporteVentaGatos.gastosRealizados?.pageNumber + 1} de {reporteVentaGatos.gastosRealizados?.pageCount}</label>
                                </div>
                                <div className='content-pagination-right'>

                                    {paginaG.c > 2 && reporteVentaGatos.gastosRealizados?.pageCount > 3 &&

                                        <div onClick={() => changePageG(0)} className='pagination-number'>
                                            1
                                        </div>
                                    }
                                    {paginaG.c > 2 && reporteVentaGatos.gastosRealizados?.pageCount > 3 &&
                                        <div className='pagination-number'>
                                            ...
                                        </div>
                                    }
                                    <List number={reporteVentaGatos.gastosRealizados?.pageCount} num={paginaG.number}>
                                        {(index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => changePageG(index)}
                                                    className={reporteVentaGatos.gastosRealizados?.pageNumber === index ? 'pagination-number select' : 'pagination-number'} >
                                                    {index + 1}
                                                </div>
                                            );
                                        }
                                        }
                                    </List>
                                    {paginaG.c < reporteVentaGatos.gastosRealizados?.pageCount - 3 &&
                                        <div className='pagination-number'>
                                            ...
                                        </div>
                                    }
                                    {paginaG.c < reporteVentaGatos.gastosRealizados?.pageCount - 3 &&
                                        <div
                                            className='pagination-number'
                                            onClick={() => changePageG(reporteVentaGatos.gastosRealizados?.pageCount - 1)}
                                        >
                                            {reporteVentaGatos.gastosRealizados?.pageCount}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <Modal
                colors={colors}
                isOpen={modalOneProduct}
                onClose={modalOpenClose}
                size='60%'
                title='Detalles de venta'
            >
                <table className="table">
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
                        {productSelected.products?.map((data, key) => {
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
                    <tfoot className="table-head">
                        <tr>

                            <th className="header" scope="col">{productSelected.idUser}</th>
                            <th className="header" scope="col"></th>
                            {/*  <th className="header" scope="col">N° venta</th> */}
                            <th className="header" scope="col">Venta:{productSelected.venta}</th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col">Total: {productSelected.precioTotal} Bs</th>


                        </tr>
                    </tfoot>
                </table>
                <button onClick={modalOpenClose} className="buttonMenu"> Cerrar</button>
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

export default ReporteVentasGastos
