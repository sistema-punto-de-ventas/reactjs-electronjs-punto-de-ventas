import React from "react";
import CardView from "../components/Mesas/CardView";
import ContainerList from "../components/ContainerList";
import Menu from "../components/Menu";
import Modal from '../components/Modal';
import Form from "../components/Form";
import Table from "../components/Table";
import './Styles/MesasStyle.css';
import IMgPollo from '../assets/pollo.jpg';
import Pipoca from '../assets/pipocaDePollo.jpg';
import CocaCola from '../assets/cocaCola.jpg';

import SalasMesas from "../routes/SalasMesas";
class Mesas extends React.Component {
    state = {
        //Estos botones se esta mandando ha menu de forma dinamica
        isPermitRoute: null,
        buttons: [],
        formSala: [
            { error: '', isRequired: true, focus: '', name: 'nameSala', label: 'Nombre de sala', value: '', tipe: 'text' },
            { error: '', isRequired: true, focus: '', name: 'numberMesas', label: 'Capacidad de mesas', value: '', tipe: 'text' },

        ],
        salaID: '',
        formMesa: [
            { error: '', isRequired: true, focus: '', name: 'name', label: 'Nombre de la mesa', value: '', tipe: 'text' },
            { error: '', isRequired: true, focus: '', name: 'numberChair', label: 'Numero de sillas', value: '', tipe: 'text' },

        ],
        modals: {
            isOpenModal1: false,//form registrar sala
            isOpenModal2: false,//form regitrar mesa
            isOpenModal3: false,//for detalles de la mesa
        },
        listMesas: [],//{ button: 'Orden de mesa', selected: '' },
        buttonsMenuModal: [
            { button: 'Menu mesa', selected: 'buttonSeleccted' },
            { button: 'Orden de mesa', selected: '' },
            { button: 'Factura', selected: '' },
        ],
        sections: 0,//para controlar las secciones del menu
        //datatos del componente table
        tableOrden: {
            tableHeadDatas: [
                { headName: 'Descripcion' },
                { headName: 'Ingredientes' },
                { headName: 'Precio' },
                { headName: 'Opciones' },
            ],
            tableBodyDatas: [
                { id: 1, nombre: 'Economico', ingredientes: 'esto', precio: 15 },
            ]
        },
        //esto se manda al componente cardView para la lista dinamica que esta
        //en el modal de detalle de cada mesa
        listCard: [
            {
                id: 1,
                nombre: 'Pollo',
                ingredientes: 'Pollo y papa frita',
                img: IMgPollo,
                precio: 15
            },
            {
                id: 2,
                nombre: 'cocacola',
                ingredientes: '',
                img: CocaCola,
                precio: 5
            },
            {
                id: 3,
                nombre: 'Pipocas de pollo',
                ingredientes: 'Solo pollo',
                img: Pipoca,
                precio: 10
            },

        ]
    }

    //esta funcion es para abrir y cerrar el modal
    modalFunction = (p) => {
        //console.log(p, 'esto es ')
        if (p === 0) {
            this.setState({
                modals: {
                    isOpenModal1: !this.state.modals.isOpenModal1,
                    isOpenModal2: this.state.modals.isOpenModal2,
                    isOpenModal3: this.state.modals.isOpenModal3
                }

            });
            return;
        }
        let arr = this.state.buttons, idSala = '';
        for (let i = 0; i < arr.length; i++) {
            if (i === p) {
                arr[i].selected = 'buttonSeleccted'
                idSala = arr[i].id
            } else {
                arr[i].selected = ''
            }
        }
        //cada ves que se selecciona una sala se esta mandando el 
        //id de la sala para poder registrar mesas a la sala
        this.setState({
            buttons: arr,
            salaID: idSala
        });
        this.listMesas(idSala);
    }
    //cambia el estado de la seccion que esta en el state esto esta en el contend section
    section = (p) => {
        let arr = this.state.buttonsMenuModal
        for (let i = 0; i < arr.length; i++) {
            if (i === p) {
                arr[i].selected = 'buttonSeleccted'
            } else {
                arr[i].selected = ''
            }
        }
        this.setState({
            buttonsMenuModal: arr,
            sections: p
        })
    }
    //funcion que aniade productos a la tabla o los quita
    //esta en el modal de detalle de productos
    clickProduct = (data, func) => {
        if (func === 'clickCardView') {
            this.setState({
                tableOrden: {
                    tableHeadDatas: this.state.tableOrden.tableHeadDatas,
                    tableBodyDatas: [
                        ...this.state.tableOrden.tableBodyDatas, ...[data]
                    ]
                }
            });
            return;
        }
        var array = this.state.tableOrden.tableBodyDatas;
        array.splice(data, 1);
        this.setState({
            tableOrden: {
                tableHeadDatas: this.state.tableOrden.tableHeadDatas,
                tableBodyDatas: array
            }
        })


    }

