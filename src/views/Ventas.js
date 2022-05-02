import React from "react";
import Menu from '../components/Menu';
import NuevaVenta from "../components/Ventas/NuevaVenta";
import Modal from '../components/Modal';
import Form from "../components/Form";
import GastosRoutes from '../routes/Gastos';
import ListVentasUser from '../components/Ventas/ListVentasUser';
import EstadoFinanciero from '../components/EstadoFinanciero/EstadoFinanciero';
import EstadoFinancieroRoute from '../routes/EstadoFinanciero';
import ListaEstadosFinancieros from '../components/EstadoFinanciero/ListaEstadosFinancieros'
import ReporteVentasGastos from "../components/EstadoFinanciero/ReporteVentasGastos";
import Gastos from '../components/Ventas/gastos'
import './Styles/VentasStyle.css';
import ListStateOrdenRestaurante from "../components/listVentasStateOrdenRestaurante/listStateOrdenRestaurante";

const formDatas = [
    {
        disable: false, error: '', isRequired: true, focus: '', name: 'idTipoGastos', label: 'Tipo de gasto', value: '', tipe: 'select', options: [
            //este arr se llena desde list tipo gastos
        ]
    },
    { disable: false, error: '', isRequired: true, focus: '', name: 'description', label: 'Descripcion', value: '', tipe: 'textarea' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'montoGasto', label: 'Monto de gasto', value: '', tipe: 'number' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'montoAsignadoA', label: 'Nombre al que se asigna el gasto', value: '', tipe: 'text' },
]
const montoIncial = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'montoInicial', label: 'Monto inicial en caja', value: '', tipe: 'number' },
]

const formUpdateDatas = [
    {
        disable: false, error: '', isRequired: true, focus: '', name: 'idTipoGastos', label: 'Tipo de gasto', value: '', tipe: 'select', options: [
            //este arr se llena desde list tipo gastos
        ]
    },
    { disable: false, error: '', isRequired: true, focus: '', name: 'description', label: 'Descripcion', value: '', tipe: 'textarea' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'montoGasto', label: 'Monto de gasto', value: '', tipe: 'number' },
]
class Ventaas extends React.Component {
    state = {
        formFecha: {
            fechaInicio: '',
            fechaFinal: '',
            pgnV: 0, 
            pgsV: 6, 
            buscadorV: '',
            pgnG: 0,
            pgsG: 6,
            buscadorG: '',
            nameCategori:''
        },
        isPermitRoute: null,
        buttonsMenu: [
            { rolePermit: [{ name: 'admin' }, { name: 'caja' }], button: 'Nueva venta', selected: 'buttonSeleccted', possition: 'left' },
            { rolePermit: [{ name: 'admin' }, { name: 'caja' }], button: 'Gastos', selected: '', possition: 'left' },
            { rolePermit: [{ name: 'admin' }, { name: 'caja' }], button: 'Ventas del Dia', selected: '', possition: 'left' },
            { rolePermit: [{ name: 'admin' }], button: 'Reporte de ventas y gastos', selected: '', possition: 'rigth' },
            { rolePermit: [{ name: 'admin' }], button: 'Caja', selected: '', possition: 'rigth' },
            { rolePermit: [{ name: 'admin' }], button: 'Lista de Estados financieros', selected: '', possition: 'rigth' },
            { rolePermit: [{ name: 'admin' }], button: 'Monto de inicio en caja', selected: '', possition: 'rigth' },
            // { rolePermit: [{ name: 'admin' }, { name: 'Tickets' }], button: 'Tickets', selected: '', possition: 'left' }

        ],
        sectionContainer: 0,

        totalGastos: 0,
        listGastos: [],

        form: formDatas,
        updateForm: formUpdateDatas,
        updateMontoInicial: montoIncial,
        modals: {
            isOpen: false,
            isOpen1: false,
            isOpen2: false
        },
        idSelected: '',
        reporteVentaGatos: {},
        changeCierreCaja: false, // esta variable sirve para cambiara el estado de cierre de caja para que se vea reflejado los cambios
        buttonTable: 0, // esto son los botones de la table para que se activen o no segun el numero
        formGastosPagination: {
            numPagina: 0,
            tamanioPagina: 5,
            buscador: '',
            isUser: true
        },
        pages: {
            totalPages: 0,
            pageNum: 0,
        },
        pagina: {
            number: 0,
            c: 0,
        }
    }

