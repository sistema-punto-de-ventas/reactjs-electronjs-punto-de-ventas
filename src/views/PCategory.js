import React, { Component } from 'react'
import Modal from '../components/Modal';
import Form from "../components/Form";
import CategoriaProductosRoute from '../routes/CategoriaProductos';
import './Styles/categoriaStyle.css'

const formDatas = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'nombre', label: 'Nombre', value: '', tipe: 'text' },
]
const formUpdate = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'nombre', label: 'Nombre', value: '', tipe: 'text' },
]

export class PCategory extends Component {
    state = {
        isPermitRoute: null,
        modals: {
            isOpen: false,
            isOpen2: false,
            isOpen3: false,
        },

        form: formDatas,
        formUpdate: formUpdate,
        formSubcategori: formDatas,
        formUpdateSubcategori: formUpdate,

        listCategorias: [],
        listSubcategorias: [],

        idSelected: '',//este es el id de una categoria seleccionada   
        idSubcategoriSelected:'', // id para actualizar la subcategoria  

        positionListCategori: 0, // esta es la posicioon que se sellecciono para mostrar la subcatogoria
        secttion: 0,
        nameCategoriSelected: '', // nombre de la categoria seleccionada
    }
    changeSecttion = (p, key, idPcategori, nameCategori) => {
        this.setState({
            idSelected: idPcategori,
            secttion: p,
            listSubcategorias: key !== '' ? this.state.listCategorias[key].subcategorias : [],
            positionListCategori: key,
            nameCategoriSelected: nameCategori
        })
    }
    modalFunction = (p) => {
        this.setState({
            modals: {
                isOpen: p === 1 ? !this.state.modals.isOpen : this.state.modals.isOpen,
                isOpen2: p === 2 ? !this.state.modals.isOpen2 : this.state.modals.isOpen2,
                isOpen3: p === 3 ? !this.state.modals.isOpen3 : this.state.modals.isOpen3,
            }
        });
    }
    //registramos nueva categoria
    inserData = async (data) => {       
        const resp = await CategoriaProductosRoute.addCategoria(data);       
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
            this.listCategoriaProducto();
            this.modalFunction(1)
        }
    }
    listCategoriaProducto = async () => {
        const resp = await CategoriaProductosRoute.list();
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
            this.setState({
                listCategorias: resp.resp.result
            })
        }
    }
    updateDatas = async (data) => {        
        const resp = await CategoriaProductosRoute.updateCategoria(data, this.state.idSelected);        
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
            this.listCategoriaProducto();
            this.modalFunction(2)
        }
    }
    btnFunction = async (data, fun) => {
        if (fun === 'update') {

            let arr = this.state.formUpdate;

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
                    isOpen2: !this.state.modals.isOpen2,
                    isOpen3: this.state.modals.isOpen3,
                    isOpen4: this.state.modals.isOpen4
                },
                formUpdate: arr,
                idSelected: data._id
            });
        }
        if (fun === 'updateSubcategori') {

            let arr = this.state.formUpdateSubcategori;

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
                    isOpen2: this.state.modals.isOpen2,
                    isOpen3: this.state.modals.isOpen3,
                    isOpen4: !this.state.modals.isOpen4
                },
                formUpdateSubcategori: arr,
                idSubcategoriSelected: data._id
            });
        }
    }
    //register sub categoria
    registrarSubcategoria = async (data) => {       
        const resp = await CategoriaProductosRoute.addSubcategori(data, this.state.idSelected);      
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
            await this.listCategoriaProducto();
            this.modalFunction(3);
            this.changeSecttion(1, this.state.positionListCategori, this.state.idSelected, this.state.nameCategoriSelected)
        }
    }
    //actualizar subcategoria
    updateSubcategori=async(data)=>{       
        const resp = await CategoriaProductosRoute.updateSubcategori(data, this.state.idSubcategoriSelected);
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
            await this.listCategoriaProducto();
            this.modalFunction(4);
            this.changeSecttion(1, this.state.positionListCategori, this.state.idSelected, this.state.nameCategoriSelected)
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
        this.listCategoriaProducto();
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
                {this.state.secttion === 0 &&
                    <div className="contend-gastos" >
                        <div className="conted-left">
                            <h2>Categoria Porductos</h2>
                        </div>
                    
                        <div className="conted-right">
                            <button className="buttonCategory" onClick={() => this.modalFunction(1)}>Nuevo</button>
                        </div>
                        <div id='table-data' className={this.props.RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                            <div className="contend-table tableOutModal">
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-headers">
                                            <th className="header" scope="col">Num</th>
                                            <th className="header" scope="col">Nombre</th>
                                            <th className="header" scope="col">fecha de registro</th>
                                            <th className="header" scope="col">Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body" >

                                        {this.state.listCategorias.map((data, key) => {
                                            return (
                                                <tr key={key} className="table-row">
                                                    <td className="row-cell">{key + 1}</td>
                                                    <td className="row-cell">{data.nombre}</td>
                                                    <td className="row-cell">{data.createdAt?.split('T')[0]}</td>
                                                    <td className="row-cell">
                                                        <button
                                                            className="buttonCategory blue"
                                                            onClick={() => this.btnFunction(data, 'update')}
                                                            >
                                                            Actualizar</button>
                                                        <button
                                                            className="buttonCategory blue"
                                                            onClick={() => this.changeSecttion(1, key, data._id, data.nombre)}
                                                            >
                                                            Sub Categoria
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                {this.state.secttion === 1 &&
                    <div className="contend-gastos">
                        <div className="conted-left">
                            <h2>{this.state.nameCategoriSelected}</h2>
                        </div>
                        <div className="conted-right">
                            <button className="buttonCategory" onClick={() => this.changeSecttion(0, '', '')}>Volver</button>
                            <button className="buttonCategory" onClick={() => this.modalFunction(3)}>Nuevo</button>
                        </div>
                        <div className={this.props.RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                            <div className="contend-table tableOutModal">
                                <table className="table">
                                    <thead className="table-head">
                                        <tr className="table-headers">
                                            <th className="header" scope="col">Num</th>
                                            <th className="header" scope="col">Nombre</th>
                                            <th className="header" scope="col">fecha de registro</th>
                                            <th className="header" scope="col">Opciones</th>

                                        </tr>
                                    </thead>
                                    <tbody className="table-body">

                                        {this.state.listSubcategorias.map((data, key) => {
                                            return (
                                                <tr key={key} className="table-row">
                                                    <td className="row-cell">{key + 1}</td>
                                                    <td className="row-cell">{data.nombre}</td>
                                                    <td className="row-cell">{data.fechaRegistro?.split('T')[0]}</td>
                                                    <td className="row-cell">
                                                        <button
                                                            className="buttonCategory blue"
                                                            onClick={() => this.btnFunction(data, 'updateSubcategori')}
                                                            >
                                                            Actualizar
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                {/* registrar categoria del producto */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen}
                    onClose={() => this.modalFunction(1)}
                    size='60%'
                    title='Registra categoria de producto'
                >
                    <Form
                        form={this.state.form}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(1)}
                        submit={this.inserData}
                        isUpdate={false}
                    ></Form>
                </Modal>
                {/* actualizamos la categoria del producto */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen2}
                    onClose={() => this.modalFunction(2)}
                    size='60%'
                    title='Registra categoria de producto'
                >
                    <Form
                        form={this.state.formUpdate}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(2)}
                        submit={this.updateDatas}
                        isUpdate={true}
                    ></Form>
                </Modal>
                {/* form subcategoria */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen3}
                    onClose={() => this.modalFunction(3)}
                    size='60%'
                    title={`Registrar Sub categoria de ${this.state.nameCategoriSelected}`}
                >
                    <Form
                        form={this.state.formSubcategori}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(3)}
                        submit={this.registrarSubcategoria}
                        isUpdate={false}
                    ></Form>
                </Modal>
                {/* form subcategoria upate */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen4}
                    onClose={() => this.modalFunction(4)}
                    size='60%'
                    title='Actualizar Sub categoria'
                >
                    <Form
                        form={this.state.formUpdateSubcategori}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(4)}
                        submit={this.updateSubcategori}
                        isUpdate={false}
                    ></Form>
                </Modal>
            </>
        )
    }
}

export default PCategory
