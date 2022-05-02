import React from "react";
import RoutesPrueva from "../routes/pruevas";
class Config extends React.Component {
    state={
        isPermitRoute:null,
        form:{
            nombre:'',
            apellido:'',
            email:'',
            password:''
        }
    }
    handleChange=(e)=>{
       const {value,name} = e.target;
       this.setState({
           form:{
               ...this.state.form,
               [name]:value
           }
       });
    }
    handleSubmit= async (e)=>{
        e.preventDefault();
        try {
            const resp = await RoutesPrueva.postUsers(this.state.form)
            console.log(resp, 'esto es la respuesta desde el api')
        } catch (error) {
            console.log(error)
        }
    }
    getList = async () => {
        console.log('click')
        try {
            const resp = await RoutesPrueva.listUser();
            console.log(resp);
        } catch (error) {
            console.log(error)
        }
    }
    async componentDidMount() {
        this.props.verifyToken();
        //esta ruta depende de esto para sever si el usuario puede entrar a esta ruta  
        //this.props.permissions([{name:'sdf'},{name:'user'}])      
        if(await this.props.permissions([{name:'admin'}])){           
            this.setState({
                isPermitRoute:true
            })
        }else{            
            this.setState({
                isPermitRoute:false
            })
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
                aqui entra las configuraciones del administrador o duenio de la tienda
                <button onClick={this.getList}> get list</button>
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Nombre</label>
                            <input 
                            name='nombre'
                            onChange={this.handleChange}
                            value={this.state.form.nombre}
                            type="text" className="form-control" placeholder="ingrese su nombre" />
                            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Apellido</label>
                            <input 
                            name='apellido'
                            onChange={this.handleChange}
                            value={this.state.form.apellido}
                            type="text" className="form-control" placeholder="ingrese su apellido" />
                            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input 
                            name='email'
                            onChange={this.handleChange}
                            value={this.state.form.email}
                            type="email" className="form-control" placeholder="Ingrese su email" />
                            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Contrasenia</label>
                            <input 
                            name='password'
                            onChange={this.handleChange}
                            value={this.state.form.password}
                            type="password" className="form-control" placeholder="Contrasenia" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>


            </>
        );
    }
}
export default Config;