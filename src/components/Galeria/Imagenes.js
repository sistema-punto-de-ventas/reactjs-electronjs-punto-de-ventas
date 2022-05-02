import React, { useState, useEffect, useCallback } from 'react'
import Modal from '../../components/Modal';
import Form from "../../components/Form";
import GaleriaRoutes from '../../routes/GaleriaRoutes';
import { Url } from '../../routes/Url';
import './styleGaleria.css'

const formIMG = [
    { disable: false, error: '', isRequired: true, focus: '', name: 'name', label: 'Nombre', value: '', tipe: 'text' },
    { disable: false, error: '', isRequired: true, focus: '', name: 'price', label: 'Precio', value: '', tipe: 'number' },
    { disable: false, error: '', isRequired: false, focus: '', name: 'description', label: 'Descripcion', value: '', tipe: 'textarea' },
    {
        disable: false, error: '', isRequired: true, focus: '', name: 'type', label: 'Tipo de archivo', value: '', tipe: 'select', options: [
            { name: 'Imagen', value: 'img' },
            { name: 'Video', value: 'video' },
        ]
    },
    { error: '', isRequired: true, focus: '', name: 'image', label: 'Seleccion una imagen', value: '', tipe: 'file' },
]
function Imagenes({ RouteOnliAdmin, colors, msgToast, setVistaProductos }) {
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [formIMGUpdate, setFormIMGUpdate] = useState(formIMG);
    const [idGalery, setIdGalery] = useState('');
    const [listIMG, setListIMG] = useState([]);

    const openModalRegister = () => {
        var array = formIMG
        for (let i = 0; i < array.length; i++) {
            array[i].value = '';
            array[i].focus = '';
        }
        setModal(!modal)
    }

    const onSubmit = async (data) => {
        if (!data.image) {
            msgToast({
                msg: 'Seleccione una imagen o video por favor',
                tipe: 'warning',
                title: 'Error'
            });
            return;
        }
        const newData = new FormData();
        newData.append('name', data.name);
        newData.append('price', data.price);
        newData.append('description', data.description);
        newData.append('type', data.type);
        newData.append('img', data.image);

        const resp = await GaleriaRoutes.create(newData);
        if (resp.error) {
            let err = resp.err;
            msgToast({
                msg: err ? err?.message : 'No hay coneccion con la Base de datos',
                tipe: 'warning',
                title: err ? `Error ${err?.status}` : 'Error 500'
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
            setModal(!modal);
            getList();
        }
    }

    const getList = useCallback(async () => {
        const resp = await GaleriaRoutes.list();
        if (resp.error) {
            let err = resp.err;
            msgToast({
                msg: err ? err?.message : 'No hay coneccion con la Base de datos',
                tipe: 'warning',
                title: err ? `Error ${err?.status}` : 'Error 500'
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
            setListIMG(resp.resp.result)
        }

    }, [msgToast])
    useEffect(() => {
        getList();
    }, [getList]);
    const onSubmitUpdate = async (data) => {
        console.log(data);
        const newData = new FormData();
        newData.append('name', data.name);
        newData.append('price', data.price);
        newData.append('description', data.description);
        newData.append('type', data.type);
        newData.append('img', data.image);

        const resp = await GaleriaRoutes.update(newData, idGalery);
        if (resp.error) {
            let err = resp.err;
            msgToast({
                msg: err ? err?.message : 'No hay coneccion con la Base de datos',
                tipe: 'warning',
                title: err ? `Error ${err?.status}` : 'Error 500'
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
            setModal1(!modal1);
            getList();
        }
    }
    //detalles
    const detallesForm = (data) => {
        setModal1(!modal1)
        let arr = formIMGUpdate;
        for (let i = 0; i < arr.length; i++) {
            for (const name in data) {
                if (name === arr[i].name) {
                    arr[i].value = data[name];
                    arr[i].focus = 'active';
                }
            }
        }
        setIdGalery(data._id)
        setFormIMGUpdate(arr)
    }
    //eliminar la imagen
    const deleteIMG = async (idGalery) => {
        const resp = await GaleriaRoutes.deleteIMG(idGalery);
        console.log(resp, ' esto es')
        if (resp.error) {
            let err = resp.err;
            msgToast({
                msg: err ? err?.message : 'No hay coneccion con la Base de datos',
                tipe: 'warning',
                title: err ? `Error ${err?.status}` : 'Error 500'
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
            getList();
        }
    }
    return (
        <>
            <div className="contend-gastos">
                <div className="conted-left">
                    <h2>Imagenes</h2>
                </div>
                <div className="conted-right">
                    <button
                        onClick={openModalRegister}
                        className='button-table'>
                        Nueva imagen
                    </button>
                    {listIMG.length > 0 &&
                        <button
                            onClick={setVistaProductos}
                            className='button-table'>
                            Mostrar
                        </button>
                    }

                </div>
                <div className={RouteOnliAdmin ? "contend-table-gastos heightAdmin" : "contend-table-gastos"}>
                    <div className="contend-table tableOutModal">

                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-headers">
                                    <th className="header" scope="col">N°</th>
                                    <th className="header" scope="col">Imagen</th>
                                    <th className="header" scope="col">Nombre</th>
                                    <th className="header" scope="col">Precio</th>
                                    <th className="header" scope="col">Descripcion</th>
                                    <th className="header" scope="col">Opciones</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {listIMG.map((data, key) => {
                                    return (
                                        <tr key={key} className="table-row">
                                            <td className="row-cell">{key + 1}</td>
                                            <td className="row-cell">
                                                {data.type === 'img' ?
                                                    <img
                                                        className="tableImagen"
                                                        src={`${Url.urlBackEnd}${data.img}`}
                                                        alt={`imagen${key}`}

                                                    ></img>
                                                    :
                                                    <video
                                                        className="tableImagen"
                                                        id={`video${key}`}
                                                        autoPlay={true} muted
                                                        src={`${Url.urlBackEnd}${data.img}`}
                                                    ></video>
                                                }

                                            </td>
                                            <td className="row-cell">{data.name}</td>
                                            <td className="row-cell">{data.price}</td>
                                            <td className="row-cell">{data.description}</td>


                                            <td className="row-cell">
                                                <button onClick={() => detallesForm(data)} className='tableButton'>Detalles</button>
                                                <button onClick={() => deleteIMG(data._id)} className='tableButton'>Eliminar</button>
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
                colors={colors}
                isOpen={modal}
                onClose={() => setModal(!modal)}
                size='60%'
                title='Guardar Imagen'
            >
                <Form
                    form={formIMG}
                    colors={colors}
                    onClose={() => setModal(!modal)}
                    submit={onSubmit}
                    isUpdate={false}
                ></Form>
            </Modal>

            <Modal
                colors={colors}
                isOpen={modal1}
                onClose={() => setModal1(!modal1)}
                size='60%'
                title='Actualizar imagen'
            >
                <Form
                    form={formIMGUpdate}
                    colors={colors}
                    onClose={() => setModal1(!modal1)}
                    submit={onSubmitUpdate}
                    isUpdate={true}
                ></Form>
            </Modal>

        </>
    )
}

export default Imagenes