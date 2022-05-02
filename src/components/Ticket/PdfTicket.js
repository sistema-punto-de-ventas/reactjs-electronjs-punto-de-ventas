import React from 'react'
import { Page, Text, View, Document, } from '@react-pdf/renderer'

function PdfTicket({ data }) {
    return (
        <Document>
            <Page size='A4'>
                <View >
                    <Text >{data.nomNegocio}</Text>
                    <View >
                        <Text>Direccion: {data.direccion}</Text>
                        <Text>{data.paisCiudad}</Text>
                    </View>
                    <Text>--------------------------------------------------</Text>

                    <View >
                        <Text>Fecha: {data.fechaRegistroCompra}</Text>
                        <Text>{data.nombreCliente}</Text>
                        
                        {/* <table className='ticket-table'>
                            <thead>
                                <tr>
                                    <th>CANT-</th>
                                    <th>Nombre-</th>
                                    <th>Descripcion-</th>
                                    <th>UNIT-</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.productos.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{data.unidadesVendidos}</td>
                                            <td>{data.nombre}</td>
                                            <td>{data.description}</td>
                                            <td>{data.precio}</td>
                                            <td>{data.total}</td>
                                        </tr>
                                    );
                                })}


                            </tbody>
                        </table> */}
                        
                        <Text>Total: {data.total}Bs</Text>
                        <Text>Efectivi: {data.efectivo}Bs</Text>
                        <Text>Cambio: {data.cambio}Bs</Text>
                    </View>

                    <Text>--------------------------------------------------</Text>
                    <View >
                        <Text>Usuario: {data.usuario}</Text>
                        gracias por su compra
                    </View>

                </View>
            </Page>
        </Document>

    )
}

export default PdfTicket;