    //verifica si los permisos para cada button los quita o los agrega segun su rol
    buttonMenuDinamic = async () => {
        const buttonsMenu = await this.props.menuButtonsPermit(this.state.buttonsMenu);
        this.setState({
            buttonsMenu,
        });
    }
    //mostrar modal
    modalFunction = (p) => {
        console.log(p, ' esto es')
        if (p === 1) {
            //este for borrara los datos almacenados que se hacen desde el button detalles del cardUser
            var array = this.state.form
            for (let i = 0; i < array.length; i++) {
                array[i].value = '';
                array[i].focus = '';
            }
        }
        this.setState({
            modals: {
                isOpen: p === 1 ? !this.state.modals.isOpen : this.state.modals.isOpen,
                isOpen1: p === 2 ? !this.state.modals.isOpen1 : this.state.modals.isOpen1,
                isOpen2: p === 3 ? !this.state.modals.isOpen2 : this.state.modals.isOpen2
            }
        });
    }
    //esta fucnion es para las funciones del menu
    fucntionMenu = (p) => {
        console.log(p)
        if (p !== 6) {
            let arr = this.state.buttonsMenu
            for (let i = 0; i < arr.length; i++) {
                if (i === p) {
                    arr[i].selected = 'buttonSeleccted'
                } else {
                    arr[i].selected = ''
                }
            }
            this.setState({
                buttonsMenu: arr,
                sectionContainer: p
            })
        } else {
            this.modalFunction(3);
        }

    }
    clickProduct = (data, idGastoUser) => {
        this.modalFunction(2)
        var arr = this.state.updateForm;

        for (let i = 0; i < arr.length; i++) {
            for (const name in data) {
                if (name === arr[i].name) {
                    arr[i].value = data[name] ? data[name] : '';
                    arr[i].focus = data[name] ? 'active' : '';
                }
            }
        }
        this.setState({
            modals: {
                isOpen: this.state.modals.isOpen,
                isOpen1: !this.state.modals.isOpen1
            },
            updateForm: arr,
            idSelected: idGastoUser
        });
    }
    //registrar gasto del usuario
    inserData = async (data) => {
        const resp = await GastosRoutes.createGastoUser(data);
        if (resp.error) {
            this.props.msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error 400'
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.modalFunction(1);
            this.listGastos(this.state.formGastosPagination, true);
        }
    }
    updateDatas = async (data) => {
        const resp = await GastosRoutes.updateGastosUser(data, this.state.idSelected);
        if (resp.error) {
            this.props.msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error 400'
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.modalFunction(2);
            this.listGastos();
        }
    }
    //lista tipo de gastos para el formulario
    listTipoGasto = async () => {
        const resp = await GastosRoutes.listTipoGastos();
        if (resp.error) {
            this.props.msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error 400'
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: 'No se puede mostrar los datos',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            let arr = this.state.form
            arr[0].options = resp.resp.result;
            this.setState({
                form: arr,
                updateForm: arr
            });
        }
    }
    //formulario de paginacion
    changeFormPaginationGastos = (e) => {
        const { value, name } = e.target;
        this.setState({
            formGastosPagination: {
                ...this.state.formGastosPagination,
                [name]: value,
                numPagina: 0
            },
            pagina: {
                number: 0,
                c: 0,
            }

        })
        this.listGastos({
            numPagina: 0,
            tamanioPagina: name === 'tamanioPagina' ? value : this.state.formGastosPagination.tamanioPagina,
            buscador: name === 'buscador' ? value : this.state.formGastosPagination.buscador,
            isUser: this.state.formGastosPagination.isUser
        })
    }

    //para cambiar de pagina de la lista de gastos
    changePage = (page) => {
        if (page === 0) { // para paginar la paginas
            this.setState({
                pagina: {
                    number: 0,
                    c: 0,
                }
            })
        } else {
            if (page === this.state.pages.totalPages - 1) {
                this.setState({
                    pagina: {
                        number: this.state.pages.totalPages > 3 ? this.state.pages.totalPages - 4 : 0,
                        c: this.state.pages.totalPages - 1
                    }
                })
            } else {
                if (page > this.state.pagina.c) {
                    if (page > 2) {
                        console.log(page - 2, ' 989898')
                        let obj = this.state.pagina;
                        obj['number'] = page - 2;
                        this.setState({
                            pagina: obj
                        })
                    }
                    let obj1 = this.state.pagina;
                    obj1['c'] = page;
                    this.setState({
                        pagina: obj1
                    })

                } else {
                    if (page < this.state.pages.totalPages - 1) {
                        if (this.state.pagina.number !== 0) {
                            this.setState({
                                pagina: {
                                    number: page - 2 < 0 ? 0 : page - 2,
                                    c: page
                                }
                            });
                        }
                    }

                }
            }
        }        
        this.setState({
            formGastosPagination: {
                ...this.state.formGastosPagination,
                numPagina: page
            }
        })
        this.listGastos({
            ...this.state.formGastosPagination,
            numPagina: page

        });
    }

   

