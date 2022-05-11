import React from "react";
import Estadisticas from "../components/Estadisticas/Estadisticas";
class Home extends React.Component{
    state={
        isPermitRoute:null,
    }
       
    async componentDidMount() {
        this.props.verifyToken();
        if(await this.props.permissions([{ name: 'admin' }])){           
            this.setState({
                isPermitRoute:true
            })
        }else{            
            this.setState({
                isPermitRoute:false
            })
        }
    }
    render(){
        if(this.state.isPermitRoute===false){
            return (
                <>
                    <h1>No tienes permiso para entrar en esta ruta</h1>
                </>
            );
        }
        return(
            <>
              <Estadisticas></Estadisticas>
               
            </>
        );
    }
}

export default Home;