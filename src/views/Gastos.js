import React from 'react'
import Menu from '../components/Menu';
import Modal from '../components/Modal';
import Form from "../components/Form";
import GastosRoutes from '../routes/Gastos';
const formDatas = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nombres', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'description', label: 'Descripcion', value: '', tipe: 'textarea' },
]
const formUpdateDatas = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nombres', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'description', label: 'Descripcion', value: '', tipe: 'textarea' },
]
class Gastos extends React.Component {
    state = {
        isPermitRoute: null,
        buttonsMenu: [
            { rolePermit: [{ name: 'admin' }, { name: 'caja' }], button: 'Tipo de gatos', selected: 'buttonSeleccted' },
            { rolePermit: [{ name: 'admin' }], button: 'Registro de tipo de gasto', selected: '' },
        ],
        buttonsMenuModal: [
            { rolePermit: [{ name: 'admin' }], button: '', selected: 'buttonSeleccted' },
            { rolePermit: [{ name: 'admin' }], button: 'Actualizar Gasto', selected: '' },
        ],
        sectionMenuModal: 0,
        modals: {
            isOpen: false,
            isOpen1: false
        },
        form: formDatas,
        updateForm: formUpdateDatas,
        listTipoGastos: [],
        listGastosTipo: [],
        idSelected: ''
    }
    fucntionMenu = (p) => {
        if (p === 1) {
            this.setState({
                modals: {
                    isOpen: !this.state.modals.isOpen,
                    isOpen1: this.state.modals.isOpen1
                },
                //form: array
            })
        }
    }
    /* modal form register gastos */
    modalFunction = (p) => {
        this.setState({
            modals: {
                isOpen: p === 1 ? !this.state.modals.isOpen : this.state.modals.isOpen,
                isOpen1: p === 2 ? !this.state.modals.isOpen1 : this.state.modals.isOpen1
            }
        });
    }
    //fucntiones del menu modal
    fucntionMenuModal = (p) => {
        let arr = this.state.buttonsMenuModal;
        for (let i = 0; i < arr.length; i++) {
            if (i === p) {
                arr[i].selected = 'buttonSeleccted'
            } else {
                arr[i].selected = ''
            }
        }
        this.setState({
            buttonsMenuModal: arr,
            sectionMenuModal: p
        })
    }
    //lista de gastos 
    getListGastos = async () => {
        const resp = await GastosRoutes.listTipoGastos();
        console.log(resp.resp, ' estoe4 s')
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
                listTipoGastos: resp.resp.result
            })
        }

    }
    //create tipo gatos
    inserData = async (data) => {
        //falta mandar el id del negocio
        const resp = await GastosRoutes.createTipoGastos(data);
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
            this.getListGastos();
            this.modalFunction(1)
        }

    }
    updateDatas = async (data) => {
        console.log(data, ' esto es los datos para actualizar');
        const resp = await GastosRoutes.updateTipoGastos(data, this.state.idSelected);
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
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.getListGastos();
            this.modalFunction(2)
        }

    }
    //click
    clickDetalles = (data, idTipoGasto) => {
        console.log(data)
        console.log(idTipoGasto, ' esto es el id');
        let arrbuttonMenumodal = this.state.buttonsMenuModal;
        arrbuttonMenumodal[0].button = `Gastos de ${data.name}`
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
            idSelected: idTipoGasto
        });
        this.listGastosTipo(idTipoGasto);
    }
    //lista de gastos del usuario segun su tipo 
    listGastosTipo = async (idTipoGasto) => {
        const resp = await GastosRoutes.listGastosTipo(idTipoGasto);
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
                listGastosTipo: resp.resp.result
            })
        }
        console.log(this.state.listGastosTipo);
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
        this.getListGastos();
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
                    functionsMenu={this.fucntionMenu}
                />
                <div className="contend-gastos">
                    <div className="conted-left">
                        <h2>Categoria de gastos</h2>
                    </div>
                    {/* <div className="conted-right">
                        aqui algo entra
                    </div> */}
                    <div className={this.props.RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                        <div className="contend-table tableOutModal">
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-headers">
                                        <th className="header" scope="col">Num</th>
                                        <th className="header" scope="col">Nombre de gastos</th>
                                        <th className="header" scope="col">Descripcion</th>
                                        <th className="header" scope="col">fecha de registro</th>
                                        <th className="header" scope="col">Detalles</th>

                                    </tr>
                                </thead>
                                <tbody className="table-body">

                                    {this.state.listTipoGastos.map((data, key) => {
                                        return (
                                            <tr key={key} className={`table-row ${key%2==0?'bl':'wi'}`}>
                                                <td className="row-cell">{key + 1}</td>
                                                <td className="row-cell">{data.name}</td>
                                                <td className="row-cell">{data.description}</td>
                                                <td className="row-cell">{data.dateCreate}</td>
                                                <td className="row-cell">
                                                    <button onClick={() => this.clickDetalles(data, data._id)} className='tableButton'>Detalles</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen}
                    onClose={() => this.modalFunction(1)}
                    size='60%'
                    title='Registrar Tipo de Gastos'
                >
                    <Form
                        form={this.state.form}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(1)}
                        submit={this.inserData}
                        isUpdate={false}
                    ></Form>
                </Modal>
                {/* actualizar tipo de gastos */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen1}
                    onClose={() => this.modalFunction(2)}
                    size='95%'
                    title='Detalles de los Gastos'
                >
                    <Menu
                        colors={this.props.color}
                        buttons={this.state.buttonsMenuModal}
                        functionsMenu={this.fucntionMenuModal}
                    />
                    {this.state.sectionMenuModal === 0 &&

                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-headers">
                                    <th className="header" scope="col">Num</th>
                                    <th className="header" scope="col">gatos</th>
                                    <th className="header" scope="col">Descripcion</th>
                                    <th className="header" scope="col">Usuario</th>
                                    <th className="header" scope="col">fecha de registro</th>
                                    <th className="header" scope="col">hora</th>
                                    <th className="header" scope="col">Se actualizo</th>
                                    <th className="header" scope="col">usuario responsable</th>
                                    <th className="header" scope="col">fecha de actualizado</th>
                                    <th className="header" scope="col">hora de actualizado</th>
                                    <th className="header" scope="col">BS</th>

                                </tr>
                            </thead>
                            <tbody className="table-body">

                                {this.state.listGastosTipo.map((data, key) => {
                                    return (
                                        <tr key={key} className="table-row">
                                            <td className="row-cell">{key + 1}</td>
                                            <td className="row-cell">{data.idTipoGastos}</td>
                                            <td className="row-cell">{data.description}</td>
                                            <td className="row-cell">{data.idUser}</td>
                                            <td className="row-cell">{data.dateCreate?.split("T")[0]}</td>
                                            <td className="row-cell">{data.hora}</td>
                                            <td className="row-cell">{data.isUpdate ? 'si' : 'no'}</td>
                                            <td className="row-cell">{data.responsableUpdate}</td>
                                            <td className="row-cell">{data.updateDate?.split("T")[0]}</td>
                                            <td className="row-cell">{data.horaUpdate}</td>
                                            <td className="row-cell">{data.montoGasto}Bs</td>


                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    }
                    {this.state.sectionMenuModal === 1 &&
                        <Form
                            form={this.state.updateForm}
                            colors={this.props.color}
                            onClose={() => this.modalFunction(2)}
                            submit={this.updateDatas}
                            isUpdate={true}
                        ></Form>
                    }

                </Modal>
            </>
        );
    }
}

export default Gastos
