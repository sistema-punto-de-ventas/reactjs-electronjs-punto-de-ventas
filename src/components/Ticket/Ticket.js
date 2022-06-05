import React, {useState, useEffect} from 'react'
import VentasRoutes from '../../routes/Ventas';
import './StyleTicket.css'

const Ticket=({ data,registrarVenta }) =>{
    const [dataTicket, setDataTicket] = useState();
    useEffect(async()=>{
     
       var data = await VentasRoutes.getNumeroTicket();
       if(data.resp.status==='ok'){
           setDataTicket(data.resp.result);
       }
   },[])

    const print = () => {
        var objeto = document.getElementById('print');  //obtenemos el objeto a imprimir
        var ventana = window.open('', 'PRINT', 'height=1000,width=1200');  //abrimos una ventana vacía nueva

        ventana.document.write('<html><head><title></title>');
        /*  ventana.document.write('<link rel="stylesheet" href="StyleTicket.css">'); */

        ventana.document.write(`
        <style>
        .ticket-container{
            /* background-color: red; */
            width: 100% !important;
            text-align: center;
        }
        .ticket-container li{
            list-style:none;
        }
        .ticket-container hr{
           
            display: block;
            margin-left: auto;
            margin-right: auto;
            
        }
        .ticket-header{
           
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .ticket-body{    
              
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center
        }
        .ticketTable{    
            width: 100%;    
        }
        .ticket-footer{
           
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: end;
        }
        .data-ticket{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            
        } 
        .divider-tickets{
            color: #fbfdff;
            height: 2px !important;
            
        }
        .ticketTable thead{
            border-bottom: 1px solid #181818;
        }
        

        </style>
        `);

        ventana.document.write('</head><body>');
        ventana.document.write(objeto.innerHTML);
        ventana.document.write('</body></html>');

        ventana.document.close();
        ventana.focus();
        ventana.onload = function () {
            ventana.print();
            ventana.close();
        };
        registrarVenta();

    }
    
    return (
        <>
            <div id='print'>
                <div className='ticket-container' >
                    <h4 className='ticket-title'>{data.nomNegocio}</h4>
                    {/* <h4 className='ticket-title'>Ticket N°: {dataTicket?.numeroTicketActual}</h4> */}
                    <div className='ticket-header'>
                        <li className='ticket-list'>Direccion: {data.direccion}</li>
                        <li className='ticket-list'>{data.paisCiudad}</li>
                    </div>
                    <hr  className='divider-tickets' />

                    <div className='ticket-body'>
                        <div className='data-ticket'>
                            <li className='ticket-list'>Fecha: {data.fechaRegistroCompra.split(' ')[0]}</li>
                            <li className='ticket-list'>Hora: {data.fechaRegistroCompra.split(' ')[1]}</li>
                            <li className='ticket-list'>{data.nombreCliente}</li>
                        </div>
                        <br />
                        <hr className='divider-tickets' />
                        <table className='ticketTable'>
                            <thead>
                                <tr>
                                    <th>Cant.</th>
                                    <th>Nombre</th>
                                    {/* <th>Descrip.</th> */}
                                    <th>P/U.</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                        

                            <tbody>
                                {data.productos.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{data.unidadesVendidos}</td>
                                            <td>{data.nombre}</td>
                                            {/* <td>{data.description}</td> */}
                                            <td>{data.precio}</td>
                                            <td>{data.total}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    {/* <th className="header" scope="col"></th> */}
                                    <th className="header" scope="col">Total: Bs</th>
                                    <th className="header" scope="col">{data.total}</th>

                                </tr>
                                <tr>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    {/* <th className="header" scope="col"></th> */}
                                    <th className="header" scope="col">Efectivo: Bs</th>
                                    <th className="header" scope="col">{data.efectivo}</th>

                                </tr>
                                <tr>
                                    <th className="header" scope="col"></th>
                                    <th className="header" scope="col"></th>
                                    {/* <th className="header" scope="col"></th> */}
                                    <th className="header" scope="col">Cambio: Bs</th>
                                    <th className="header" scope="col">{data.cambio}</th>

                                </tr>
                            </tfoot>
                        </table>
                        <br />
                    </div>

                    <hr className='divider-tickets' />
                    <div className='ticket-footer'>
                        <li className='ticket-list'>Usuario: {data.usuario}</li>
                        gracias por su compra
                    </div>

                </div>
            </div>
        
            <button className='button-ticket' onClick={print}>Realizar venta e imprimir</button>
        </>
    )
}

export default Ticket
