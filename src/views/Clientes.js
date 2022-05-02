import React, { Component } from 'react'
import Menu from '../components/Menu';
import ContainerList from "../components/ContainerList";
import CardUser from "../components/CardUser";
import Modal from '../components/Modal';
import Form from "../components/Form";
import CLienteRoutes from '../routes/Clientes';
const formDatas = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nombres', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'lastName', label: 'Apellidos', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'ci', label: 'C.I.', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'phoneNumber', label: 'Telefono', value: '', tipe: 'text' },
    /* {
        disable: false, error: '', isRequired: true, focus: '', name: 'role', label: 'Rol', value: '', tipe: 'select', options: [
            { name: 'Admin', value: 'admin' },
            { name: 'User', value: 'user' },
            { name: 'Owner', value: 'owner' },
            { name: 'Caja', value: 'caja' },
            { name: 'Cocinero', value: 'cocinero' },
            { name: 'Mesero', value: 'mesero' },
            { name: 'Delivery', value: 'delivery' },

        ]
    } */
]
const formUpdateDatas = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nonbres', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'lastName', label: 'Apellidos', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'ci', label: 'C.I.', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'phoneNumber', label: 'Telefono', value: '', tipe: 'text' },    
]
export class Clientes extends Component {
    state = {
        isPermitRoute: null,
        buttonsMenu: [
            { rolePermit: [{ name: 'admin' }, { name: 'caja' }], button: 'Lista de clientes', selected: 'buttonSeleccted' },
            { rolePermit: [{ name: 'admin' }], button: 'Nuevo cliente', selected: '' },
        ],
        //lista de clientes
        listCard: [],
        modals: {
            isOpen: false,
            isOpen1: false
        },
        form: formDatas,
        updateForm:formUpdateDatas,
        idSelected:''
    }
    //lista de clientes
    listClientes = async () =>{
        const resp = await CLienteRoutes.list();
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
            this.setState({
                listCard:resp.resp.result
            })
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
        this.buttonMenuDinamic();
        this.listClientes();
    }
    fucntionMenu = (p) => {
        if (p === 1) {
            //este for borrara los datos almacenados que se hacen desde el button detalles del cardUser
            /* var array = this.state.form
            for (let i = 0; i < array.length; i++) {
                array[i].value = '';
                array[i].focus = '';
            } */
            this.setState({
                modals: {
                    isOpen: !this.state.modals.isOpen,
                    isOpen1: this.state.modals.isOpen1
                },
                //form: array
            })
        }
    }
    //verifica si los permisos para cada button los quita o los agrega segun su rol
    buttonMenuDinamic = async () => {
        const buttonsMenu = await this.props.menuButtonsPermit(this.state.buttonsMenu);
        this.setState({
            buttonsMenu,
        });
    }
    btnFunction = async (data, fun, idCliente) => {        
        if (fun === 'showDetails') {
            
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
                idSelected: idCliente
            });
        }
    }
    /* modal form register cliente */
    modalFunction = (p) => {
        this.setState({
            modals: {
                isOpen: p === 1 ? !this.state.modals.isOpen : this.state.modals.isOpen,
                isOpen1: p === 2 ? !this.state.modals.isOpen1 : this.state.modals.isOpen1
            }
        });
    }
    /* registrar clientes */
    inserData = async (data) => {       
        const resp = await CLienteRoutes.create(data);
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
        if(resp.resp.status === 'ok'){
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.listClientes();
            this.modalFunction(1)
        }

    }
    //actulaizar cliente
    updateDatas = async (data)=>{        
        const resp = await CLienteRoutes.update(data,this.state.idSelected);
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
        if(resp.resp.status === 'ok'){
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.listClientes();
            this.modalFunction(2)
        }
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
            <div>
                <Menu
                    colors={this.props.color}
                    buttons={this.state.buttonsMenu}
                    functionsMenu={this.fucntionMenu}
                />
                <ContainerList heigth={this.props.color} heigthPrimary={this.props.RouteOnliAdmin ? '100' : '435'} cardUser={true}>
                    <CardUser
                        arrlist={this.state.listCard}
                        clickButtonCard={this.btnFunction}
                        isClient={true}
                    />
                </ContainerList>
                {/* form modal */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen}
                    onClose={() => this.modalFunction(1)}
                    size='60%'
                    title='Registrar Nuevo Cliente'
                >
                    <Form
                        form={this.state.form}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(1)}
                        submit={this.inserData}
                        isUpdate={false}
                    ></Form>
                </Modal>
                {/* actualizar cliente */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen1}
                    onClose={() => this.modalFunction(2)}
                    size='60%'
                    title='Actualizar Cliente'
                >
                    <Form
                        form={this.state.updateForm}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(2)}
                        submit={this.updateDatas}
                        isUpdate={true}
                    ></Form>
                </Modal>

            </div>
        )
    }
}

export default Clientes
