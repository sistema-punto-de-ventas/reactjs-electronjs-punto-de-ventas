import React, { useState, useEffect, useCallback, useRef } from 'react';
import './styleFinanciero.css';
import EstadoFinancieroRoute from '../../routes/EstadoFinanciero';
import Form from '../Form';
import LoginRutes from '../../routes/Login';
import Modal from '../Modal';
import Menu from '../Menu'
import CategoriaProductosRoute from '../../routes/CategoriaProductos';
import getWindowDimensions from '../Hooks.js/windowDimensions'
import GeneratorPDF from '../generador_de_pdf/generador_de_pdf';
import Redondear from '../../utils/redondeNumeros/redondeNumeros';

import socketIoClient from 'socket.io-client'
const buttonsArr = [
    { button: 'Lista de ventas', selected: 'buttonSeleccted' },
    { button: 'Lista de gastos', selected: '' },
    { button: 'Cierre de caja', selected: '' },
]
const formC = [
    {
        disable: false, error: '', isRequired: true, focus: '', name: 'idCajero', label: 'Caja', value: '', tipe: 'select', options: [
            //este arr se llena desde list tipo gastos
        ]
    },
    /* {
        disable: false, error: '', isRequired: true, focus: '', name: 'conformidadAdministrador', label: 'Confirmacion ', value: '', tipe: 'select', options: [
            {value: '',name: ''}
        ]        
    }, */
    { disable: false, error: '', isRequired: true, focus: '', name: 'detalle', label: 'Detalle de cierre de caja', value: '', tipe: 'textarea' },

]
const menuButton = [
    { rolePermit: [{ name: 'admin' }], button: 'Ventas', selected: 'buttonSeleccted', possition: 'left' },

    //dinamicButton menu

]
function EstadoFinanciero({ modalFunction, RouteOnliAdmin, msgToast, colors, changeCierreCaja, listGastos }) {
    const [formCIerreCaja, setFormCierreCaja] = useState(formC);
    const [buttons, setButtons] = useState(buttonsArr);
    const [section, setSection] = useState({
        title: 'Lista de ventas',
        position: 0
    });
    const [dataEstadoFinanciero, setDataEstadoFinanciero] = useState({});
    const [modalOneProduct, setModalOneProduct] = useState(false)
    const [product, setProduct] = useState({});

    const [buttonsMenu, setButtonsMenu] = useState(menuButton);
    const [sectionCategori, setSectionCategori] = useState(0);

    const [productCategoriList, setProductCategoriList] = useState({});

    const [formPagination, setFormPagination] = useState({
        pgnV: 0,
        pgsV: 6,
        buscadorV: '',
        pgnG: 0,
        pgsG: 6,
        buscadorG: '',
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
        if(b>=420){
            setHeightR(r);
            setHeigthT(hT);
        }        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);

    const setFormG = (e) => {
        setPaginaG({
            number: 0,
            c: 0,
        });
        changePagination(e);
    }

    //para el formulario de la paginacion
    const changePagination = (e) => {
        const { value, name } = e.target;
        setFormPagination({
            ...formPagination,
            [name]: value
        });
        console.log(name === 'pgsV' || name === 'buscadorV' ? 0 : formPagination.pgnV, ' esto =================================================================')
        getEstdoFinancieroActivo({
            pgnV: name === 'pgsV' || name === 'buscadorV' ? 0 : formPagination.pgnV,
            pgsV: name === 'pgsV' ? value : formPagination.pgsV,
            buscadorV: name === 'buscadorV' ? value : formPagination.buscadorV,
            pgnG: name === 'pgsG' || name === 'buscadorG' ? 0 : formPagination.pgnG,
            pgsG: name === 'pgsG' ? value : formPagination.pgsG,
            buscadorG: name === 'buscadorG' ? value : formPagination.buscadorG,
        })
    }

    //cambiar de pagian para la lista de ventas
    const changePageV = (page) => {
        if (page === 0) { // para paginar la paginas
            setPagina({
                number: 0,
                c: 0,
            })
        } else {
            if (page === dataEstadoFinanciero.listVentas?.pageCount - 1) {
                setPagina({
                    number: dataEstadoFinanciero.listVentas?.pageCount > 3 ? dataEstadoFinanciero.listVentas?.pageCount - 4 : 0,
                    c: dataEstadoFinanciero.listVentas?.pageCount - 1
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
                    if (page < dataEstadoFinanciero.listVentas?.pageCount - 1) {
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

        setFormPagination({
            ...formPagination,
            pgnV: page
        });
        getEstdoFinancieroActivo({
            ...formPagination,
            pgnV: page
        })
    }

    //cambiar la pagina de lista de gastos
    const changePageG = (page) => {
        if (page === 0) { // para paginar la paginas
            setPaginaG({
                number: 0,
                c: 0,
            })
        } else {
            if (page === dataEstadoFinanciero.listGastos?.pageCount - 1) {
                setPaginaG({
                    number: dataEstadoFinanciero.listGastos?.pageCount > 3 ? dataEstadoFinanciero.listGastos?.pageCount - 4 : 0,
                    c: dataEstadoFinanciero.listGastos?.pageCount - 1
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
                    if (page < dataEstadoFinanciero.listGastos?.pageCount - 1) {
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
        setFormPagination({
            ...formPagination,
            pgnG: page
        });
        getEstdoFinancieroActivo({
            ...formPagination,
            pgnG: page
        })

    }


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
            getPorductosCategori(name)
        }
    }

    const changeButtons = async (p, name) => {
        console.log(p, name, ' =================================================================')
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
        if(name !== 'Cierre de caja'){
            getEstdoFinancieroActivo(formPagination)
        }
    }

    useEffect(() => {
        const getUserCajaActivos = async () => {
            const resp = await LoginRutes.getUserCajaActivo();
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
                var arr = [];
                for (let i = 0; i < resp.resp.result.length; i++) {

                    arr.push({
                        value: resp.resp.result[i]._id,
                        name: `${resp.resp.result[i].name} ${resp.resp.result[i].lastName}`

                    })

                }
                const esto = await formC.map((data) => {
                    if (data.tipe === 'select') {
                        return {
                            ...data,
                            options: arr
                        }
                    }
                    return data
                })
     
                setFormCierreCaja(esto)
            }
        }
        
       
    
        
        getUserCajaActivos();
    }, [msgToast]);

    const getEstdoFinancieroActivo = useCallback(async (form = {}) => {
        console.log(form, ' esto es 00000')
        const resp = await EstadoFinancieroRoute.getEstadoFinanciero(form);
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
            setDataEstadoFinanciero(resp.resp.result)
        }
    }, [msgToast]);

    useEffect(() => {
        getEstdoFinancieroActivo();
        
        // const socket = socketIoClient('http://127.0.0.0:4000');
        // socket.on('[ventasGastos] reporte',(data)=>{
        //     console.log(':1010101010101010100110')
        //     getEstdoFinancieroActivo();
        // })
   
    }, [getEstdoFinancieroActivo, changeCierreCaja])
    const inserData = async (data) => {

        const dataCierreCaja = {
            conformiadCajero: true,
            conformidadAdministrador: true,
            detalle: data.detalle,
            idCajero: data.idCajero
        }
        console.log(dataCierreCaja, ' estoes ')
        const resp = await EstadoFinancieroRoute.cierreCaja(dataCierreCaja);
        if (resp.error) {
            msgToast({
                msg: resp.err.message,
                tipe: 'warning',
                title: `Error ${resp.err.status}`
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
            msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            getEstdoFinancieroActivo();
            listGastos();//para reiniciar la lista de gastos y ventas
        }
    }
    const dataProduct = (data) => {
        console.log(data, ' esto es [[[[')
        setProduct(data)
        setModalOneProduct(!modalOneProduct)
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

    const updaDateResquest=()=>{
        console.log('update data')
        getEstdoFinancieroActivo()
    };

    //list productos segun us categoria del estado financiero
    const getPorductosCategori = async (categoria) => {
        const resp = await CategoriaProductosRoute.getPorductosCategori(categoria);
        console.log(resp, ' esto es la lista de categorias del producto')
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
            setProductCategoriList(resp.resp.result)
        }
    }


        // cambia de color al text de ala tabal para generar el pdf con letras de color negro
        const [style, setStyle]= useState({style:{color:"white !important"}});
        const handlerColor=async(e)=>{
            
            style.color==='black'?setStyle({...style,color:'white'}):setStyle({...style,color:'black'})
        }
        
        // genera un pdf de al tabla
        const myRef = useRef();
        const generatePdf =()=>{
            
            GeneratorPDF(myRef, 'a2');
        }

    return (
        <>
            <div className="conted-cierreCaja">
                <div className="cierre-caja">
                    <div className="header">
                        <h1>Cierre de caja</h1>
                    </div>
                    <div className="body">
                        <li>Monto inicial en caja Bs: {dataEstadoFinanciero.montoInicial}</li>
                        <li>Cantidad de Ventas: {dataEstadoFinanciero.cantidadVendido} </li>
                        <li>Cantidad de Gastos:  {dataEstadoFinanciero.cantidadDeGastos}</li>

                        <li>Total Gastos Bs:  {dataEstadoFinanciero.montoActualUtilizado}</li>
                        <li>Total Ventas Bs:  {dataEstadoFinanciero.ventas?.total}</li>
                        <li>Total Bs: {dataEstadoFinanciero?.montoActualDisponble}</li>
                        {/*  <li>Total:  Bs</li> */}
                    </div>
                    <div className="footer">
                        {buttons.map((data, keys) => {
                            return (
                                <button key={keys} onClick={() => changeButtons(keys, data.button)} className={`buttonMenu ${data.selected}`}>{data.button}</button>
                            )
                        })}
                    </div>
                </div>
                {/* <div className="detalle" style={{height: heightR}}> */}
                <div className="detalle" >
                    <h4>{section.title}</h4>
                    {section.position === 0 &&
                        <>
                            <div className={RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                                <Menu
                                    colors={colors}
                                    buttons={buttonsMenu}
                                    isButtonPosition={true}
                                    functionsMenu={fucntionMenu}
                                />
                                {/* style={{height:heightT}} */}
                                {sectionCategori === 0 &&
                                    <div id='caja-content-table' className="contend-table tableOutModal">
                                        <div className='content-search-sizePage'>
                                            <div className='content-left'>
                                                <select
                                                    style={{
                                                        border: colors ? `0.4px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                                        color: colors ? colors.colorHeader.colorText : 'red'

                                                    }}
                                                    name='pgsV'
                                                    onChange={changePagination}
                                                    value={formPagination.pgsV}
                                                    className='sizePage'
                                                >
                                                    <option value='5'>5</option>
                                                    <option value='30'>30</option>
                                                    <option value='50'>50</option>
                                                    <option value='100'>100</option>

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
                                                    name='buscadorV'
                                                    onChange={changePagination}
                                                    value={formPagination.buscadorV}
                                                    className='input-search'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                        
                                        <table ref={myRef} id="caja-list-ventas" className="table" style={style}>
                                            <thead className="table-head">
                                                <tr className="table-headers">
                                                    <th className="header" scope="col" style={style}>N°</th>
                                                    <th className="header" scope="col" style={style}>N° venta</th>
                                                    <th className="header" scope="col" style={style}>Usuario</th>
                                                    <th className="header" scope="col" style={style}>Cliente</th>
                                                    <th className="header" scope="col" style={style}>F / H</th>
                                                    <th className="header" scope="col" style={style}>Efectivo</th>
                                                    <th className="header" scope="col" style={style}>Cambio</th>
                                                    <th className="header" scope="col" style={style}>Total</th>

                                                    <th className="header" scope="col" style={style}>Opciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-body" style={style}>
                                                {dataEstadoFinanciero.listVentas?.result.map((data, key) => {

                                                    return (
                                                        <tr key={key} className="table-row">
                                                            <td className="row-cell">{key + 1}</td>
                                                            <td className="row-cell">{data.venta}</td>
                                                            <td className="row-cell">{data.idUser}</td>
                                                            <td className="row-cell">{data.idCLiente}</td>
                                                            <td className="row-cell">{data.dateCreate?.split('T')[0]}</td>

                                                            <td className="row-cell">{data.pagoCliente} Bs</td>
                                                            <td className="row-cell">{data.cambioCliente} Bs</td>
                                                            <td className="row-cell">{data.precioTotal} Bs</td>

                                                            <td className="row-cell">
                                                                <button onClick={() => dataProduct(data)} className='tableButton'>Detalles</button>
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
                                                    <th className="header" scope="col" style={style}>Efectivo: {dataEstadoFinanciero.ventas?.sumEfectivoTotal} Bs</th>
                                                    <th className="header" scope="col" style={style}>Cambio: {dataEstadoFinanciero.ventas?.sumCambio} Bs</th>
                                                    <th className="header" scope="col" style={style}>Total: {dataEstadoFinanciero.ventas?.total} Bs</th>

                                                    <th className="header" scope="col"></th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div className="content-pagination">
                                            <div className='content-pagination-left'>
                                                <label>
                                                    Pagina {dataEstadoFinanciero.listVentas?.pageNumber + 1} de
                                                    {dataEstadoFinanciero.listVentas?.pageCount}
                                                </label>
                                            </div>
                                            <div className='content-pagination-right'>

                                                {pagina.c > 2 && dataEstadoFinanciero.listVentas?.pageCount > 3 &&

                                                    <div onClick={() => changePageV(0)} className='pagination-number'>
                                                        1
                                                    </div>
                                                }
                                                {pagina.c > 2 && dataEstadoFinanciero.listVentas?.pageCount > 3 &&
                                                    <div className='pagination-number'>
                                                        ...
                                                    </div>
                                                }
                                                <List number={dataEstadoFinanciero.listVentas?.pageCount} num={pagina.number}>
                                                    {(index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                onClick={() => changePageV(index)}
                                                                className={dataEstadoFinanciero.listVentas?.pageNumber === index ? 'pagination-number select' : 'pagination-number'} >
                                                                {index + 1}
                                                            </div>
                                                        );
                                                    }
                                                    }
                                                </List>
                                                {pagina.c < dataEstadoFinanciero.listVentas?.pageCount - 3 &&
                                                    <div className='pagination-number'>
                                                        ...
                                                    </div>
                                                }
                                                {pagina.c < dataEstadoFinanciero.listVentas?.pageCount - 3 &&
                                                    <div
                                                        className='pagination-number'
                                                        onClick={() => changePageV(dataEstadoFinanciero.listVentas?.pageCount - 1)}
                                                    >
                                                        {dataEstadoFinanciero.listVentas?.pageCount}
                                                    </div>
                                                }
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
                                }
                                {sectionCategori !== 0 &&
                                    <div id='caja-content-table' className="contend-table tableOutModal">
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
                                                {productCategoriList.filterData?.map((data, key) => {

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
                                                    <th className="header" scope="col">Total:{productCategoriList.sumTotal} Bs</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                }

                            </div>
                        </>

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
                                            value={formPagination.pgsG}
                                            className='sizePage'
                                        >
                                            <option value='6'>6</option>
                                            <option value='10'>10</option>
                                            <option value='30'>30</option>

                                        </select>
                                        <label>Tamaño de pagina</label>
                                    </div>
                                    
                                    <div className='content-right'>
                                    <button className="btn-op" onClick={updaDateResquest}>
                                        Actualizar
                                    </button>
                                    <button onClick={() => modalFunction(1)} className="btn-op">Nuevo gasto</button>

                                        <label>Buscar:</label>
                                        <input
                                            style={{
                                                border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                                backgroundColor: colors ? colors.colorGlobal : 'red',
                                                color: colors ? colors.colorHeader.colorText : 'red'

                                            }}
                                            name='buscadorG'
                                            onChange={setFormG}
                                            value={formPagination.buscadorG}
                                            className='input-search'
                                            placeholder=''
                                        />
                                    </div>
                                </div>
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-headers">
                                            <th className="header" scope="col">N</th>
                                            <th className="header" scope="col">Categoria</th>
                                            <th className="header" scope="col">Usuario</th>
                                            <th className="header" scope="col">Descripcion</th>

                                            <th className="header" scope="col">Asignado a</th>
                                            {/* <th className="header" scope="col">¿Se actualizo?</th> */}
                                            <th className="header" scope="col">Monto de gasto</th>
                                            {/* <th className="header" scope="col">Opciones</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {dataEstadoFinanciero.listGastos?.result.map((data, key) => {
                                            return (
                                                <tr key={key} className="table-row">
                                                    <td className="row-cell">{key + 1}</td>
                                                    <td className="row-cell">{data.idTipoGastos}</td>
                                                    <td className="row-cell">{data.idUser}</td>
                                                    <td className="row-cell">{data.description}</td>


                                                    <td className="row-cell">{data.montoAsignadoA}</td>
                                                    {/*  <td className="row-cell">{data.isUpdate ? 'si' : 'no'}</td> */}
                                                    <td className="row-cell">{(data.montoGasto).toLocaleString()} Bs</td>

                                                    {/*  <td className="row-cell">
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
                                            {/* <th className="header" scope="col"></th> */}
                                            <th className="header" scope="col">Total: {dataEstadoFinanciero?.totalGastos} Bs</th>

                                            {/* <th className="header" scope="col"></th> */}
                                        </tr>
                                    </tfoot>
                                </table>
                                <div className="content-pagination">
                                    <div className='content-pagination-left'>
                                        <label>Pagina {dataEstadoFinanciero.listGastos?.pageNumber + 1} de {dataEstadoFinanciero.listGastos?.pageCount}</label>
                                    </div>
                                    <div className='content-pagination-right'>

                                        {paginaG.c > 2 && dataEstadoFinanciero.listGastos?.pageCount > 3 &&

                                            <div onClick={() => changePageG(0)} className='pagination-number'>
                                                1
                                            </div>
                                        }
                                        {paginaG.c > 2 && dataEstadoFinanciero.listGastos?.pageCount > 3 &&
                                            <div className='pagination-number'>
                                                ...
                                            </div>
                                        }
                                        <List number={dataEstadoFinanciero.listGastos?.pageCount} num={paginaG.number}>
                                            {(index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => changePageG(index)}
                                                        className={dataEstadoFinanciero.listGastos?.pageNumber === index ? 'pagination-number select' : 'pagination-number'} >
                                                        {index + 1}
                                                    </div>
                                                );
                                            }
                                            }
                                        </List>
                                        {paginaG.c < dataEstadoFinanciero.listGastos?.pageCount - 3 &&
                                            <div className='pagination-number'>
                                                ...
                                            </div>
                                        }
                                        {paginaG.c < dataEstadoFinanciero.listGastos?.pageCount - 3 &&
                                            <div
                                                className='pagination-number'
                                                onClick={() => changePageG(dataEstadoFinanciero.listGastos?.pageCount - 1)}
                                            >
                                                {dataEstadoFinanciero.listGastos?.pageCount}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {section.position === 2 && dataEstadoFinanciero.listVentas?.result.length > 0 ?
                        <Form
                            form={formCIerreCaja}
                            colors={colors}
                            submit={inserData}
                            isUpdate={false}
                        >

                        </Form>
                        : section.position === 2 &&
                        <h3>No hay ventas realizadas para el cierre de caja</h3>
                    }

                </div>

            </div>
            <Modal
                colors={colors}
                isOpen={modalOneProduct}
                onClose={dataProduct}
                size='60%'
                title='Detalles de venta'
            >
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-headers">
                            <th className="header" scope="col">N°</th>
                            <th className="header" scope="col">Nombre</th>
                            {/* <th className="header" scope="col">Descripcion</th> */}
                            <th className="header" scope="col">Descuento</th>
                            <th className="header" scope="col">Categoria</th>
                            <th className="header" scope="col">Precio</th>
                            <th className="header" scope="col">Cantidad Vendido</th>
                            <th className="header" scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {product.products?.map((data, key) => {
                            return (
                                <tr key={key} className="table-row">
                                    <td className="row-cell">{key + 1}</td>
                                    <td className="row-cell">{data.nameProduct}</td>
                                    <td className="row-cell">{data.descuentoUnidad?data.descuentoUnidad:0} Bs.</td>
                                    <td className="row-cell">{data.category}</td>
                                    <td className="row-cell">{data.precioUnitario}</td>
                                    <td className="row-cell">{data.unidadesVendidos}</td>
                                    <td className="row-cell">{data.total} Bs </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="table-head">
                        <tr>

                            <th className="header" scope="col">{product.idUser}</th>
                            <th className="header" scope="col"></th>
                            {/*  <th className="header" scope="col">N° venta</th> */}
                            <th className="header" scope="col">Venta:{product.venta}</th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col"></th>
                            <th className="header" scope="col">Total: {product.precioTotal} Bs</th>


                        </tr>
                    </tfoot>
                </table>
                <button onClick={dataProduct} className="buttonMenu"> Cerrar</button>
            </Modal>

        </>
    )
}

function List(props) {
    let item = [];
    for (let i = 0; i < props.number; i++) {
        item.push(props.children(i));
    }
    const data = item.slice(0 + props.num, 10 + props.num);
    return data
}

export default EstadoFinanciero
