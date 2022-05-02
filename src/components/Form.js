import React, { useState } from 'react';
import './Styles/FormStyle.css';
import useButtonsRole from './Hooks.js/useButtonsRole';
export default function Form(props) {
    const { form, colors, submit, isUpdate,listPCategorias } = props;    
    const [active, setActive] = useState(form);
    const [buttonRegisterIsPermit] = useButtonsRole(['admin','caja']);
    //const [selectedPollo, setSelectedPollo] = useState(false);
    //funcion relacionada con el label para que este tenga una animacion
    //esta funcion permite cambiar el valor del array active segun su posision
    //con el evento focus del input
    const handleFocus = (data) => {
        const updateState = active.map((datas, keys) => {
            if (keys === data) {
                return {
                    ...datas,
                    focus: 'active'
                }
            };
            return datas;

        })
        setActive(updateState);
    }
    //esta funcion cambia el valor del array active segun su posision cuando ya no esta en foco el input
    const focusOut = (data) => {
        if (active[data].value.length === 0) {
            const updateState = active.map((datas, keys) => {
                if (keys === data) {
                    return {
                        ...datas,
                        focus: ''
                    }
                };
                return datas;
            })
            setActive(updateState);
        }

    }
    //fucnion para los datos de los inputs
    const handleChange = (e) => {
        const { files, value, name } = e.target;
        
        
        // value: name === 'image' ? files[0] : value?.split('~')[1] ? value?.split('~')[0] : value,
        const update = active.map((data) => {
            if (data.name === name) {
                return {
                    ...data,
                    value: name === 'image' ? files[0] : value?.split('~')[1] ? value?.split('~')[0] : value,
                    error: value.length === 0 && data.isRequired ? 'Este campo es obligatorio' : ''
                };
            };
            return data;
        });
        //en esta parte estamos añadiendo opciones dinamicas para el registro del producto 
        //mas concreo en el form que es el active en su posision 3 esta vacio por defecto
        //asi que cuando se cumple esa condicion del if llenamos las opciones de forma dianmica
        if(value?.split('~')[1]){            
            let  arrSubCategori = []
            for(let i = 0; i < listPCategorias.length; i++){
                if(listPCategorias[i].nombre === value?.split('~')[0]){

                    for(let j = 0; j < listPCategorias[i].subcategorias.length; j++){
                        arrSubCategori.push({
                            name:listPCategorias[i].subcategorias[j].nombre,
                            value:listPCategorias[i].subcategorias[j].nombre
                        })
                    }
                    
                }
            }
            let arr = active;            
            arr[3].options = arrSubCategori
            setActive(arr)
        }

        setActive(update);
    }
    const handleSubmit = () => {
        let json = {}, error = false;
        for (var i = 0; i < active.length; i++) {
            json[active[i].name] = active[i].value
            if (active[i].tipe !== 'file') {
                if (active[i].value.length === 0 && active[i].isRequired) {
                    error = true;
                }
            }
        }
        const validation = active.map((data) => {
            if (data.tipe !== 'file') {
                if (data.value.length === 0 && data.isRequired) {
                    return {
                        ...data,
                        error: 'Obligatorio'
                    }
                }
            }
            return data
        });
        setActive(validation);
        if (error) {
            console.log('todos los campos son obligatorios');
        } else {
            submit(json)
           /*  setActive(form); */
        }
    };
    //fucnion para madar los datos y actualizar
    const handleUpdate = () => {
        let json = {}, error = false;
        //console.log(active)
        for (var i = 0; i < active.length; i++) {
            //comvierte el array en objeto para poder enviar los datos a la api
            //tambien verifica si existe el atributo oneUpdate en el array para no agregarlo en el objeto ya que este 
            //tine que ser actulizado de forma individual
            if (!active[i].disable) {
                json[active[i].name] = active[i].value
            }
            //verifica si se esta insertando datos en los inputs si es que es requerido
            if (active[i].tipe !== 'file') {
                if (!active[i].value && active[i].isRequired) {
                    error = true;
                }
            }
        }
        //si los daatos son requeridos entonces da una alerta de que es obligatorio
        const validation = active.map((data) => {
            if (data.tipe !== 'file') {
                if (!data.value && data.isRequired) {
                    return {
                        ...data,
                        error: 'Obligatorio'
                    }
                }
            }
            return data
        });
        setActive(validation);
        if (error) {
            console.log('todos los campos son obligatorios');
        } else {
            submit(json)
            /* setActive(form); */
        }
    }
    //actualizar solo uno
    const oneUpdate = (data, state, position) => {
        if (state) {
            setActive(updateInputFormData(false, position));
            return;
        }
        setActive(updateInputFormData(true, position));

    }    
    //esta funcion actualiza el estado del formulario para actulizar los datos
    //concretemente actuliza en le campo disable para activar y desactivar el input
    const updateInputFormData = (state, position) => {
        const newArrForm = active.map((data, keys) => {
            if (keys === position) {
                return {
                    ...data,
                    disable: state
                }
            }
            return data
        })
        return newArrForm;
    }
    return (
        <div className='containerForm' >
            <div className="wrap">
                {/* <h1>Registro de mesas</h1>
                <h3>I built something similar as an engineer on Identity.com</h3> */}
                {active.map((data, key) => {
                    return (
                        <div key={key}>
                            <label
                                className={`label-form ${data.focus}`}
                                style={{
                                    backgroundColor: colors ? colors.colorGlobal : '#D8DBE2',
                                    color: colors ? colors.colorHeader.colorText : 'red'
                                }}
                            >
                                {data.label} <code>{data.error}</code>
                            </label>
                            {data.oneUpdate &&
                                <i
                                    onClick={() => oneUpdate(data, data.disable, key)}
                                    className={data.disable ? "bi bi-reply-fill icon-form-rigth" : "bi bi-clipboard icon-form-rigth"}
                                ></i>

                            }
                            {data.tipe === 'text' &&
                                <input
                                    style={{
                                        border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    disabled={data.disable}
                                    name={data.name}
                                    onChange={handleChange}
                                    value={data.value}
                                    onFocus={() => handleFocus(key)}
                                    onBlur={() => focusOut(key)}
                                    type="text" className="cool" />
                            }
                            {data.tipe === 'password' &&
                                <input
                                    style={{
                                        border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    disabled={data.disable}
                                    name={data.name}
                                    onChange={handleChange}
                                    value={data.value}
                                    onFocus={() => handleFocus(key)}
                                    onBlur={() => focusOut(key)}
                                    type="password" className="cool" />
                            }
                            {data.tipe === 'number' && 
                                <input
                                    style={{
                                        border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    disabled={data.disable}
                                    name={data.name}
                                    onChange={handleChange}
                                    value={data.value}
                                    onFocus={() => handleFocus(key)}
                                    onBlur={() => focusOut(key)}
                                    type="number" className="cool" />
                            }
                            {data.tipe === 'select' &&
                                <select
                                    style={{
                                        border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    name={data.name}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus(key)}
                                    onBlur={() => focusOut(key)}
                                    className="select-form"
                                >
                                    {isUpdate ?
                                        <>
                                            <option value={data.value}>{data.value}</option>
                                            <option value=''></option>
                                        </>
                                        : <option></option>
                                    }
                                    {data.options.map((option, keys) => {
                                       
                                        if(option.main){
                                            return (
                                                <option key={keys} value={`${option.value}~${option.main}`} >{option.name}</option>
                                            );
                                        }
                                        return (
                                            <option key={keys} value={option.value} >{option.name}</option>
                                        );
                                        

                                    })}
                                </select>
                            }
                            {data.tipe === 'textarea' &&
                                <textarea
                                    style={{
                                        border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                        backgroundColor: colors ? colors.colorGlobal : 'red',
                                        color: colors ? colors.colorHeader.colorText : 'red'

                                    }}
                                    name={data.name}
                                    onChange={handleChange}
                                    value={data.value}
                                    onFocus={() => handleFocus(key)}
                                    onBlur={() => focusOut(key)}
                                    type="text" className="cool" />
                            }
                            {data.tipe === 'file' &&
                                <div>
                                    <label
                                        className={`label-form active`}
                                        style={{
                                            backgroundColor: colors ? colors.colorGlobal : '#D8DBE2',
                                            color: colors ? colors.colorHeader.colorText : 'red'
                                        }}
                                    >
                                        {data.label} <code>{data.error}</code>
                                    </label>
                                    <input
                                        style={{
                                            border: colors ? `1px solid ${colors.colorHeader.colorText}` : '1px solid red',
                                            backgroundColor: colors ? colors.colorGlobal : 'red',
                                            color: colors ? colors.colorHeader.colorText : 'red'

                                        }}
                                        name={data.name}
                                        onChange={handleChange}
                                        /* onFocus={() => handleFocus(key)}
                                        onBlur={() => focusOut(key)} */
                                        type="file" className="cool" />
                                </div>
                            }
                        </div>
                    );
                })}

                {buttonRegisterIsPermit &&
                    <button
                        className='buttonMenu buttonWithe'
                        onClick={isUpdate ? handleUpdate : handleSubmit}
                    >
                        {isUpdate ? 'Actualizar' : 'Registrar'}
                    </button>
                }

                <button className='buttonMenu buttonWarnig' onClick={props.onClose} style={{}}>Cancelar</button>
            </div>
        </div>
    )
}
