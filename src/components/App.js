import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
//css
import './Styles/App.css';
//components
import Header from './Header/Header';
import Layout from './Body/Body';
//vistas
import Home from '../views/Home';
import Mesas from '../views/Mesas';
import Config from '../views/Config';
import MenuProduct from '../views/MenuProduct';
import Usuarios from '../views/Usuarios';
import Ventas from '../views/Ventas';
import Login from '../views/Login';
import StoreRegister from '../views/StoreRegister';
import Clientes from '../views/Clientes';
import Gastos from '../views/Gastos';
import PCategory from '../views/PCategory';
import Galeria from '../views/Galeria/Galeria';
//admin
import Sidevar from './Sidevar/Sidevar';
import ContendSidebar from './Body/BodySidebar/ContendSidebar';
import Reportes from '../views/admin/Reportes';
//vista de solo productos
import OnlyProduct from './viewProduct/OnlyProduct';
//end admin
///pagina no encontrada
//import NotFound from '../views/NotFound';
//lisences
import Lisence from '../routes/VerifiLisence';
//token
import Token from '../routes/Token';
import LoginRutes from '../routes/Login';
//mensajes toast
import iziToast from 'izitoast';
//windows windowDimensions
import getWindowDimensions from './Hooks.js/windowDimensions';
import axios from 'axios';
import Network from '../routes/GetipServer';
import TicketsCall from './TicketsCall/TicketsCall';
import TicketCall from './TicketsCall/TicketsCall';

import socketIoClient  from 'socket.io-client';

class App extends React.Component {


  state = {
    windowDimensions: getWindowDimensions(),
    lisenceState: null,
    RouteOnliAdmin: false,//esto es para activar lo del administrador
    sidebarAdmin: true, //'esto es del sidevar admin'
    inactive: false,
    showMenu:true,
    color: {
      colorGlobal: '#FFFFFF',
      colorHeader: {
        contendNavigation: '#1D2D44',
        colorText: '#3d3d3d'
      },
      windowHeight: window.innerHeight
    },
    isLoged: false,
    userR: [],
    isBDnull: false,

    vistaProduct:false, //variable que si esta es true muestra la vista de solo productos

  }
  //

  getIpServer=async()=>{
    const ip =await Network.getIpServer();
  }

  handleResize = () => {
    this.setState({
      windowDimensions: getWindowDimensions(),
      windowHeight: this.state.windowDimensions.height,
    })
  }
  componentDidMount() {
    this.verifyLisence();//cada ves que se renderiza tiene que verificar esta funcion
    this.getRolesUser();
    this.onliAdmin('');
    this.handleResize();//tamanio de heigth dinamico
    this.verifyUserLength(); // verificamos si la bd esta vacio
    this.getIpServer();

    socketIoClient('http://127.0.0.0:4000');
  }
  showSidebarAdmin = () => {
    this.setState({
      sidebarAdmin: !this.state.sidebarAdmin
    })
  }
  //cambia el estado de la varible routeOnliAdmin
  onliAdmin = async (controller) => {
    const admTc = await localStorage.getItem('adTC');
    if (controller === 'configAdmin') {
      this.setState({
        RouteOnliAdmin: true
      })
      localStorage.setItem('adTC', 'tcAdm');
      return;
    }
    if (controller === 'user') {
      this.setState({
        RouteOnliAdmin: false
      })
      localStorage.setItem('adTC', 'tcUs');
      return;
    }
    this.setState({
      RouteOnliAdmin: admTc === 'tcAdm' ? true : false
    })

  }

  handleMenuOption=()=>{
    console.log(this.state.showMenu)
    this.setState({
      showMenu:!this.state.showMenu
  })

  }