    /* registro de salas */
    registerSalas = async (data) => {
        const resp = await SalasMesas.createSala(data);
        //console.log(resp.resp, ' esto es =================================================================')
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
            this.listSalas();
            this.modalFunction(0);
        }
    }
    //funcion que trae la lista de salas desde la bd
    listSalas = async () => {
        const resp = await SalasMesas.listSalas();
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
                msg: 'No se pudo mostrar la lista de salas',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            // let arrButtons = [{ button: 'Añadir sala', selected: '' }];
            let arrButtons = [{ button: 'Añadir sala', selected: '' }];
            for (let i = 0; i < resp.resp.result.length; i++) {
                arrButtons.push({
                    id: resp.resp.result[i].id,
                    button: resp.resp.result[i].nameSala,
                    selected: i === 0 ? 'buttonSeleccted' : ''
                });
            }
            this.setState({
                buttons: arrButtons
            });
            if (resp.resp.result.length > 0) {
                this.listMesas(resp.resp.result[0].id)
            }
        }
    }
    //lista de mesas de la sala
    listMesas = async (idSala) => {
        const resp = await SalasMesas.listMesa(idSala);
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
                msg: 'No se pudo mostrar la lista de mesas',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            //se esta mostrando la lista de mesas de la sala y tambien le id 
            //de la sala para poder regitrar mesas en esa sala selecionada
            this.setState({
                listMesas: resp.resp.result,
                salaID: idSala
            })
        }

    }
    //mostrar modal de registrar mesa
    showModalTable = (modal) => {
        this.setState({
            modals: {
                isOpenModal1: this.state.modals.isOpenModal1,
                isOpenModal2: modal === 'registerTable' ? !this.state.modals.isOpenModal2: this.state.modals.isOpenModal2,
                isOpenModal3: modal === 'showDetailsTable'? !this.state.modals.isOpenModal3:this.state.modals.isOpenModal3
            }
        })
    }
    //add nueva mesa
    addNewTable = async (data) => {

        //new modal con formulario
        console.log('add producto')
        console.log(data)
        const resp = await SalasMesas.createMesa(data,this.state.salaID);
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
                msg: 'No se pudo registrar los datos',
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
            this.listMesas(this.state.salaID)
            this.showModalTable('registerTable');
        }

    }
    //mostrar detalles de cada mesa
    showDetailTableModal=()=>{
        this.setState({
            modals: {
                isOpenModal1: this.state.modals.isOpenModal1,
                isOpenModal2: this.state.modals.isOpenModal2,
                isOpenModal3: !this.state.modals.isOpenModal3
            }
        })
    }
    async componentDidMount() {
        console.log(this.props.color, ' esto son sus colores')
        this.props.verifyToken();
        this.listSalas();//
        //if que verifica los roles que estan permitidos
        if (await this.props.permissions([{ name: 'admin' }, { name: 'mesero' }, { name: 'caja' }, { name: 'cocinero' }])) {
            this.setState({
                isPermitRoute: true
            })
        } else {
            this.setState({
                isPermitRoute: false
            })
        }
    }
    render() {
        //verificamos si tiene permiso de ver la lista de mesas
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
                    buttons={this.state.buttons}
                    functionsMenu={this.modalFunction}
                />
                {/* cada ves que se llame a un buton de salas o cualquiera, este llamara a 
                su propia lista de mesas se remplazara en el array y se mostrara dinamicamente */}
                
                <ContainerList heigth={this.props.color} heigthPrimary={this.props.RouteOnliAdmin ? '100' : '435'}>
                
                    <CardView
                        colors={this.props.color} // colores de fondo
                        butonActivate={true} // esto es apara mostrar los dos bottones de footer
                        arrDatas={this.state.listMesas}
                        type={'mesas'}
                        clickProduct={this.showModalTable}

                    />
                </ContainerList>
                {/* modal de registro de salas */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpenModal1}
                    onClose={() => this.modalFunction(0)}
                    size='60%'
                    title='Registro de Sala'
                >
                    <Form
                        submit={this.registerSalas}
                        colors={this.props.color}
                        form={this.state.formSala}
                        onClose={() => this.modalFunction(0)}></Form>
                </Modal>
                {/* Registrar nueva mesa */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpenModal2}
                    onClose={()=>this.showModalTable('registerTable')}
                    size='60%'
                    title='Registro Mesas'
                >
                    <Form
                        submit={this.addNewTable}
                        colors={this.props.color}
                        form={this.state.formMesa}
                        onClose={()=>this.showModalTable('registerTable')}></Form>
                </Modal>
                {/* modal de detalle de la mesa seleccionada */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpenModal3}
                    onClose={this.showDetailTableModal}
                    size='90%'
                    title='Mesa 1'
                >
                    <Menu
                        colors={this.props.color}
                        buttons={this.state.buttonsMenuModal}
                        functionsMenu={this.section} />
                    {this.state.sections === 0 ?
                        <>
                            <div className='contend-section'>
                                <div className='section' style={{ backgroundColor: this.props.color.colorHeader.contendNavigation }}>
                                    <CardView
                                        colors={this.props.color}//se manda el color para que sea dinamico 
                                        butonActivate={false} //esto se manda para mostrar el footer o no
                                        arrDatas={this.state.listCard} // lista de datos dinamico
                                        clickProduct={this.clickProduct}// esta funcion servira para seleccionar un producto
                                    />
                                </div>
                                <div className='section1' style={{ backgroundColor: this.props.color.colorHeader.contendNavigation }}>
                                    <Table
                                        clickProduct={this.clickProduct}
                                        tableDatas={this.state.tableOrden}
                                    >
                                    </Table>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <Table></Table>
                        </>
                    }
                    
                    <button className='buttonMenu' onClick={this.showDetailTableModal}>Cancelar</button>
                    {/* <Table onClose={() => this.modalFunction(2)}></Table> */}
                </Modal>

            </>
        );
    }
}

export default Mesas;