import React, { useState, useEffect } from 'react'
import './neuvaVentaStyle.css';
import MenuRoutes from '../../routes/Menu';
import CardMenu from '../CardMenuSelect/CardMenu';
import FormVenta from '../FormVentas/FormVenta';
import VentasRoutes from '../../routes/Ventas';
import Ticket from '../Ticket/Ticket';
//import PdfTicket from '../Ticket/PdfTicket';
import getWindowDimensions from '../Hooks.js/windowDimensions';
import Modal from '../Modal'

import { Url } from '../../routes/Url';
import { SearcProdcuts } from './SearchProducts/SearchProducts';
import CategoriaProductosRoute from '../../routes/CategoriaProductos';

const dataTicket = {
    nomNegocio: '',
    direccion: '',
    paisCiudad: '',
    fechaRegistroCompra: '',
    nombreCliente: '', //realizar una ruta que saque el nombre del cliente con su id
    productos: [],
    total: '',
    efectivo: '',
    cambio: '',
    usuario: '',   //sacamos del local storage     
}

function NuevaVenta({ colors, RouteOnliAdmin, msgToast, listGastos }) {
    const [listProduct, setListProduct] = useState([]);
    const [auxSelectList] = useState({});
    const [productSelect, setProductSelect] = useState([]);
    const [ticket, setTicket] = useState(dataTicket);
    const [modal, setModal] = useState(false);
    const [dataFormVenta, setDataFormVenta] = useState({})
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [heightR, setHeightR] = useState(0);
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        let porcent = 0.697;
        if(windowDimensions.height < 976) porcent = 0.685;
        if(windowDimensions.height < 960) porcent = 0.67;
        if(windowDimensions.height < 820) porcent = 0.662;
        if(windowDimensions.height < 770) porcent = 0.65;
        if(windowDimensions.height < 695) porcent = 0.635;
        if(windowDimensions.height < 630) porcent = 0.62;
        if(windowDimensions.height < 575) porcent = 0.60;
        if(windowDimensions.height < 535) porcent = 0.585;

        let r =  (windowDimensions.height * porcent);
        let b =  (windowDimensions.height * 0.81)
        if(b>=420){
            setHeightR(r);
        }        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowDimensions]);



    const modalFunction = (data) => {
        console.log('llllllllllllllllllllllllllllllllll', data)
        setDataFormVenta(data)
        console.log('data-->', data,modal)
        product(data, modal);
        setModal(!modal);
    }

    useEffect(() => {
        let isMounted = true;
        async function getList() {
            const resp = await CategoriaProductosRoute.searchProductos();
            if (resp.error) {
                msgToast({
                    msg: 'No hay coneccion con la base de datos',
                    tipe: 'warning',
                    title: 'Error 400'
                });
                return
            }
            if (resp.resp.status === 'No fount') {
                msgToast({
                    msg: resp.resp.message,
                    tipe: 'warning',
                    title: 'Error'
                });
                return
            }
            if (resp.resp.status === 'ok') {

                const arrMenu = resp.resp.result.map((data) => {
                    return {
                        id: data._id,
                        nombre: data.nameProduct,
                        ingredientes: data.description,
                        quantity: data.unidadesDisponibles,
                        // img: Url.urlBackEnd + data.urlImages[0]?.img,
                        img: data.urlImages[0]?.img,
                        precioCosto: data.precioCosto,

                        codigoProducto: data.codigoProducto?data.codigoProducto:'',
                        precio: data.precioUnitario,
                        idUser: data.idUser,
                        category: data.category,
                        subcategory: data.subcategory,
                        arrayUnidadesDisp:[],
                        unidadesVendidos: 0,
                    }
                })


                setListProduct(arrMenu);
            }
        }
        if (isMounted) {
            getList();
        }
        return () => {
            isMounted = false
        }
    }, [msgToast])

    const clickProduct =async(data) => {
        //añadimos su cantidad inicial a un axiliar para compar al
        //eliminar los productos seleccionados, esto para que la cantidad
        // del producto no se corrompa

        console.log('%c data', 'color: red', data);

        let auxSelected = auxSelectList[data.id];
        // console.log('%c auxSelected', 'color: green', auxSelected);

        if (!auxSelected) {
            
            auxSelected = auxSelectList[data.id] = {
                data: data,
                qty: 0
            };
        }
        auxSelected.qty++;
        //disminuye la cantidad del producto        
        const countP = listProduct.map((item) => {

           if(productSelect.filter((product)=>(product.id===item.id)).length===0){
                if (data.id === item.id) {
                    const updateCanttidad = {
                        ...item,
                        quantity: item.quantity === 0 ? 0 : item.quantity - 1
                        
                    }
                    return updateCanttidad;
                }
                return item;
           }
            return item;

        })

    
        setListProduct(countP)
        //verificamos si la cantidad de un producto es < 5 
        for (let i = 0; i < countP.length; i++) {
            if (data.id === countP[i].id) {
                if (countP[i].quantity === 0) {
                    msgToast({
                        msg: `LA CANTIDAD DE ${countP[i].nombre} ES 0`,
                        tipe: 'warningTransparent',
                        title: 'Error',
                        time: 100000,
                        position: 'topLeft'
                    });
                } else
                    if (countP[i].quantity <= 5) {
                        msgToast({
                            msg: `CANTDAD DEL PORDUCTO ${countP[i].nombre} ES ${countP[i].quantity}`,
                            tipe: 'info',
                            title: 'Error',
                            time: 100000,
                            position: 'topLeft'

                        });
                    }
            }
        }

        //si el producto aun no esta agregado se agregara a la lista a demas de la cantidad debe ser mayor a cero
        if( productSelect.filter((item)=>(item.id===data.id)).length===0 && data.quantity>0){
            await setProductSelect([
                ...productSelect, ...[{
                    id: data.id,
                    idProduct: data.id,
                    nombre: data.nombre,
                    codigoProducto: data.codigoProducto?data.codigoProducto:'',
                    description: '',
                    precio: data.precio,
                    unidadesDisponibles: data.quantity,
                    arrayUnidadesDisp:await  convertNumberToArray(data.quantity),
                    unidadesVendidos: data.unidadesVendidos+1,
                    total: data.precio * 1,
                }]
            ])
            
            console.log('%c producto agregado ok', 'color: orange', productSelect);
        }
       
    }

    const updateCantidad=async(data, e)=>{

        // console.log('%c data', 'color: pink', data);
        // console.log('%c data', 'color: pink', e.target.value);
        
        let auxSelected = auxSelectList[data.id];
        var countP = productSelect.map((item) => {
            if (data.id === item.id) {
                var updateCanttidad = {
                    ...item,
                    quantity: auxSelected.data.quantity === item.quantity ? item.quantity : data.unidadesDisponibles - e.target.value,
                    unidadesVendidos: parseInt(e.target.value),
                    total: parseInt(e.target.value) * item.precio
                }
                return updateCanttidad;
            }
            return item;

        });
        setProductSelect(countP)

        let auxSelected2 = auxSelectList[data.id];
        var countP2 = listProduct.map((item) => {
            if (data.id === item.id) {
                var updateCanttidad = {
                    ...item,
                    quantity: auxSelected2.data.quantity === item.quantity ? item.quantity : data.unidadesDisponibles - e.target.value,
                    unidadesVendidos: parseInt(e.target.value)
                }
                return updateCanttidad;
            }
            return item;

        });
        setListProduct(countP2)
        //  console.log('%c updatePrecio', 'color: red', countP);
    }


    const convertNumberToArray=async(numberCantidad)=>{
        let array = [];
        for (let i = 0; i < numberCantidad; i++) {
            array.push(i + 1);
        }
        return array;
    }

    const deleteProduct =async (p, data) => {
        console.log('%c data', 'color: blue', data);
        console.log('%c p', 'color: blue', p);
        let auxSelected = auxSelectList[data.id];
        const countP = await listProduct.map((item) => {
            if (data.id === item.id) {
                const updateCanttidad = {
                    ...item,
                    quantity: auxSelected.data.quantity === item.quantity ? item.quantity : item.quantity + data.unidadesVendidos,
                    unidadesVendidos: 0
                }
                return updateCanttidad;
            }
            return item;

        });
        setListProduct(countP)

        let auxSelected2 = auxSelectList[data.id];
        const countP2= await productSelect.map((item) => {
            if (data.id === item.id) {
                const updateCanttidad = {
                    ...item,
                    quantity: auxSelected2.data.quantity === item.quantity ? item.quantity : item.quantity + item.unidadesVendidos,
                    unidadesVendidos: 0
                }
                return updateCanttidad;
            }
            return item;

        });
        setProductSelect(countP2)

        let arr = [];
        for (let i = 0; i < productSelect.length; i++) {
            if (i !== p) {
                arr.push(productSelect[i])
            }
        }

        setProductSelect(arr);
    }

    //esta funcion es para el ticket del cliente
    const product = async (dataVenta, modalIsActive) => {
        
        let item = {}, arr = [], storedItem = {};
        // if (modalIsActive) {
        //     for (let j = 0; j < productSelect.length; j++) {
        //         productSelect[j].unidadesVendidos = 0;
        //     }
        //     return;
        // }
        const user = await JSON.parse(localStorage.getItem('tokTC'));
        const negocio = await getDataNegocio();
        let clienteData = ''

        if (dataVenta?.idCliente) {
            const getClientedata = await nameCLiente(dataVenta.idCliente);
          
            clienteData = `${getClientedata.nombre} ${getClientedata.lastName}`
        } else {
            console.log(clienteData)
            clienteData = dataVenta?.nombreCliente
        }

        for (var i = 0; i < productSelect.length; i++) {
            storedItem = item[`${productSelect[i].nombre}-${productSelect[i].description ? productSelect[i].description : 'D'}`];
            if (!storedItem) {
                storedItem = item[`${productSelect[i].nombre}-${productSelect[i].description ? productSelect[i].description : 'D'}`] = productSelect[i]
            }
            //storedItem.unidadesVendidos++;
            console.log('%c storedItem -->', 'color: red', storedItem);
            //storedItem.total = storedItem.precio * storedItem.unidadesVendidos
        }

        for (const id in item) {
            arr.push(item[id]);
        }
        let fechaHora = new Date()
        setTicket({
            nomNegocio: negocio.nombre, //sacar el nombre mediante una ruta api
            direccion: negocio.direccion,  //sacar el nombre mediante una ruta api
            paisCiudad: `${negocio.ciudad} ${negocio.pais}`, //sacar el nombre mediante ununa ruta api
            fechaRegistroCompra: `${fechaHora.toLocaleDateString()} ${fechaHora.toLocaleTimeString()}`,
            nombreCliente: clienteData, //realizar una ruta que saque el nombre del cliente con su id
            productos: arr,
            total: dataVenta?.precioTotal,
            efectivo: dataVenta?.pagoCliente?dataVenta?.pagoCliente:0,
            cambio: dataVenta?.cambioCliente?dataVenta?.cambioCliente:0,
            usuario: `${user.user.name} ${user.user.lastName}`,
        })
    }

    const nameCLiente = async (idCliente) => {
        const resp = await VentasRoutes.dataCliente(idCliente);
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
            return resp.resp.result
        }
    }

    const getDataNegocio = async () => {
        const resp = await VentasRoutes.getDatasNegocio();
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
            return resp.resp.result
        }
    }

    //se registra desde el componente ticket
    const registrarVenta = async () => {
        //const products = await product(productSelect)
        let formVenta = {
            products: productSelect,
            nombreCliente: dataFormVenta.nombreCliente,
            idCliente: dataFormVenta.idCliente,
            pagoCliente: dataFormVenta.pagoCliente,
            cambioCliente: dataFormVenta.cambioCliente,
            precioTotal: dataFormVenta.precioTotal,
        }
        const resp = await VentasRoutes.registerVentas(formVenta)

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
            msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            setProductSelect([]);
            listGastos();
            modalFunction();
        }

    }
    ///descripcion del producto
    const changeDescription = (e) => {
        const { value, name } = e.target;
        const update = productSelect.map((data, key) => {
            //el name es el id para identificar en el arr de productSelect para actualizar los datos en la descripcion
            if (key === (name * 1)) {
                return {
                    ...data,
                    description: value,

                };
            };
            return data;
        });

        setProductSelect(update);
    }

    return (
        <>
            <div className='conted-venta'>
                <SearcProdcuts setListProduct={setListProduct} />
                <div style={{height: heightR}} className={RouteOnliAdmin ? 'conted-products heightAdmin' : 'conted-products'}>
                    
                    <CardMenu
                        arrDatas={listProduct} // lista de datos dinamico
                        clickProduct={clickProduct}// esta funcion servira para seleccionar un producto
                    />
                </div>

                <div style={{height: heightR}} className={RouteOnliAdmin ? 'conted-form-venta heightAdmin' : 'conted-form-venta'}>
                    <FormVenta
                        changeDescription={changeDescription}
                        arrProductSelect={productSelect}
                        deleteProduct={deleteProduct}
                        openModalPreView={modalFunction}
                        colors={colors}
                        msgToast={msgToast}
                        updateCantidad={updateCantidad}
                    />
                </div>

               

            </div>
            <Modal
                colors={colors}
                isOpen={modal}
                onClose={modalFunction}
                size='30%'
                title='Ticket'
            >
                <Ticket registrarVenta={registrarVenta} data={ticket} />

            </Modal>
        </>
    )
}

export default NuevaVenta