  getRolesUser = async () => {
    //se llama cada ves que se entra a una ruta 
    //optimizar esto ya que se llama varias veces cada que se llama a una ruta
    const token = await JSON.parse(localStorage.getItem('tokTC'));
    if (!token) return;
    const resp = await LoginRutes.userListRole(token.user.id);
    if (resp.error) {
      this.msgToast({
        msg: 'No hay coneccion con la base de datos',
        time: 10000,
        tipe: 'warning',
        title: 'Error 400'
      });
      return;
    }
    if (resp.resp.status === 'No fount') {
      this.msgToast({
        msg: resp.resp.message,
        time: 10000,
        tipe: 'warning',
        title: 'Error'
      });
      return;
    }
    if (resp.resp.status === 'ok') {
      this.setState({
        userR: resp.resp.result
      });
    }
  }
  //verificaar la licencia
  verifyLisence = async () => {
    const resp = await Lisence.getLisence();
    if (resp.error) {
      this.msgToast({
        msg: 'No se pudo verificar la licencia',
        tipe: 'warning',
        title: 'Error 400'
      });
      return;
    }
    if (resp.lisence) {
      this.setState({
        lisenceState: true
      });
      this.verifiToken();
      return;
    }
    this.setState({
      lisenceState: false
    })
  }
  // esta funcion es llamda cuando la licencia es vigente
  //verifica si el token esta y tambien si el token a expirado
  // verifica tambien si el usuario esta activo o esta inactivo
  verifiToken = async () => {
    const token = await Token.getToken();
    if (token.error) {
      this.msgToast({
        msg: 'No hay coneccion con la base de datos o usuario incorrecto',
        time: 10000,
        tipe: 'warning',
        title: 'Error 400'
      });
      this.singOut();
      return;
    }
    if (token.token) {
      if (token.state) {
        this.setState({
          isLoged: true
        })
        return;
      }
      this.msgToast({
        msg: 'Consulte con el administrador o jefe del negocio',
        time: 10000,
        tipe: 'warning',
        title: 'Usuario inactivo'
      })
      this.setState({
        isLoged: false
      })
      this.singOut();
      return;
    }
  } 
  //esta funcion quita del local storage para deslogearse
  singOut = () => {
    localStorage.removeItem('tokTC');
    localStorage.removeItem('adTC');
    /* window.location.href = Url.urlFrontEnd + "/login"; */
    this.setState({
      isLoged: false,
      RouteOnliAdmin: false
    })
  }
  msgToast = ({ msg, time = 5000, tipe = 'green', title = 'no estas mandando el title', position = 'topCenter' }) => {
    let colorToast = '';
    if (tipe === 'success') colorToast = 'green';
    if (tipe === 'warning') colorToast = '#A30000';
    if (tipe === 'info') colorToast = '#B96913';
    if (tipe === 'warningTransparent') colorToast = '#a30000bb';
    /* '#A30000' ---> color rojo */
    iziToast.show({
      timeout: time,
      icon: 'bi bi-slash-circle-fill',
      iconColor: '#D8DBE2',
      title,
      titleColor: '#D8DBE2',
      message: msg,
      messageColor: '#D8DBE2',
      backgroundColor: colorToast,
      position
    });
  }
  //esta funcion devuelve true o falso para los permisos de cada ruta 
  //esta funcin se llama en todas las vistas que necesitan ser validados
  permissions = async (arrRole) => {
    await this.getRolesUser(); //optimizar esta parte
    let ispermit = false;
    //verificando los roles del usuario
    for (let i = 0; i < this.state.userR.length; i++) {
      for (let j = 0; j < arrRole.length; j++) {
        if (this.state.userR[i].name === arrRole[j].name) {
          ispermit = true
        }
      }
    }
    return ispermit;
  }
  //funcion que muestra que botones del menu dinamico son permitidos
  //los que no son permitidos estos no se muestran
  menuButtonsPermit = async (arrMenuButtons) => {
    await this.getRolesUser();//optimizar esta parte
    let arr = await [];
    for (var x = 0; x < arrMenuButtons.length; x++) {
      for (let i = 0; i < this.state.userR.length; i++) {
        for (let j = 0; j < arrMenuButtons[x].rolePermit.length; j++) {
          if (arrMenuButtons[x].rolePermit[j].name === this.state.userR[i].name) {
            arr.push(arrMenuButtons[x]);
          }
        }
      }
    }
    // quita los los repetidos del arr
    let obj = {}
    for (let d = 0; d < arr.length; d++) {
      let buttonD = obj[arr[d].button];
      if (!buttonD) {
        buttonD = obj[arr[d].button] = arr[d];
      }
    }
    let newArr = [];
    for (const id in obj) {
      newArr.push(obj[id]);
    }
    /* for (let b = 0; b < arr.length; b++) {
      if (arr[b + 1]) {
        if (arr[b].button === arr[b + 1].button) {
          arr.splice(b, 1)
        }
      }
    } */
    //console.log(esto)
    /* 
    let p = 0, button = '', cantidad = 0;
    for (let a = 0; a < arr.length; a++) {
      button = arr[p].button
      if (arr[a].button === button) {
        cantidad++;
        if (cantidad > 1) {
          arr.splice(a, 1)
        }
        if (a === arr.length - 1) {
          p++;
          a = 0
          if (p === arr.length - 1) {
            a = arr.length + 1
          }
        }
      }
    } */

    //console.log(arr, ' esto es ================================================================= 1111')
    //console.log(arr2, ' esto es ================================================================= 222')

    return newArr;
  }

