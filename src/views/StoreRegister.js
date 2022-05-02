import React, { Component } from 'react'
import NegociosRoute from '../routes/Negocio';

const formUserAdmin = {
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phoneNumber: '',
    password: '',
    password1: ''
};
const formNegocio = {
    nombre: '',
    address: '',
    phoneNumber: '',
    /* callingCodes: '', */
    country: '',
    city: '',
    /* description: '',
    category: '',
    subcategory: '', */
};

export class StoreRegister extends Component {

    state = {
        section: 0,
        formUser: formUserAdmin,
        formUserErro: formUserAdmin,
        formNegocio: formNegocio,
        formNegocioErro: formNegocio,


    }
    onChangeFormUserAdmin = async (e) => {
        const { value, name } = e.target;
        this.setState({
            formUser: {
                ...this.state.formUser,
                [name]: value
            },
            formUserErro: {
                ...this.state.formUserErro,
                [name]: value.length === 0 ? 'Obligatorio' : ''
            }
        });
        if (name === 'ci' || name === 'phoneNumber' || name === 'email') {
            const resp = await NegociosRoute.validateDatasUser({ [name]: value })
            if (resp.error === true) {
                this.props.msgToast({
                    msg: 'No hay coneccion con la base de datos',
                    tipe: 'warning',
                    title: 'Error'
                });
                return;
            }
            if (resp.resp.status === 'No fount') {

                this.setState({
                    formUserErro: {
                        ...this.state.formUserErro,
                        [name]: resp.resp.message[name]
                    }
                })
            }
        }

    }
    onChangeFormNegocio = (e) => {
        const { value, name } = e.target;
        this.setState({
            formNegocio: {
                ...this.state.formNegocio,
                [name]: value
            },
            formNegocioErro: {
                ...this.state.formNegocioErro,
                [name]: value.length === 0 ? 'Obligatorio' : ''
            }
        })
    }
    submitDatas = async () => {
        let obj = {}, error = false;
        for (const data in this.state.formNegocio) {
            if (!this.state.formNegocio[data]) {
                obj[data] = `obligatorio`
            }
        }
        for (const data in this.state.formNegocioErro) {
            if (this.state.formNegocioErro[data]) {
                error = true
            }
        }
        if (Object.keys(obj).length) {
            this.props.msgToast({
                msg: 'Todo los campos son requeridos',
                tipe: 'warning',
                title: 'Error'
            })
            this.setState({
                formNegocioErro: obj
            })
            return
        }
        if (error === true) return;
        const resp = await NegociosRoute.createUserAdmin(this.state.formUser);
        if (resp.error) {
            this.props.msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error'
            });
            return
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error al registrar el usuario'
            });
            return
        }
        if (resp.resp.status === 'ok') {
            const data = this.state.formNegocio;
            const datasNegocio = {
                nombre: data.nombre,
                idClient: resp.resp.result._id,
                propietario: `${resp.resp.result.name} ${resp.resp.result.lastName}`,
                address: data.address,
                phoneNumber: data.phoneNumber,
                callingCodes: data.callingCodes,
                country: data.country,
                city: data.city,
                description: data.description,
                category: data.category,
                subcategory: data.subcategory,
            }
            this.registerNegocio(datasNegocio);
        }

    }
    registerNegocio = async(data) => {
        
        const resp = await NegociosRoute.createNegosio(data);
        if (resp.error) {
            this.props.msgToast({
                msg: 'No hay coneccion con la base de datos',
                tipe: 'warning',
                title: 'Error'
            });
            return
        }
        if (resp.resp.status === 'No fount') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'warning',
                title: 'Error'
            });
            return
        }
        if (resp.resp.status === 'ok') {
            this.props.msgToast({
                msg: resp.resp.message,
                tipe: 'success',
                title: 'Genial...'
            });
            this.setState({
                formUser:formUserAdmin,
                formNegocio:formNegocio
            })
            this.changeSection(0);
            this.props.verifyUserLength();
        }
        
    }
    changeSection = (p) => {
     
        if (p === 1) {
            let obj = {}, error = false;
            for (const data in this.state.formUser) {
                if (!this.state.formUser[data]) {
                    obj[data] = `obligatorio`
                }
            }
            for (const data in this.state.formUserErro) {
               
                if (this.state.formUserErro[data]) {
                    error = true
                }
            }
            
            if(this.state.formUser.password !== this.state.formUser.password1){
                obj['password'] = 'Las contraceñas tienes que ser iguales';
                obj['password1'] = 'Las contraceñas tienes que ser iguales';
                error = true;

            }
            if (Object.keys(obj).length) {
               
                this.setState({
                    formUserErro: obj
                })
                return
            }
            if (error === true) {
           
                return
            };
        }
        this.setState({ section: p });
    }
    render() {
        return (
            <>

                {this.state.section === 0 &&
                    <div className="login-box registerTienda">
                        <h2 className='login-title'>Registrar Usuario</h2>
                        <div className="user-box">
                            <input
                                name='name'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.name}
                                className='login-input' type="text" required={true} />
                            <label className='login-label'>Nombre <code>{this.state.formUserErro.name}</code></label>
                        </div>
                        <div className="user-box">
                            <input
                                name='lastName'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.lastName}
                                className='login-input' type="text" required={true} />
                            <label className='login-label'>Apellidos <code>{this.state.formUserErro.lastName}</code></label>
                        </div>
                        <div className="user-box">
                            <input
                                name='ci'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.ci}
                                className='login-input' type="text" required={true} />
                            <label className='login-label'>C.I. <code>{this.state.formUserErro.ci}</code></label>
                        </div>
                        <div className="user-box">
                            <input
                                name='email'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.email}
                                className='login-input' type="text" required={true} />
                            <label className='login-label'>Email <code>{this.state.formUserErro.email}</code></label>
                        </div>
                        <div className="user-box">
                            <input
                                name='phoneNumber'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.phoneNumber}
                                className='login-input' type="text" required={true} />
                            <label className='login-label'>Telefono <code>{this.state.formUserErro.phoneNumber}</code></label>
                        </div>
                        <div className="user-box">
                            <input
                                name='password'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.password}
                                className='login-input' type="password" required={true} />
                            <label className='login-label'>Contraceña <code>{this.state.formUserErro.password}</code></label>
                        </div>
                        <div className="user-box">
                            <input
                                name='password1'
                                onChange={this.onChangeFormUserAdmin}
                                value={this.state.formUser.password1}
                                className='login-input' type="password" required={true} />
                            <label className='login-label'>Repita Contraceña <code>{this.state.formUserErro.password1}</code></label>
                        </div>
                        <div className='button-login' onClick={() => this.changeSection(1)}>
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            Siguiente
                        </div>
                    </div>
                }
                {this.state.section === 1 &&
                    <div className="login-box registerTienda">
                        <h2 className='login-title'>Registrar Tienda</h2>
                        <div className='contend-inputs'>
                            <div className="user-box">
                                <input
                                    name='nombre'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.nombre}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Nombre de la tienda <code>{this.state.formNegocioErro.nombre}</code></label>
                            </div>                         
                            <div className="user-box">
                                <input
                                    name='address'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.address}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Direccion <code>{this.state.formNegocioErro.address}</code></label>
                            </div>
                            <div className="user-box">
                                <input
                                    name='phoneNumber'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.phoneNumber}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Telefono <code>{this.state.formNegocioErro.phoneNumber}</code></label>
                            </div>
                            {/* <div className="user-box">
                                <input
                                    name='callingCodes'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.callingCodes}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Codigo de telefono <code>{this.state.formNegocioErro.callingCodes}</code></label>
                            </div> */}
                            <div className="user-box">
                                <input
                                    name='country'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.country}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Pais <code>{this.state.formNegocioErro.country}</code></label>
                            </div>
                            <div className="user-box">
                                <input
                                    name='city'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.city}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Ciudad <code>{this.state.formNegocioErro.city}</code></label>
                            </div>
                            {/* <div className="user-box">
                                <input
                                    name='description'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.description}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Descripcion <code>{this.state.formNegocioErro.description}</code></label>
                            </div>
                            <div className="user-box">
                                <input
                                    name='category'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.category}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Categoria <code>{this.state.formNegocioErro.category}</code></label>
                            </div>
                            <div className="user-box">
                                <input
                                    name='subcategory'
                                    onChange={this.onChangeFormNegocio}
                                    value={this.state.formNegocio.subcategory}
                                    className='login-input' type="text" required={true} />
                                <label className='login-label'>Sub categoria <code>{this.state.formNegocioErro.subcategory}</code></label>
                            </div> */}
                        </div>
                        <div onClick={() => this.changeSection(0)} className='button-login'>
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            Volver
                        </div>
                        <div onClick={this.submitDatas} className='button-login button-rigth'>
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            <span className='button-border-decoration' />
                            Finalizar
                        </div>
                    </div>
                }


            </>
        )
    }
}

export default StoreRegister
