import React, { Component } from 'react';
import './Styles/LoginStyle.css';
//routes
import LoginRutes from '../routes/Login';
export class Login extends Component {
    state = {
        form: {
            email: '',
            password: ''
        },
        formErr: {
            email: '',
            password: ''
        },
        msg: ''
    }
    onChange = (e) => {
        const { value, name } = e.target;
        this.setState({
            form: {
                ...this.state.form,
                [name]: value
            }
        })
    }
    submit = async () => {
        let erro = false;
        for (const data in this.state.form) {
            if (!this.state.form[data]) {
                erro = true;
            }
        }
        if (erro) {
            this.messages('Todos los campos son obligatorios')
            return;
        }
        const data = await LoginRutes.sigIn(this.state.form);
        console.log(data, ' esto es dede login')
        if (data.error) {
            this.messages('No se pudo conectar con la base de datos');
            return;
        }
        if (data.resp.status === 'ok') {
            const parsed = JSON.stringify({
                user: data.resp.result,
                t: data.resp.token
            });
            localStorage.setItem('tokTC', parsed);
            this.props.verifiToken();
            return;
        }
        if (data.resp.status === 'No fount') {
            this.messages(data.resp.message)
        }

    }
    messages = (msg) => {
        this.setState({
            msg
        })
        setTimeout(() => {
            this.setState({
                msg: ''
            })
        }, 5000)
    }
    render() {
        return (
            <>
                <div className={this.state.msg?'login-msg active':'login-msg'}>
                    <label className={this.state.msg?'msg active-msg':'msg'}>{this.state.msg}</label>
                </div>
                <div className="login-box">
                    <h2 className='login-title'>Acceder</h2>                  
                    <div className="user-box">
                        <input 
                        autoComplete='off'
                        name='email'
                        onChange={this.onChange}
                        value={this.state.form.email}
                        className='login-input' type="text" required={true}/>
                        <label className='login-label'>Email </label>
                    </div>
                    <div className="user-box">
                        <input 
                        name='password'
                        onChange={this.onChange}
                        value={this.state.form.password}
                        className='login-input' type="password" required={true} />
                        <label className='login-label'>Contraseña</label>
                    </div>
                    <div onClick={this.submit} className='button-login'>
                        <span className='button-border-decoration' />
                        <span className='button-border-decoration' />
                        <span className='button-border-decoration' />
                        <span className='button-border-decoration' />
                        Iniciar sesión
                    </div>   
                                   
                </div>                            
            </>
        )
    }
}
export default Login