  //verficamos si hay usuarios registrados
  verifyUserLength = async () => {
    const resp = await LoginRutes.userLength();
    if (resp.error) {
      this.msgToast({
        msg: 'No hay coneccion con la base de datos',
        time: 10000,
        tipe: 'warning',
        title: 'Error 400'
      });
      return;
    }
    if (resp.resp.status === 'No fount') {
      this.msgToast({
        msg: resp.resp.message,
        time: 10000,
        tipe: 'warning',
        title: 'Error'
      });
      return;
    }
    if (resp.resp.status === 'ok') {
      this.setState({
        isBDnull: resp.resp.userLength === 0 ? true : false
      });
    }
  }

  setVistaProductos = () =>{
    this.setState({
      vistaProduct:!this.state.vistaProduct
    })
  }
  render() {
    if (this.state.vistaProduct) {
      return (
        <OnlyProduct msgToast={this.msgToast} />
      );
    }
    if (this.state.RouteOnliAdmin) {
      return (
        <div className='contend-g' style={
          {
            // height: this.state.windowDimensions.height,
            /* backgroundColor: 'red' */
          }
        }>

          <HashRouter>
            <Sidevar
              singOut={this.singOut}
              onliAdmin={this.onliAdmin}
              color={this.state.color}
              showSidebarAdmin={this.showSidebarAdmin}
              sidebar={this.state.sidebarAdmin}
            />
            <ContendSidebar color={this.state.color} sidebar={this.state.sidebarAdmin}>
              <Routes>
                <Route path='/' element={<Home permissions={this.permissions} verifyToken={this.verifiToken} color={this.state.color} />}></Route>
                <Route
                  path='/mesas'
                  element={
                    <Mesas
                      RouteOnliAdmin={this.state.RouteOnliAdmin}
                      permissions={this.permissions}
                      msgToast={this.msgToast}
                      verifyToken={this.verifiToken}
                      color={this.state.color} />}>

                </Route>
                <Route path='/usuarios' element={
                  <Usuarios
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    menuButtonsPermit={this.menuButtonsPermit}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color}
                  />}>

                </Route>
                <Route path='/config' element={<Config permissions={this.permissions} verifyToken={this.verifiToken} color={this.state.color} />}></Route>
                <Route path='/ventas' element={
                  <Ventas
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color}
                    menuButtonsPermit={this.menuButtonsPermit}
                  />
                }></Route>
                <Route path='/menu' element={
                  <MenuProduct
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    menuButtonsPermit={this.menuButtonsPermit}
                    msgToast={this.msgToast}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color} />}>

