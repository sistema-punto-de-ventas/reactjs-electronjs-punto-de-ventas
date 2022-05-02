import React, { Component } from 'react';
//import Menu from '../../components/Menu'
import Imagenes from '../../components/Galeria/Imagenes'

export class Galeria extends Component {
    state = {
        isPermitRoute: null,
        buttonsMenu: [
            { rolePermit: [{ name: 'admin' }], button: 'Imagenes', selected: 'buttonSeleccted' },
            /* { rolePermit: [{ name: 'admin' }], button: 'Álbumes', selected: '' }, */
        ],
        sectionContainer: 0

    }
    async componentDidMount() {
        this.props.verifyToken();
        if (await this.props.permissions([{ name: 'admin' }, { name: 'caja' }])) {
            this.setState({
                isPermitRoute: true
            })
        } else {
            this.setState({
                isPermitRoute: false
            })
        }
    }
    fucntionMenu = (p) => {
        console.log(p, ' esto es lo que quiero ver')
        let arr = this.state.buttonsMenu
        for (let i = 0; i < arr.length; i++) {
            if (i === p) {
                arr[i].selected = 'buttonSeleccted'
            } else {
                arr[i].selected = ''
            }
        }
        this.setState({
            buttonsMenu: arr,
            sectionContainer: p
        })
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
                {/* <Menu
                    colors={this.props.color}
                    buttons={this.state.buttonsMenu}
                    functionsMenu={this.fucntionMenu}
                /> */}
                <Imagenes
                    RouteOnliAdmin={this.props.RouteOnliAdmin}
                    colors={this.props.color}
                    msgToast={this.props.msgToast}
                    setVistaProductos={this.props.setVistaProductos}
                ></Imagenes>
            </>
        )
    }
}

export default Galeria