    buttonTableClick = (p, funct) => {
        this.setState({
            buttonTable: p
        })
        if (funct === 'listGastos') {
            this.setState({
                formGastosPagination: {
                    ...this.state.formGastosPagination,
                    isUser: false,
                    numPagina: 0
                },
                pagina: {
                    number: 0,
                    c: 0,
                }

            })
            this.listGastos({

                ...this.state.formGastosPagination,
                isUser: false,
                numPagina: 0

            });
            return;
        }
        if (funct === 'listGastosUser') {
            this.setState({
                formGastosPagination: {
                    ...this.state.formGastosPagination,
                    isUser: true,
                    numPagina: 0
                },
                pagina: {
                    number: 0,
                    c: 0,
                }

            })
            this.listGastos({

                ...this.state.formGastosPagination,
                isUser: true,
                numPagina: 0

            });
            return;
        }
    }

    //lista de gastos de usuario y lista de ventas del usuario
    listGastos = async (form = this.state.formGastosPagination, formCall = false) => {
        const resp = await EstadoFinancieroRoute.getGastosEstadoFinanciero(form);
        if (resp.error) {
            this.props.msgToast({
                msg: resp.err ? resp.err.message : 'No hay coneccion con la bd',
                tipe: 'warning',
                title: `Error ${resp.err ? resp.err.status : '400'}`
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
        
            this.setState({
                pages: {
                    totalPages: resp.resp.result.listGastos?.pageCount,
                    pageNum: resp.resp.result.listGastos?.pageNumber,
                },
                totalGastos: resp.resp.result.totalGastos,
                listGastos: resp.resp.result.listGastos?.result,
            })
            if(formCall){
                this.changePage(resp.resp.result.listGastos?.pageCount-1)
            }

        }
    }
    //reporte de ventas y gastos
    reportVentaGastos = async (form = this.state.formFecha) => {
        console.log(form, ' === ruta')
        const fecha = await this.fecha();
        let dataFechas = {
            fechaInicio: this.state.formFecha.fechaInicio ? this.state.formFecha.fechaInicio : fecha,
            fechaFinal: this.state.formFecha.fechaFinal ? this.state.formFecha.fechaFinal : fecha,
        }
        const resp = await GastosRoutes.reportedeGastosVentas({ fechaInicio: dataFechas.fechaInicio, fechaFinal: dataFechas.fechaFinal, form })
        if (resp.error) {
            this.props.msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error 400'
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.setState({
                reporteVentaGatos: resp.resp,
                formFecha: {
                    ...this.state.formFecha,
                    nameCategori: form.nameCategori
                }
            })
        }
    }
    //buscar fechas para el reporte de ventas y gastos
    changeFormFecha = (e) => {
        const { value, name } = e.target
        this.setState({
            formFecha: {
                ...this.state.formFecha,
                [name]: value
            }

        });
        this.reportVentaGastos({
            ...this.state.formFecha,
            pgnV: name === 'pgsV' || name === 'buscadorV'? 0 : this.state.formFecha.pgnV, 
            pgsV: name === 'pgsV'? value : this.state.formFecha.pgsV, 
            buscadorV: name === 'buscadorV' ? value : this.state.formFecha.buscadorV, 
            pgnG: name === 'pgsG' || name === 'buscadorG'? 0 : this.state.formFecha.pgnG,
            pgsG: name === 'pgsG'? value : this.state.formFecha.pgsG,
            buscadorG: name === 'buscadorG' ? value : this.state.formFecha.buscadorG, 
        })  
    }
    // fecha del dia
    fecha = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = `${yyyy}-${mm}-${dd}`;
        return today;
    }
    updateMontoInicial = async (data) => {
        const resp = await EstadoFinancieroRoute.updateMOntoInicial(data)
        if (resp.error) {
            this.props.msgToast({
                msg: resp.err.message,
                tipe: 'warning',
                title: `Error ${resp.err.status}`
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.setState({
                changeCierreCaja: !this.state.changeCierreCaja
            })
            this.modalFunction(3);
        }
    }
    async componentDidMount() {

        this.props.verifyToken()
        if (await this.props.permissions([{ name: 'admin' }, { name: 'caja' }])) {
            this.setState({
                isPermitRoute: true
            })
        } else {
            this.setState({
                isPermitRoute: false
            })
        }
        this.listGastos();
        this.listTipoGasto();
        this.fecha();
        this.reportVentaGastos();
        this.buttonMenuDinamic();
    }
    render() {
        if (this.state.isPermitRoute === false) {
            return (
                <>
                    <h1>No tienes permiso para entrar en esta ruta</h1>
                </>
            );
        }
        return (
            <>
                <Menu
                    colors={this.props.color}
                    buttons={this.state.buttonsMenu}
                    isButtonPosition={true}
                    functionsMenu={this.fucntionMenu}
                />
                {this.state.sectionContainer === 0 &&
                    <>
                        <NuevaVenta listGastos={this.listGastos} msgToast={this.props.msgToast} RouteOnliAdmin={this.props.RouteOnliAdmin} colors={this.props.color}></NuevaVenta>
                    </>
                }
                {this.state.sectionContainer === 1 &&
                    <>
                        <Gastos
                            modalFunction={this.modalFunction}
                            buttonTableClick={this.buttonTableClick}
                            buttonTable={this.state.buttonTable}
                            RouteOnliAdmin={this.props.RouteOnliAdmin}
                            colors={this.props.color}
                            changeFormPaginationGastos={this.changeFormPaginationGastos}
                            formGastosPagination={this.state.formGastosPagination}
                            listGastos={this.state.listGastos}
                            totalGastos={this.state.totalGastos}
                            pages={this.state.pages}
                            pagina={this.state.pagina}
                            changePage={this.changePage}
                        />
                        {/* <div className="contend-gastos">
                            <div className="conted-left">
                                <h2>Lista de gastos</h2>
                            </div>
                            <div className="conted-right">
                                <button onClick={() => this.modalFunction(1)} className="button-table">Nuevo gasto</button>

                                <button onClick={() => this.buttonTableClick(0, 'listGastosUser')}
                                    className={this.state.buttonTable === 0 ? 'button-table active-button-table' : 'button-table'}>
                                    Mis gastos
                                </button>

                                <button onClick={() => this.buttonTableClick(1, 'listGastos')}
                                    className={this.state.buttonTable === 1 ? 'button-table active-button-table' : 'button-table'}>
                                    Gastos del dia
                                </button>



                            </div>
                            <div className={this.props.RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                                <div className="contend-table tableOutModal">
                                    <div className='content-search-sizePage'>
                                        <div className='content-left'>
                                            <select
                                                style={{
                                                    border: this.props.color ? `0.4px solid ${this.props.color.colorHeader.colorText}` : '1px solid red',
                                                    backgroundColor: this.props.color ? this.props.color.colorGlobal : 'red',
                                                    color: this.props.color ? this.props.color.colorHeader.colorText : 'red'

                                                }}
                                                name='tamanioPagina'
                                                onChange={this.changeFormPaginationGastos}
                                                value={this.state.formGastosPagination.tamanioPagina}
                                                className='sizePage'
                                            >
                                                
                                                <option value='5'>5</option>
                                                <option value='10'>10</option>
                                                <option value='30'>30</option>

                                            </select>
                                            <label>Tamanio de pagina</label>
                                        </div>
                                        <div className='content-right'>
                                            <label>Buscar:</label>
                                            <input
                                                style={{
                                                    border: this.props.color ? `1px solid ${this.props.color.colorHeader.colorText}` : '1px solid red',
                                                    backgroundColor: this.props.color ? this.props.color.colorGlobal : 'red',
                                                    color: this.props.color ? this.props.color.colorHeader.colorText : 'red'

                                                }}
                                                name='buscador'
                                                onChange={this.changeFormPaginationGastos}
                                                value={this.state.formGastosPagination.buscador}
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
                                               
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {this.state.listGastos.map((data, key) => {
                                                return (
                                                    <tr key={key} className="table-row">
                                                        <td className="row-cell">{key + 1}</td>
                                                        <td className="row-cell">{data.idTipoGastos}</td>
                                                        <td className="row-cell">{data.description}</td>
                                                        <td className="row-cell">{data.idUser}</td>
                                                        <td className="row-cell">{data.montoAsignadoA}</td>
                                                        <td className="row-cell">{data.hora}</td>
                                                        <td className="row-cell">{data.dateCreate?.split('T')[0]}</td>
                                                        <td className="row-cell">{data.montoGasto}Bs</td>                                                        
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
                                                <th className="header" scope="col">Total: {this.state.totalGastos} Bs</th>                                               
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div className="content-pagination">
                                        <div className='content-pagination-left'>
                                            <label>Pagina {this.state.pages.pageNum + 1} de {this.state.pages.totalPages}</label>
                                        </div>
                                        <div className='content-pagination-right'>

                                            {this.state.pagina.c > 2 && this.state.pages.totalPages > 3 &&

                                                <div onClick={() => this.changePage(0)} className='pagination-number'>
                                                    1
                                                </div>
                                            }
                                            {this.state.pagina.c > 2 && this.state.pages.totalPages > 3 &&
                                                <div className='pagination-number'>
                                                    ...
                                                </div>
                                            }
                                            <List number={this.state.pages.totalPages} num={this.state.pagina.number}>
                                                {(index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={() => this.changePage(index)}
                                                            className={this.state.pages.pageNum === index ? 'pagination-number select' : 'pagination-number'} >
                                                            {index + 1}
                                                        </div>
                                                    );
                                                }
                                                }
                                            </List>
                                            {this.state.pagina.c < this.state.pages.totalPages - 3 &&
                                                <div className='pagination-number'>
                                                    ...
                                                </div>
                                            }
                                            {this.state.pagina.c < this.state.pages.totalPages - 3 &&
                                                <div
                                                    className='pagination-number'
                                                    onClick={() => this.changePage(this.state.pages.totalPages - 1)}
                                                >
                                                    {this.state.pages.totalPages}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </>
                }
                {this.state.sectionContainer === 2 &&
                    <>
                        <ListVentasUser
                            colors={this.props.color}
                            msgToast={this.props.msgToast}
                            RouteOnliAdmin={this.props.RouteOnliAdmin}
                            changeFormPaginationVentas={this.changeFormPaginationVentas}
                        />
                    </>
                }
                {this.state.sectionContainer === 3 &&
                    <>
                        <ReporteVentasGastos
                            changeFormFecha={this.changeFormFecha}
                            formFecha={this.state.formFecha}
                            reporteVentaGatos={this.state.reporteVentaGatos}
                            reportVentaGastos={this.reportVentaGastos}
                            RouteOnliAdmin={this.props.RouteOnliAdmin}
                            colors={this.props.color}
                            msgToast={this.props.msgToast}
                        />
                    </>
                }
                {this.state.sectionContainer === 4 &&
                    <>

                        <EstadoFinanciero
                            changeCierreCaja={this.state.changeCierreCaja}
                            colors={this.props.color}
                            RouteOnliAdmin={this.props.RouteOnliAdmin}
                            msgToast={this.props.msgToast}
                            listGastos={this.listGastos}

                        />

                    </>
                }
                {this.state.sectionContainer === 5 &&
                    <ListaEstadosFinancieros
                        colors={this.props.color}
                        msgToast={this.props.msgToast}
                    />
                }
                {
                     //lista de ventas por estadoventaRestaurante
                   this.state.sectionContainer === 7 &&
                    <ListStateOrdenRestaurante 
                        
                    />

                }
                {/* form gastos del usuario */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen}
                    onClose={() => this.modalFunction(1)}
                    size='60%'
                    title='Registrar gasto'
                >
                    <Form
                        form={this.state.form}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(1)}
                        submit={this.inserData}
                        isUpdate={false}
                    ></Form>

                </Modal>

                {/* actualizar gastos del usuario */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen1}
                    onClose={() => this.modalFunction(2)}
                    size='60%'
                    title='Actualizar Gasto'
                >
                    <Form
                        form={this.state.updateForm}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(2)}
                        submit={this.updateDatas}
                        isUpdate={true}
                    ></Form>
                </Modal>
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen2}
                    onClose={() => this.modalFunction(3)}
                    size='60%'
                    title='Registrar monto inicial de dinero en caja'
                >
                    <Form
                        form={this.state.updateMontoInicial}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(3)}
                        submit={this.updateMontoInicial}
                        isUpdate={false}
                    ></Form>
                </Modal>

            </>
        );
    }
}

export default Ventaas;