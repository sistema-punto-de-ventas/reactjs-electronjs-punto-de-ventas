import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal';
import Form from '../Form';
import CLienteRoutes from '../../routes/Clientes';
import { FiX } from "react-icons/fi"; //FiX
import './formStyle.css';
import Redondear from '../../utils/redondeNumeros/redondeNumeros';


const formVenta = {
    nombreCliente: 'Publico General',
    idCliente: '',
    pagoCliente: "",
    cambioCliente: 0,
}
const formCliente = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nombres', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'lastName', label: 'Apellidos', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'ci', label: 'C.I.', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'phoneNumber', label: 'Telefono', value: '', tipe: 'text' },
]
const error = {
    nombreCliente: '',
    pagoCliente: '',
}



function FormVenta({ arrProductSelect, deleteProduct, changeDescription, openModalPreView, colors, msgToast, updateCantidad, updateDescuentoUnidad}) {
    const [form, setForm] = useState(formVenta);
    const [formErro, setformErro] = useState(error);
    const [openModal, setOpenModal] = useState(false);
    const [sumaTotal, setSumaTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [totalDescuento, setTotalDescuento] = useState(0);
    const [buscador, setbuscador] = useState('');
    const [listClients, setListClients] = useState([]);
    const [cantidadLocal, setCantidadLocal] = useState(0);
    const [descuentoUnidad, setDescuentoUnidad] = useState(0);

    const [cantidadDisponible, setCanitdadDisponible] = useState([0]);

    const butonCliente = (fun) => {
        if (fun === 'exit') {
            setForm({
                ...form,
                nombreCliente: buscador ? buscador : 'Publico General',
                idCliente: ''
            });
            setformErro({
                ...formErro,
                nombreCliente: '',
                pagoCliente: formErro.pagoCliente,
            })
        }
    }

    const modalFunction = () => {
        setOpenModal(!openModal);
    }
    //registrar cliente
    const inserData = async (data) => {
        const resp = await CLienteRoutes.create(data);
        if (resp.error) {
            console.log('error no hay conection')
            msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error 400'
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            console.log('error')
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

            let newObj = await {
                nombreCliente: `${resp.resp.result.name} ${resp.resp.result.lastName}`,
                idCliente: resp.resp.result._id,
                pagoCliente: form.pagoCliente,
                cambioCliente: await Redondear.redondearMonto(form.cambioCliente),
            }
            setForm(newObj)

            modalFunction();
            /* setTimeout(()=>{
                modalFunction();
            },100) */
            console.log(form, 'esto es el form')
            console.log(newObj, 'esto es el obj')


        }
    }
    const handleChange = async (e) => {
        // console('ññññññññññññññññññññññññññññññññññññ')
        const { value, name } = e.target;   
        console.log(value, name)
        
        if (name === 'pagoCliente') {

            setForm({
                ...form,
                pagoCliente: value,
                cambioCliente:await Redondear.redondearMonto(value - sumaTotal)
            })
        } else {

            setForm({
                ...form,
                [name]: value
            })
        }
        if (name === 'nombreCliente' || name === 'pagoCliente') {

            setformErro({
                ...formErro,
                [name]: value.length === 0 ? 'Obligatorio' : ''
            })
        }
    }

    const total = useCallback(async() => {

    
        if (form.nombreCliente.length === 0) {
            setbuscador('')
        }
        if (arrProductSelect.length > 0) {
            let sum = 0;
            let totalDesc=0;
            let subt =0;
            for (let i = 0; i < arrProductSelect.length; i++) {
                // console.log('%c' + arrProductSelect[i].unidadesVendidos, 'color:red')
                // console.log('%c' + arrProductSelect[i].descuentoUnidad, 'color:red')
                console.log(arrProductSelect[i])
                sum = await Redondear.redondearMonto(((arrProductSelect[i].precio*arrProductSelect[i].unidadesVendidos) + sum) - (arrProductSelect[i].descuentoUnidad*arrProductSelect[i].unidadesVendidos));
                totalDesc = await Redondear.redondearMonto((arrProductSelect[i].descuentoUnidad * arrProductSelect[i].unidadesVendidos)+totalDesc);
                subt = await Redondear.redondearMonto(((arrProductSelect[i].precio*arrProductSelect[i].unidadesVendidos) + subt))
            }
            setTotalDescuento(totalDesc);
            setSubtotal(subt);
            setSumaTotal(sum)
            let obj = form;
            obj['cambioCliente'] = obj.pagoCliente - sum;
            setForm(obj);

            return;
        }

        setForm(form)
        setformErro(error)
        setSumaTotal(0)
    }, [arrProductSelect, form])

    useEffect(() => {
        total();
    }, [total,cantidadLocal]);



    const changeBuscador = (e) => {
        const { value } = e.target;
        setbuscador(value);
        listClientes(value);
    }
    //lista de clientes
    const listClientes = useCallback(async (data) => {
        const resp = await CLienteRoutes.buscarCliente(data ? data : '');
        //console.log(resp.resp, ' esto es del buscador')
        if (resp.error) {
            console.log('erro 1')
            msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error 400'
            });
            return;
        }
        if (resp.resp.status === 'No fount') {
            console.log('erro 2')
            msgToast({
                msg: 'No se puede mostrar los datos',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        if (resp.resp.status === 'ok') {
            setListClients(resp.resp.result);
        }

    }, [msgToast,])

    useEffect(() => {
        listClientes('');
    }, [listClientes]);

    const onclickLista = (data) => {
        setForm({
            ...form,
            nombreCliente: `${data.name}  ${data.lastName}`,
            idCliente: data._id
        })
        setformErro({
            ...formErro,
            nombreCliente: '',
            pagoCliente: formErro.pagoCliente,
        })
    }

    const onSubmit = (data) => {
        console.log(data);

        let obj = {}, error = false;
        for (const data in form) {
            if (data === 'nombreCliente' || data === 'pagoCliente') {
                if (!form[data]) {
                    obj[data] = `obligatorio`
                    error = true;
                }
            }
        }
        if(isNaN(form.pagoCliente)){
            setformErro({
                ...formErro,
                pagoCliente: 'Solo numeros',
            });
            error = true;
            return;
        }
        setformErro(obj)
        if (data.pagoCliente < data.precioTotal) {
            setformErro({
                ...formErro,
                nombreCliente: formErro.nombreCliente,
                pagoCliente: 'El pago del cliente es menor al monto total',
            });
            error = true;
        }

        
        if (!error) {
            openModalPreView(data);
            setForm(formVenta)
       
        }

    }


    const buttonsVenta = (n) => {
        console.log(n, 'dfsdf')
        if (n >= 10) {
            handleChange({
                target: {
                    name: 'pagoCliente', value: form.pagoCliente * 1 + n
                }
            })
            return;
        }
        if (n === 'C') {
            handleChange({
                target: {
                    name: 'pagoCliente', value: ""
                }
            })
            return
        }
        if (n === 'D') {
            if (form.pagoCliente) {
                let delN = form.pagoCliente.length;
                console.log(form.pagoCliente.replace(form.pagoCliente[delN - 1], ''));   //prints: 123
                handleChange({
                    target: {
                        name: 'pagoCliente', value: form.pagoCliente.replace(form.pagoCliente[delN - 1], '')
                    }
                })
            }
            return;
        }
        handleChange({
            target: {
                name: 'pagoCliente', value: form.pagoCliente.toString() + n
            }
        })
    }

  
   const  handlerDescuento= async (data, e)=>{
    var montoDescuento = await parseFloat(e.target.value);
    console.log(montoDescuento);
    console.log(typeof(montoDescuento))
    console.log(data.precio)
    
    await setDescuentoUnidad(montoDescuento)
    
    if(montoDescuento>=0 && montoDescuento!='' && montoDescuento!=NaN){
        console.log(`descuento -----${montoDescuento} -pppp`)
        updateDescuentoUnidad(data, montoDescuento);
    }else{
        updateDescuentoUnidad(data, 0);

    }

        // setDescuentoUnidad(e.target.value)
    }


    return (
        <>
            <h3 className='title-form-venta'>Datos de la venta</h3>
            <br />
            {/* <div className='contend-input-venta'>
                <input name='nombreCliente' type="text" className='input-venta'></input>
                <label className='venta-label'>Fecha</label>
            </div>
            <div className='contend-input-venta'>
                <input name='nombreCliente' type="text" className='input-venta'></input>
                <label className='venta-label'>Usuario</label>
            </div> */}
            {form.nombreCliente.length > 0 ?
                <div className='contend-input-venta'>
                    <input
                        name='nombreCliente'
                        onChange={handleChange}
                        value={form.nombreCliente}
                        type="text"
                        className='input-venta'
                    ></input>
                    <label className='venta-label'>Cliente <code>{formErro.nombreCliente}</code></label>
                    <i onClick={modalFunction}
                        className="bi bi-journal-plus icon-form-rigth"
                    ></i>
                </div>
                :

                <>
                    {/* https://codepen.io/Natarajah/pen/mAGQpw */}
                    <div className='contend-input-venta'>
                        <input
                            name='buscador'
                            onChange={changeBuscador}
                            value={buscador}
                            type="text"
                            className='input-venta'
                            placeholder='Buscar por ci'
                            autoComplete="off"
                        ></input>
                        <label className='venta-label'>Buscar Cliente <code>{formErro.nombreCliente}</code></label>
                        <i onClick={() => butonCliente('exit')}
                            className="bi bi-reply-fill icon-form-rigth"
                        ></i>
                        <div className='list-clientes'>
                            <ul>
                                {
                                    listClients.map((data, key) => {
                                        return <li onClick={() => onclickLista(data)} key={key}>{key + 1}: {data.name} {data.lastName}, C.I.: {data.ci}</li>
                                    })
                                }

                            </ul>
                        </div>
                    </div>
                </>
            }
            {arrProductSelect.length > 0 &&
                <>
                    <div id="listaDeCompras" className="contend-table tableOutModal table-from-venta">
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-headers">
                                    <th className="header" scope="col">Nombre</th>
                                    {/* <th className="header" scope="col">Descripcion</th> */}
                                    <th className="header" scope="col">Cantidad</th>
                                    <th className="header" scope="col">C._Compra</th>
                                    <th className="header" scope="col">Precio</th>
                                    <th className='header' scope='col'>descuento</th>
                                    <th className="header" scope="col">Opciones</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {arrProductSelect.map((data, key) => {

                               

                                    return (
                                        <tr key={key} className="table-row">
                                            <td className="row-cell">{data.nombre}</td>
                                            <td className="row-cell">
                                                {/* <input 
                                            className='tabel-input'
                                            onChange={changeDescription}
                                            name={data.id} 
                                            value={data.description}
                                            type='text'></input> */}
                                                {/* <select
                                                    className='tabel-input'
                                                    onChange={changeDescription}
                                                    name={key}
                                                    value={data.description}
                                                >
                                                    <option value=''></option>
                                                    <option value='Solo papa'>Solo papa</option>
                                                    <option value='Solo arroz'>Solo arroz</option>
                                                    <option value='Solo fideo'>Solo fideo</option>
                                                </select> */}
                                          
                                            Disponible: 
                                                {data.unidadesDisponibles}
                                            </td>
                                            {/* select cantidad de compra */}
                                            <td className="row-cell">
                                                <select onChange={(e)=>{updateCantidad(data,e);setCantidadLocal(e.target.value)}} className='select-cantidad-ventas'>
                                                    {
                                                        data.arrayUnidadesDisp.map((data, key) => {
                                                            return(
                                                                <option key={key} value={data}>{data}</option>
                                                            ) 
                                                        })
                                                    }
                                                </select>
                                            </td>
                                            <td className="row-cell">{data.precio}</td>
                                            <td className="row-cell descuento">
                                                <input
                                                    onChange={(e)=>{handlerDescuento(data,e)}}
                                                    value={data.descuento}
                                                    className='descuento-unidad' type="Number" placeholder='Monto' min="0">
                                                    
                                                 </input>
                                            </td>
                                            <td className="row-cell">
                                                {/* Quitar productos */}
                                                <button onClick={() => deleteProduct(key, data)} className='tableButton'>
                                                    <svg style={{width:'20px', }} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" sty fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <div className='content-left-and-right'>
                        <div className="contend-left">
                            <section className="buttons-number">
                                <button onClick={() => buttonsVenta(7)} className="button-number">7</button>
                                <button onClick={() => buttonsVenta(8)} className="button-number">8</button>
                                <button onClick={() => buttonsVenta(9)} className="button-number">9</button>

                                <button onClick={() => buttonsVenta(10)} className="button-number n">+10</button>

                                <button onClick={() => buttonsVenta(4)} className="button-number">4</button>
                                <button onClick={() => buttonsVenta(5)} className="button-number">5</button>
                                <button onClick={() => buttonsVenta(6)} className="button-number">6</button>

                                <button onClick={() => buttonsVenta(20)} className="button-number n">+20</button>

                                <button onClick={() => buttonsVenta(1)} className="button-number">1</button>
                                <button onClick={() => buttonsVenta(2)} className="button-number">2</button>
                                <button onClick={() => buttonsVenta(3)} className="button-number">3</button>

                                <button onClick={() => buttonsVenta(30)} className="button-number n">+30</button>

                                <button onClick={() => buttonsVenta('C')} className="button-number">C</button>
                                <button onClick={() => buttonsVenta(0)} className="button-number">0</button>
                                <button onClick={() => buttonsVenta(".")}className="button-number">.</button>

                                <button onClick={() => buttonsVenta('D')} className="button-number n">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style={{width:'30px'}} viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </section>
                            <div className="content-btn-decuento-verificar">
                                <button className='button-form-venta' 
                                    onClick={() => onSubmit({
                                        nombreCliente: form.nombreCliente,
                                        idCliente: form.idCliente,
                                        pagoCliente: form.pagoCliente,
                                        cambioCliente: form.cambioCliente,
                                        precioTotal: sumaTotal,
                                    })}
                                >Verificar</button>
                                {/* <button  className='btn-formVentas-descuento' > Descuento</button> */}
                                <div className='sizedBoxBlank'></div>
                            </div>
                            
                        </div>
                        <div className="contend-right">
                            <div className='contend-input-venta'>
                                <input
                                    type='number'
                                    onWheel={(e) => e.target.blur()}
                                    name='pagoCliente'
                                    onChange={handleChange}
                                    value={form.pagoCliente}
                                    className='input-venta pago-cliente'
                                    autoComplete="off"
                                >
                                </input>
                                <label className='venta-label size'>PAGO CLIENTE  <code className='spanError'>{formErro.pagoCliente ? 'Error' : ''}</code></label>
                            </div>
                            <div className='contend-input-data-venta-montos'>
                                <p className='spanError'>{formErro.pagoCliente}</p>
                                <label className='label-detalle'>Cambio: Bs {form.cambioCliente < 0 ? 0 : form.cambioCliente}</label>
                                <label className='label-detalle'>Descuento: Bs {totalDescuento}</label>
                                <label className='label-detalle'>Subtotal: Bs {subtotal}</label>
                                <hr style={{height:'3px', background:'white'}}></hr>
                                <label className='label-detalle'>TOTAL: Bs {sumaTotal}</label>
                            </div>
                        </div>
                    </div>


                </>
            }


            <Modal
                colors={colors}
                isOpen={openModal}
                onClose={modalFunction}
                size='65%'
                title='Registrar Cliente'
            >
                <Form
                    form={formCliente}
                    colors={colors}
                    onClose={modalFunction}
                    submit={inserData}
                    isUpdate={false}
                ></Form>

            </Modal>
        </>
    )




}

export default FormVenta
