import React from "react";
import Menu from '../components/Menu';
import ContainerList from "../components/ContainerList";
import CardView from "../components/Mesas/CardView";
/* import IMgPollo from '../assets/pollo.jpg';
import Pipoca from '../assets/pipocaDePollo.jpg';
import CocaCola from '../assets/cocaCola.jpg'; */
import Modal from '../components/Modal';
import Form from "../components/Form";
import MenuRoutes from "../routes/Menu";
import { Url, Socket } from "../routes/Url";
import CategoriaProductosRoute from '../routes/CategoriaProductos';
import SearcProdcutsForClass from "../components/SearchProductsForClass/SearchProductsForClass";
// ddddss


class MenuProduct extends React.Component {
    state = {
        isPermitRoute: null,
        buttonsMenu: [
            {
                rolePermit: [
                    { name: 'admin' }, { name: 'user' }, { name: 'mesero' }, { name: 'caja' }, { name: 'cocinero' }
                ], button: 'Lista de productos', selected: 'buttonSeleccted'
            },
            { rolePermit: [{ name: 'admin' }, { name: 'cocinero' }], button: 'Nuevo producto', selected: '' },
        ],
        buttonsMenuModal: [
            { rolePermit: [{ name: 'admin' }, { name: 'mesero' }, { name: 'caja' }], button: 'Actualizar datos', selected: 'buttonSeleccted' },
            { rolePermit: [{ name: 'admin' }], button: 'Actualizar imagen', selected: '' },
        ],
        modals: {
            isOpen: false,
            isOpen1: false,
        },
        form: [
            { error: '', isRequired: true, focus: '', name: 'nameProduct', label: 'Nombre', value: '', tipe: 'text' },
            { error: '', isRequired: false, focus: '', name: 'description', label: 'Descripción', value: '', tipe: 'textarea' },
            {
                disable: false, error: '', isRequired: true, focus: '', name: 'category', label: 'Categoria', value: '', tipe: 'select', options: [
                    /* { name: 'Pollo', value: 'pollo' }, */
                    /* se va a añadir de forma dinamica */
                ]
            },
            {
                disable: false, error: '', isRequired: true, focus: '', name: 'subcategory', label: 'Sub categoria', value: '', tipe: 'select', options: [
                    /*  { name: 'Pecho', value: 'pecho' }, */
                    /* se va a añadir de forma dinamica */
                ]
            },
            { error: '', isRequired: false, focus: '', name: 'codigoProducto', label: 'Codigo producto', value: '', tipe: 'text' },
            { error: '', isRequired: true, focus: '', name: 'precioCosto', label: 'Precio de compra (proveedor)', value: '', tipe: 'number' },
            { error: '', isRequired: true, focus: '', name: 'precioUnitario', label: 'Precio de venta (cliente final)', value: '', tipe: 'number' },
            { error: '', isRequired: true, focus: '', name: 'unidadesDisponibles', label: 'Cantidad', value: '', tipe: 'number' },
            { error: '', isRequired: false, focus: '', name: 'image', label: 'Imagen de producto', value: '', tipe: 'file' },

        ],
        formUpdate: [
            { error: '', isRequired: true, focus: '', name: 'nombre', label: 'Nonbre', value: '', tipe: 'text' },
            { error: '', isRequired: false, focus: '', name: 'ingredientes', label: 'Ingredientes', value: '', tipe: 'textarea' },
            {
                disable: false, error: '', isRequired: true, focus: '', name: 'category', label: 'Categoria', value: '', tipe: 'select', options: [
                    /* { name: 'Pollo', value: 'pollo' }, */
                    /* se va a añadir de forma dinamica */
                ]
            },
            {
                disable: false, error: '', isRequired: true, focus: '', name: 'subcategory', label: 'Sub categoria', value: '', tipe: 'select', options: [
                    /*  { name: 'Pecho', value: 'pecho' }, */
                    /* se va a añadir de forma dinamica */
                    
                ]
            },
            { error: '', isRequired: false, focus: '', name: 'codigoProducto', label: 'Codigo producto', value: '', tipe: 'text' },
            { error: '', isRequired: true, focus: '', name: 'precio', label: 'Precio unidad', value: '', tipe: 'number' },
            { error: '', isRequired: true, focus: '', name: 'precioUnitario', label: ' Precio final', value: '', tipe: 'number' },            
            { error: '', isRequired: true, focus: '', name: 'quantity', label: 'Cantidad', value: '', tipe: 'number' },
        ],
        formImagen: [
            { error: '', isRequired: true, focus: '', name: 'image', label: 'Seleccione imagen para actualizar', value: '', tipe: 'file' },
        ],
        idMenu: '',
        listCard: [],
        listPCategorias:[]
    }
    //mustra la lista de menu
    getlistMenu = async () => {
        const resp = await CategoriaProductosRoute.searchProductos();

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
                msg: 'No se pudo mostrar el menu',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            const arrMenu = resp.resp.result.map((data) => {
                return {
                    id: data._id,
                    nombre: data.nameProduct,
                    codigoProducto: data.codigoProducto,
                    ingredientes: data.description,
                    quantity: data.unidadesDisponibles,
                    codigoProducto: data.codigoProducto?data.codigoProducto:'',
                    // img: Url.urlBackEnd + data.urlImages[0]?.img,
                    img: data.urlImages[0]?.img,
                    precioUnitario: data.precioUnitario,
                    precio: data.precioCosto,
                    idUser: data.idUser,
                    category: data.category,
                    subcategory: data.subcategory
                }
            })
            // reciviendo datos desde un socket esto se actualiza en tiempo real
            //esto aniade a la lista solo el producto que se registro en otro usario y no asi toda la lista de nuevo

            //para cuando se elimine un producto realizar una nuevo canal por donde escuchar 
            //lo que se elimino para quitar directamente del array

            Socket.on('[product] addNewProduct', data => {
                //console.log('connected to server', data);
                //setNames(data);
                this.setState({
                    listCard: [
                        ...this.state.listCard, ...[{
                            id: data._id,
                            nombre: data.nameProduct,
                            codigoProducto: data.codigoProducto,
                            ingredientes: data.description,
                            quantity: data.unidadesDisponibles,
                            codigoProducto: data.codigoProducto?data.codigoProducto:'',
                        
                            // img: Url.urlBackEnd + data.urlImages[0]?.img,
                            img: data.urlImages[0]?.img,
                            precioUnitario: data.precioUnitario,
                            precio: data.precioCosto,
                            idUser: data.idUser,
                            category: data.category,
                            subcategory: data.subcategory,
                        }]
                    ]
                })
            })
            this.setState({
                listCard: arrMenu
            })
        }
    }
    update = async (data) => {
        console.log("update list");
        this.setState({
            listCard:data
        })
    }
    //registrar menu o producto
    inserData = async (data) => {
        /* let objData = data;
        if (objData.typeProduct === 'pollo') {
            objData['quantity'] = objData.quantity * objData.presas
        } */
        /* this.setState({
            listCard: [
                ...this.state.listCard, ...[data]
            ]
        }) */
        if(data.precioCosto  *1  > data.precioUnitario * 1){
            this.props.msgToast({
                msg: 'El precio de unidad no puede ser menor al precio final',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (!data.image) {
            this.props.msgToast({
                msg: 'Seleccione una imagen por favor',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        const resp = await MenuRoutes.createMenu(data);
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
            this.uploadImagenMenu(data.image, resp.resp.result._id);
            this.modalFunction(1);
        }
    }
    //actulizar menu
    updateDataMenu = async (data) => {
        const newData = await {
            nameProduct: data.nombre,
            codigoProducto: data.codigoProducto,
            description: data.ingredientes,
            unidadesDisponibles: data.quantity,
            precioUnitario: data.precioUnitario,
            precioCosto: data.precio,
            category: data.category,
            subcategory: data.subcategory
        }        
        const resp = await MenuRoutes.updateData(newData, this.state.idMenu);
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
            this.getlistMenu();
            this.modalFunction('modalDetalles');
        }
    }
    //actualizar la imagen del menu
    updateImagenMenu = async (file) => {
        if (!file.image) {
            this.props.msgToast({
                msg: 'Seleccione una imagen porfavor',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        //this.uploadImagenMenu(file.image,this.state.idMenu);
        const resp = await MenuRoutes.uploadImagen(file.image, this.state.idMenu);
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
                msg: 'Se actualizo la imagen',
                tipe: 'success',
                title: 'Genial...'
            });
            this.getlistMenu();
            this.modalFunction('modalDetalles');
        }
    }
    uploadImagenMenu = async (imagen, idMenu) => {
        const resp = await MenuRoutes.uploadImagen(imagen, idMenu);
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
        this.getlistMenu();
    }
    //funcion para poder interactuar con los botones del menu
    fucntionMenu = (p) => {

        if (p === 1) {
            this.setState({
                modals: {
                    isOpen: !this.state.modals.isOpen
                }
            })
        }

    }
    fucntionMenuModal = (p) => {
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
    //funcion para poder abrir o cerrar el modal
    modalFunction = (p) => {

        this.setState({
            modals: {
                isOpen: p === 1 ? !this.state.modals.isOpen : this.state.modals.isOpen,
                isOpen1: p === 'modalDetalles' ? !this.state.modals.isOpen1 : this.state.modals.isOpen1,
            }
        })

    }

    //funcion esto es cuando se hace click a un boton de list card
    //elimina o muestra los detalles del producto
    btnFunction = (data, fun) => {
        if (fun === 'deleteMenu') {
            //eliminar menu
            var position = 0;
            var array = this.state.listCard;
            for (var i = 0; i < array.length; i++) {
                if (data.nombre === array[i].nombre) {
                    position = i;
                }
            }
            console.log(data)
            MenuRoutes.deleteProduct(data?.id, false);
            array.splice(position, 1);
            this.setState({
                listCard: array
            });
            return;
        }
        //detalles del menu para poder actulizar el menu
        if (fun === 'showDetails') {
            //abrir modal de detalles del menu
            this.modalFunction('modalDetalles');
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
                formUpdate: arr,
                idMenu: data.id
            })
        }

    }
    //verifica si los permisos para cada button los quita o los agrega segun su rol
    buttonMenuDinamic = async () => {
        const buttonsMenu = await this.props.menuButtonsPermit(this.state.buttonsMenu);
        const buttonsMenuModal = await this.props.menuButtonsPermit(this.state.buttonsMenuModal);
        //console.log(buttonsMenuModal, ' ...............,,,,,,,,,,,,,')
        this.setState({
            buttonsMenu,
            buttonsMenuModal
        });
    }

    //get Categori product dinamico
    getLIstCategoriProduct = async () => {
        const resp = await CategoriaProductosRoute.list();
        if (resp.error) {
            this.props.msgToast({
                msg: resp.err?.message,
                tipe: 'warning',
                title: `Error ${resp?.err?.status}`
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

            let arr = this.state.form;
            let arrUpate = this.state.formUpdate

            for (let i = 0; i < resp.resp.result.length; i++) {
                console.log('resp.resp.result[i]', resp.resp.result[i])
                arr[2].options.push({
                    name:resp.resp.result[i].nombre,
                    value:resp.resp.result[i].nombre,
                    main:true                
                })
                
            }
            for (let j = 0; j < resp.resp.result.length; j++) {
                arrUpate[2].options.push({
                    name:resp.resp.result[j].nombre,
                    value:resp.resp.result[j].nombre,
                    main:true                
                })
            }
            this.setState({
                form:arr,
                formUpdate:arrUpate,
                listPCategorias: resp.resp.result
            })            
        }
    }
    async componentDidMount() {
        this.props.verifyToken();
        this.getlistMenu();
        //roles que tienen permiso de ver esta vista
        if (await this.props.permissions([{ name: 'admin' }, { name: 'user' }, { name: 'mesero' }, { name: 'caja' }, { name: 'cocinero' }])) {
            this.setState({
                isPermitRoute: true
            })
        } else {
            this.setState({
                isPermitRoute: false
            })
        }
        this.buttonMenuDinamic();
        this.getLIstCategoriProduct();
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

                {/* <SearcProdcuts setListProduct={this.state.listCard} isClass={true}/> */}
                
                <SearcProdcutsForClass update={this.update} />

                <ContainerList heigth={this.props.color} heigthPrimary={this.props.RouteOnliAdmin ? '100' : '435'}>
                    <CardView
                        clickProduct={this.btnFunction}
                        colors={this.props.color}
                        butonActivate={false}
                        arrDatas={this.state.listCard} // lista de datos dinamico
                        btnStyleColor='danger-btn'
                        titleButton='Eliminar'
                    />
                </ContainerList>
                {/* modal de formulario de productos */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen}
                    onClose={() => this.modalFunction(1)}
                    size='60%'
                    title='Formulario de registro'
                >
                    <Form
                        form={this.state.form}
                        colors={this.props.color}
                        onClose={() => this.modalFunction(1)}
                        submit={this.inserData}
                        listPCategorias={this.state.listPCategorias}
                    /* formId={'menu'} */
                    >

                    </Form>
                </Modal>
                {/* modal de actulaizar productos */}
                <Modal
                    colors={this.props.color}
                    isOpen={this.state.modals.isOpen1}
                    onClose={() => this.modalFunction('modalDetalles')}
                    size='60%'
                    title='Actulaizar menu'
                >
                    <Menu
                        colors={this.props.color}
                        buttons={this.state.buttonsMenuModal}
                        functionsMenu={this.fucntionMenuModal}

                    />
                    {this.state.buttonsMenuModal[0] ? this.state.buttonsMenuModal[0].selected === 'buttonSeleccted' &&
                        <Form
                            form={this.state.formUpdate}
                            colors={this.props.color}
                            onClose={() => this.modalFunction('modalDetalles')}
                            submit={this.updateDataMenu}
                            isUpdate={true}
                            listPCategorias={this.state.listPCategorias}
                            /* formId={'menu'} */
                        ></Form>
                        :
                        <></>
                    }
                    {this.state.buttonsMenuModal[1] ? this.state.buttonsMenuModal[1].selected === 'buttonSeleccted' &&
                        <Form
                            form={this.state.formImagen}
                            colors={this.props.color}
                            onClose={() => this.modalFunction('modalDetalles')}
                            submit={this.updateImagenMenu}
                            isUpdate={true}
                        ></Form>
                        :
                        <></>
                    }


                </Modal>
            </>
        );
    }
}
export default MenuProduct;