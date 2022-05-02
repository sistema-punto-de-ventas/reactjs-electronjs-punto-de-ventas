import React from "react";
import Menu from '../components/Menu';
import ContainerList from "../components/ContainerList";
import Modal from '../components/Modal';
import Form from "../components/Form";
import CardUser from "../components/CardUser";
//routes
import LoginRutes from "../routes/Login";
//msg toast
import { toast } from 'react-toastify';
//msg toast
import iziToast from 'izitoast';
toast.configure()

const formDatas = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nonbres', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'lastName', label: 'Apellidos', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'ci', label: 'C.I.', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'direction', label: 'Direccion', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'phoneNumber', label: 'Telefono', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'email', label: 'Email', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'password', label: 'Contraceña', value: '', tipe: 'password' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'password1', label: 'Repita su contraceña', value: '', tipe: 'password' },
    {
        disable: false, error: '', isRequired: true, focus: '', name: 'role', label: 'Rol', value: '', tipe: 'select', options: [
            { name: 'Admin', value: 'admin' },
            { name: 'User', value: 'user' },
            { name: 'Owner', value: 'owner' },
            { name: 'Caja', value: 'caja' },
            { name: 'Cocinero', value: 'cocinero' },
            { name: 'Mesero', value: 'mesero' },
            { name: 'Delivery', value: 'delivery' },

        ]
    }
]
const updateForm = [
    { disable: false, oneUpdate: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nonbres', value: '', tipe: 'text' },
    { disable: false, oneUpdate: false, error: '', isRequired: true, focus: '', name: 'lastName', label: 'Apellidos', value: '', tipe: 'text' },
    { disable: false, oneUpdate: false, error: '', isRequired: true, focus: '', name: 'direction', label: 'Direccion', value: '', tipe: 'text' },
    { disable: true, oneUpdate: true, error: '', isRequired: true, focus: '', name: 'email', label: 'Email', value: '', tipe: 'text' },
    { disable: true, oneUpdate: true, error: '', isRequired: true, focus: '', name: 'ci', label: 'C.I.', value: '', tipe: 'text' },
    { disable: true, oneUpdate: true, error: '', isRequired: true, focus: '', name: 'phoneNumber', label: 'Telefono', value: '', tipe: 'text' },
]
const updateFormPassword = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'password', label: 'Inserte la nueva contraceña', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'password1', label: 'Repita su contraceña', value: '', tipe: 'text' },
]
const updateFormRolUser = [
    {
        disable: false, error: '', isRequired: true, focus: '', name: 'role', label: 'Rol', value: '', tipe: 'select', options: [
            { name: 'Admin', value: 'admin' },
            { name: 'User', value: 'user' },
            { name: 'Owner', value: 'owner' },
            { name: 'Caja', value: 'caja' },
            { name: 'Cocinero', value: 'cocinero' },
            { name: 'Mesero', value: 'mesero' },
            { name: 'Delivery', value: 'delivery' },

        ]
    }
]
class Usuarios extends React.Component {
    state = {
        isPermitRoute:null,
        buttonsMenu: [
            {rolePermit:[{name:'admin'},{name:'caja'}],button: 'Lista de usuarios', selected: 'buttonSeleccted' },
            {rolePermit:[{name:'admin'}],button: 'Nuevo usuario', selected: '' },
        ],
        buttonsMenuModal: [
            {rolePermit:[{name:'admin'},{name:'caja'}] , button: 'Actualizar datos personales', selected: 'buttonSeleccted' },
            {rolePermit:[{name:'admin'}], button: 'Actualizar contraceña', selected: '' },
            {rolePermit:[{name:'admin'}], button: 'Rol del usuario', selected: '' },
        ],
        modals: {
            isOpen: false,
            isOpen1: false
        },
        form: formDatas,
        formUpdate: updateForm,
        formUpdatePassword: updateFormPassword,
        ForUpdateRolUser: updateFormRolUser,
        listCard: [],
        idSelected: '',
        listRoles: []
    }
    async componentDidMount() {
        this.props.verifyToken()
        this.getListUser();
        if(await this.props.permissions([{name:'admin'},{name:'caja'}])){           
            this.setState({
                isPermitRoute:true
            })
        }else{            
            this.setState({
                isPermitRoute:false
            })
        }
        this.buttonMenuDinamic();
    }
    //verifica si los permisos para cada button los quita o los agrega segun su rol
    buttonMenuDinamic=async()=>{
        const buttonsMenu = await this.props.menuButtonsPermit(this.state.buttonsMenu);        
        const buttonsMenuModal = await this.props.menuButtonsPermit(this.state.buttonsMenuModal);
        this.setState({
            buttonsMenu,
            buttonsMenuModal
        });              
    }
    //funcion para mostrar la lista de usurios
    getListUser = async () => {
        const resp = await LoginRutes.listUsers();
        if (resp.error) {
            //mensaje iziToast
            iziToast.show({
                timeout: 8000,
                icon: 'bi bi-slash-circle-fill',
                iconColor: '#D8DBE2',
                title: 'Error',
                titleColor: '#D8DBE2',
                message: 'No se puede mostrar la lista de usuarios',
                messageColor: '#D8DBE2',
                backgroundColor: '#A30000',
                position: 'topCenter'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.setState({
                listCard: resp.resp.result
            })
            return;
        }
        if (resp.resp.status === 'No fount') {
            toast.warning(resp.resp.message, {
                // Set to 15sec
                position: toast.POSITION.TOP_CENTER, autoClose: 15000
            });
            return;
        }


    }
    //aqui se programa las funciones del menu
    fucntionMenu = (p) => {
        if (p === 1) {
            //este for borrara los datos almacenados que se hacen desde el button detalles del cardUser
            var array = this.state.form
            for (let i = 0; i < array.length; i++) {
                array[i].value = '';
                array[i].focus = '';
            }
            this.setState({
                modals: {
                    isOpen: !this.state.modals.isOpen,
                    isOpen1: this.state.modals.isOpen1
                },
                form: array
            })
        }
    }
    //funcion para poder abrir o cerrar el modal
    modalFunction = (p) => {
        console.log(p, ' esto se ======')
        this.setState({
            modals: {
                isOpen: p === 1 ? !this.state.modals.isOpen : this.state.modals.isOpen,
                isOpen1: p === 2 ? !this.state.modals.isOpen1 : this.state.modals.isOpen1
            }
        });
    }
    // funcion para registrar usuraios
    inserData = async (data) => {      
        const resp = await LoginRutes.singUp(data);
        if (resp.error) {
            //mensaje toast
            this.props.msgToast({
                msg: resp.err.message,
                tipe: 'warning',
                title: `Error ${resp.err.status}`
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.setState({
                modals: {
                    isOpen: false,
                    isOpen1: false
                }
            })
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.getListUser();
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

    }
    //funcion esto es cuando se hace click a un boton de list card
    btnFunction = async (data, fun, idUser) => {
        if (fun === 'delete') {
            //verificamos si el usuarios es administrador
            let state = false;
            for(let i = 0; i< data.roles.length; i++){
                if(data.roles[i].name === 'admin'){
                    state = true;
                }
            }            
            if(state){
                iziToast.show({
                    timeout: 8000,
                    icon: 'bi bi-slash-circle-fill',
                    iconColor: '#D8DBE2',
                    title: 'Error',
                    titleColor: '#D8DBE2',
                    message: 'No puedes cambiar el estado de un administrador',
                    messageColor: '#D8DBE2',
                    backgroundColor: '#A30000',
                    position: 'topCenter'
                });
                return;
            }
            const resp = await LoginRutes.updateStateUser(idUser);
            if (resp.error) {
                //mensaje toast
                toast.error('No se puede insertar los datos', {
                    // Set to 15sec
                    position: toast.POSITION.TOP_CENTER, autoClose: 15000
                });
                return;
            }
            if (resp.resp.status === 'ok') {
                iziToast.success({
                    timeout: 5000,
                    icon: 'bi bi-reply-fill',
                    title: 'Genial...',
                    message: resp.resp.message,
                    position: 'topCenter'
                });
                this.getListUser();
                return;
            }
            if (resp.resp.status === 'No fount') {
                toast.warning(resp.resp.message, {
                    // Set to 15sec
                    position: toast.POSITION.TOP_CENTER, autoClose: 15000
                });
                return;
            }
            /* iziToast.show({
                title: 'Hey',
                icon: 'bi bi-reply-fill',
                message: 'What would you like to add?',
                messageColor: 'white',
                backgroundColor: 'green',
                close: true,
                position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center

                buttons: [
                    [
                        '<button>Ok</button>',
                        function (instance, toast) {
                            alert("Hello world!");
                        }
                    ],
                    [
                        '<button>Close</button>',
                        function (instance, toast) {
                            instance.hide({
                                transitionOut: 'fadeOutUp'
                            }, toast);
                        }
                    ]
                ]
            }); */
            return;
        }
        //esto es el button detalles
        // aqui se insertaran los datos para poder actualizar
        if (fun === 'showDetails') {
            
            var arr = this.state.formUpdate;

            for (let i = 0; i < arr.length; i++) {
                for (const name in data) {

                    if (name === arr[i].name) {
                        arr[i].value = data[name];
                        arr[i].focus = 'active';
                    }
                }
            }
            this.setState({                
                modals: {
                    isOpen: this.state.modals.isOpen,
                    isOpen1: !this.state.modals.isOpen1
                },
                formUpdate: arr,
                idSelected: idUser
            });
            this.roleLists(idUser);
        }

    }

    //funcion para actualizar usuarios
    updateForm = async (data) => {
        const resp = await LoginRutes.updateUser(data, this.state.idSelected);
        if (resp.error) {
            //mensaje toast
            this.props.msgToast({
                msg: resp.err.message,
                tipe: 'warning',
                title: `Error ${resp.err.status}`
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.getListUser();
            this.modalFunction(2)
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
        /* let array = this.state.listCard, p=0;
        for(var i = 0; i < array.length; i++){
            if(data.email === array[i].email){
                p = i
            }
        }
        array.splice(p,1,data) */
    }
    addRole = async (data) => {
      
        const resp = await LoginRutes.addRoleUser(data, this.state.idSelected);
        if (resp.error) {
            toast.error('No se pudo añadir el rol al usuario', {
                // Set to 10sec
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            toast.warning(resp.resp.message, {
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            toast.success(resp.resp.message, {
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            this.roleLists(this.state.idSelected)
            this.getListUser()
        }
    }
    //esto son la funciones o los click del componenete menu que esta dentro del modal
    functionMenuModal = (p) => {
        let arrButtons = this.state.buttonsMenuModal;
        for (let i = 0; i < arrButtons.length; i++) {
            if (i === p) {
                arrButtons[i].selected = 'buttonSeleccted'
            } else {
                arrButtons[i].selected = ''
            }
        }
        this.setState({
            buttonsMenuModal: arrButtons
        });
    }
    //lista de roles del usuario
    roleLists = async (idUser) => {
        const resp = await LoginRutes.userListRole(idUser);
        if (resp.error) {
            toast.error('No se pudo mostrar la lista de roles del usuario', {
                // Set to 10sec
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            toast.warning(resp.resp.message, {
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            this.setState({
                listRoles: resp.resp.result
            })
        }
    }
    ///eliminar rol
    removeROleUser = async (roleName) => {
      
        var data = {
            currentRole: roleName,
            idUser: this.state.idSelected
        }
        const resp = await LoginRutes.removeRole(data);
        if (resp.error) {
            toast.error('No se pudo eliminar el rol', {
                // Set to 10sec
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            toast.warning(resp.resp.message, {
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            toast.success(resp.resp.message, {
                position: toast.POSITION.TOP_CENTER, autoClose: 5000
            });
            this.roleLists(this.state.idSelected);
            this.getListUser();
        }

    }

    render() {
        if(this.state.isPermitRoute===false){
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
                    functionsMenu={this.fucntionMenu}
                />
                <ContainerList heigth={this.props.color} heigthPrimary={this.props.RouteOnliAdmin ? '100' : '435'} cardUser={true}>
                    <CardUser
                        arrlist={this.state.listCard}
                        clickButtonCard={this.btnFunction}
                    />
                </ContainerList>
                {/* registrar usurios */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen}
                    onClose={() => this.modalFunction(1)}
                    size='60%'
                    title='Registrar Usuario'
                >
                    <Form
                        form={this.state.form}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(1)}
                        submit={this.inserData}
                        isUpdate={false}
                    >
                    </Form>
                </Modal>
                {/* actualizar datos del usuraio */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen1}
                    onClose={() => this.modalFunction(2)}
                    size='70%'
                    title='Actualizar Usuario'
                >
                    <Menu
                        colors={this.props.color}
                        buttons={this.state.buttonsMenuModal}
                        functionsMenu={this.functionMenuModal}
                    />
                    {/* for para poder actualizar los datos del usuario */}
                    {this.state.buttonsMenuModal[0]? this.state.buttonsMenuModal[0].selected === 'buttonSeleccted' &&
                        <Form
                            form={this.state.formUpdate}
                            colors={this.props.color}
                            onClose={() => this.modalFunction(2)}
                            submit={this.updateForm}
                            isUpdate={true}
                        />
                        :
                        <></>
                    }
                    {/* form para poder actulizar el password */}
                    {this.state.buttonsMenuModal[1] ? this.state.buttonsMenuModal[1].selected === 'buttonSeleccted' &&
                        <Form
                            form={this.state.formUpdatePassword}
                            colors={this.props.color}
                            onClose={() => this.modalFunction(2)}
                            submit={this.updateForm}
                            isUpdate={true}
                        />
                        :
                        <></>
                    }
                    {/* agregar o quitar el rol del usuario */}
                    {this.state.buttonsMenuModal[2] ? this.state.buttonsMenuModal[2].selected === 'buttonSeleccted' &&
                        <>

                            <div className="contend-table tableOutModal">
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-headers">
                                            <th className="header" scope="col">#</th>
                                            <th className="header" scope="col">Rol</th>
                                            <th className="header" scope="col">Quitar Rol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">

                                        {this.state.listRoles.map((data, key) => {
                                            return (
                                                <tr key={key} className="table-row">
                                                    <td className="row-cell">{key + 1}</td>
                                                    <td className="row-cell">{data.name}</td>
                                                    <td className="row-cell">
                                                        <button
                                                            onClick={() => this.removeROleUser(data.name)}
                                                            className='buttonMenu buttonWarnig'>Elimiar</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </table>
                            </div>
                            <Form
                                form={this.state.ForUpdateRolUser}
                                colors={this.props.color}
                                onClose={() => this.modalFunction(2)}
                                submit={this.addRole}
                                isUpdate={false}
                            />
                        </>
                        :
                        <></>
                    }
                </Modal>
            </>
        );
    }
}
export default Usuarios;