                </Route>
                <Route path='/reportes' element={<Reportes />}></Route>
                <Route path='/clientes' element={
                  <Clientes
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    menuButtonsPermit={this.menuButtonsPermit}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color}
                    msgToast={this.msgToast}
                  ></Clientes>
                }></Route>
                <Route path='/gastos' element={
                  <Gastos
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    menuButtonsPermit={this.menuButtonsPermit}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color}
                    msgToast={this.msgToast}
                  ></Gastos>
                }></Route>
                <Route path='/galeria' element={
                  <Galeria
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    menuButtonsPermit={this.menuButtonsPermit}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color}
                    msgToast={this.msgToast}
                    setVistaProductos = {this.setVistaProductos}
                  ></Galeria>
                }></Route>

              <Route path='/esdisticas' element={
                  <Galeria
                    RouteOnliAdmin={this.state.RouteOnliAdmin}
                    menuButtonsPermit={this.menuButtonsPermit}
                    permissions={this.permissions}
                    verifyToken={this.verifiToken}
                    color={this.state.color}
                    msgToast={this.msgToast}
                    setVistaProductos = {this.setVistaProductos}
                  ></Galeria>
                }></Route>

              </Routes>
            </ContendSidebar>
          </HashRouter>
        </div>
      );
    }
    if (this.state.lisenceState === false) {
      return (
        <>
          <h1>Licencia caducada</h1>
        </>
      );
    }
    return (
      
      // <div className={this.state.isLoged ? 'contend-g' : 'contend-g loginBackground'} style={
      //   {
      //     height: this.state.windowDimensions.height
      //   }
      // }>

      <div className={this.state.isLoged ? 'contend-g' : 'contend-g loginBackground'}>
   
        <HashRouter>
          {this.state.isLoged ?
            <>
              <div className='content-head-and-body'>
                <Header showMenu={this.state.showMenu} handleMenuOption={this.handleMenuOption} onliAdmin={this.onliAdmin} msgToast={this.msgToast} singOut={this.singOut} colorHeader={this.state.color.colorHeader} />
                
                <Layout showMenu={this.state.showMenu} color={this.state.color} isLoged={this.state.isLoged}>
                  <Routes>
                  <Route path='/' element={<Home permissions={this.permissions} verifyToken={this.verifiToken} color={this.state.color} />}></Route>
                    <Route path='/estadisticas' element={<Home permissions={this.permissions} verifyToken={this.verifiToken} color={this.state.color} />}></Route>
                    <Route
                      path='/mesas'
                      element={
                        <Mesas
                          permissions={this.permissions}
                          msgToast={this.msgToast}
                          verifyToken={this.verifiToken}
                          color={this.state.color} />}>
                    </Route>
                    <Route path='/usuarios' element={
                      <Usuarios
                        menuButtonsPermit={this.menuButtonsPermit}
                        permissions={this.permissions}
                        verifyToken={this.verifiToken}
                        color={this.state.color}
                        msgToast={this.msgToast}
                      />}>

                    </Route>
                    <Route path='/config' element={<Config permissions={this.permissions} verifyToken={this.verifiToken} color={this.state.color} />}></Route>
                    <Route path='/ventas' element={
                      <Ventas
                        menuButtonsPermit={this.menuButtonsPermit}
                        permissions={this.permissions}
                        verifyToken={this.verifiToken}
                        color={this.state.color}
                        msgToast={this.msgToast}
                      />
                    }>
                    </Route>
                    <Route path='/menu' element={
                      <MenuProduct
                        menuButtonsPermit={this.menuButtonsPermit}
                        msgToast={this.msgToast}
                        permissions={this.permissions} verifyToken={this.verifiToken} color={this.state.color} />}></Route>
                    {/* <Route element={NotFound} /> */}
                    <Route path='/clientes' element={
                      <Clientes
                        menuButtonsPermit={this.menuButtonsPermit}
                        permissions={this.permissions}
                        verifyToken={this.verifiToken}
                        color={this.state.color}
                        msgToast={this.msgToast}
                      ></Clientes>
                    }></Route>
                    <Route path='/gastos' element={
                      <Gastos
                        menuButtonsPermit={this.menuButtonsPermit}
                        permissions={this.permissions}
                        verifyToken={this.verifiToken}
                        color={this.state.color}
                        msgToast={this.msgToast}
                      ></Gastos>
                    }></Route>

                    <Route path='/PCategoria' element={
                      <PCategory
                        menuButtonsPermit={this.menuButtonsPermit}
                        permissions={this.permissions}
                        verifyToken={this.verifiToken}
                        color={this.state.color}
                        msgToast={this.msgToast}
                      ></PCategory>
                    }></Route>

                    <Route path='/galeria' element={
                      <Galeria
                        menuButtonsPermit={this.menuButtonsPermit}
                        permissions={this.permissions}
                        verifyToken={this.verifiToken}
                        color={this.state.color}
                        msgToast={this.msgToast}
                        setVistaProductos = {this.setVistaProductos}
                      ></Galeria>
                    }></Route>

                

                  </Routes>
                </Layout>
                </div>


              </>
              : this.state.isBDnull ?

                <StoreRegister
                  msgToast={this.msgToast}
                  verifiToken={this.verifiToken} color={this.state.color}
                  verifyUserLength={this.verifyUserLength}
                />
                :
                <Login verifiToken={this.verifiToken} color={this.state.color} />

            }
            
          </HashRouter>
      </div>

    );
  }
}

export default App;
