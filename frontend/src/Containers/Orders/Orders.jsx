import React, { useEffect, useState } from "react";
import axios from 'axios';
import './Orders.scss';

import actualizar from '../../img/actualizar.png';
import borrar from '../../img/borrar.png';

const Orders = () =>{

    //HOOK PARA GUARDAR ORDERS DE BASE DE DATOS
    const [orders, setOrders] = useState([]);
    
    //HOOK PARA GUARDAR ORDERS PAGINADOS
    const [pagina, setPagina] = useState([]);
    
    //HOOK PARA GUARDAR POSICION DE ARRAY DE TODOS LOS ORDERS
    const [posicion, setPosicion] = useState(0);
    
    //HOOK PARA SABER SI SE ESTÁ EDITANDO UN REGISTRO
    const [editando, setEditando] = useState(false);
    
    //HOOK PARA SABER SI SE ESTÁ EDITANDO UN REGISTRO
    const [creando, setCreando] = useState(false);

    //HOOK PARA GUARDAR EL REGISTRO QUE SE ESTÁ EDITANDO
    const [registro, setRegistro] = useState({});
    
    //HOOK PARA CREAR EL REGISTRO
    const [registroNuevo, setRegistroNuevo] = useState({
        order_id: "",
        country: "",
        ship_date: "",
        company_name: "",
        status:"",
        type:"",
        createdAt:new Date(),
        updatedAt:new Date(),
    });

    //HOOK PARA INDICAR QUE HAY HECHA UNA BUSQUEDA
    const [busqueda, setBusqueda] = useState(false);

    //HOOK PARA INDICAR EL NUMERO DE LA PAGINA EN EL QUE NOS ENCONTRAMOS
    const [numeroPagina, setNumeroPagina] = useState(1);

    useEffect(()=>{
        traerOrders();
    },[])
    
    useEffect(()=>{
        if (orders[0]?.id) {
            paginarOrders(posicion);
        }
    },[orders])
    
    //BUSCAR ORDERS
    const buscarOrders = () =>{
        let orderID = document.getElementById("input-busqueda").value;
        let opcionStatus = document.getElementById("opciones-status").value;
        if (opcionStatus === "All") {
            opcionStatus = "";
        }
        let opcionType = document.getElementById("opciones-type").value;
        if (opcionType === "All") {
            opcionType = "";
        }
        let ordersBuscados = orders.filter(order => order.order_id.includes(orderID) && order.status.includes(opcionStatus) && order.type.includes(opcionType));
        setOrders(ordersBuscados);
        setBusqueda(true);
    }

    //DAR ESTILO A STATUS Y TYPES
    const darEstiloStatus = (status) =>{
        switch (status) {
            case "Pending":
                return 'status-pending';
            case "Danger":
                return 'status-danger';
            case "Info":
                return 'status-info';
            case "Canceled":
                return 'status-info';
            case "Success":
                return 'status-pending';
        
            default:
                break;
        }
    }
    const darEstiloType = (type) =>{
        switch (type) {
            case "Retail":
                return 'type-retail';
            case "Online":
                return 'type-online';
            case "Direct":
                return 'type-direct';
        
            default:
                break;
        }
    }


    //CERRAR RESULTADOS DE BUSQUEDA Y VOLVER A MOSTRAR TODOS LOS ORDERS
    const cerrarBusqueda = () => {
        document.getElementById("input-busqueda").value = "";
        document.getElementById("opciones-status").value = "All"
        document.getElementById("opciones-type").value = "All";
        traerOrders();
        setBusqueda(false);
    }

    //OBTENER TODOS LOS ORDERS
    const traerOrders = async() =>{

        try {

            let res = await axios.get("http://localhost:4000/orders");
            setOrders(res.data);
            
        } catch (error) {
            console.log(error);
        }
    }

    //OBTENER REGISTROS PARA PAGINACION
    const paginarOrders = (posicion) =>{

        let arrayPagina = [];

        for (let i = posicion; i < posicion+10; i++) {
            if (orders[i]) {
                arrayPagina.push(orders[i]);
            }       
        }

        setPagina(arrayPagina);
        setPosicion(posicion);
    }
    
    //MUESTRA PANTALLA PARA ACTUALIZAR REGISTRO DE ORDER
    const abrirActualizacionRegistro = (order) =>{
        setEditando(true);
        setRegistro(order)
    }

    //CIERRO PANTALLA PARA ACTUALIZAR REGISTRO
    const cerrarActualizacionRegistro = () =>{
        setEditando(false);
    }

    //MODIFICO VALORES PARA ACTUALIZAR EL ORDER
    const actualizarValores = (e) =>{
        setRegistro({...registro, [e.target.name]: e.target.value})
    }

    //GUARDO DATOS DE REGISTRO ACTUALIZADO EN BASE DE DATOS
    const actualizarRegistro = async() =>{
        try {

            await axios.put(`http://localhost:4000/orders/actualizarRegistro/${registro.id}`, registro);
            traerOrders();
            cerrarActualizacionRegistro()

        } catch (error) {
            console.log(error);
        }
    }

    //ABRO CUADRO PARA CREAR REGISTRO
    const abrirCreacionOrder = () =>{
        setCreando(true);
    }

    //CIERRO CUADRO PARA CREAR REGISTRO
    const cerrarCreacionOrder = () =>{
        setCreando(false);
    }

    //CREO ORDER NUEVO EN LA BASE DE DATOS
    const crearRegistro = async() =>{
        try {

            await axios.post("http://localhost:4000/orders/nuevoregistro", registroNuevo);
            traerOrders();
            cerrarCreacionOrder();

        } catch (error) {
            console.log(error);
        }
    }

    //MODIFICO VALORES PARA CREAR NUEVO ORDER
    const actualizarValoresNuevo = (e) =>{
        setRegistroNuevo({...registroNuevo, [e.target.name]: e.target.value})
    }

    //BORRAR REGISTRO
    const borrarRegistro = async(id) =>{

        try {
            
            await axios.delete(`http://localhost:4000/orders/eliminiarRegistro/${id}`);
            traerOrders();
            cerrarBusqueda();

        } catch (error) {
            console.log(error);
        }
    }

    //CREAR NUMERO DE PAGINAS
    const crearNumeroPaginas = () =>{
        let arrayDiv = [];
        let paginas = numeroPagina+4;
        let paginaMinima = numeroPagina-1
        if (Math.ceil(orders.length/10) - numeroPagina < 5) {
            paginas = Math.ceil(orders.length/10);
            paginaMinima = Math.ceil(orders.length/10) - 5
        }
        if (Math.ceil(orders.length/10) < 5) {
            paginas = Math.ceil(orders.length/10);
            paginaMinima = 0;
        }
        for (let i = paginaMinima; i < paginas; i++) {
            arrayDiv.push(<div id={`pagina${i+1}`} key={`pagina${i}`}onClick={()=>{paginarOrders(i*10);paginaActual(i+1)}} className={numeroPagina === i+1 ? "numero-pagina pagina-activa" : "numero-pagina"}>{i+1}</div>);
        }
        return arrayDiv;
        
    }

    //INDICO CUAL ES LA PAGINA ACTUAL
    const paginaActual = (id) =>{
        setNumeroPagina(id);
    }

    return(
        <div className="contenedor-orders">
            {editando
            ?
            <div className="actualizacion-order-fondo">
                <div className="actualizacion-order">
                    <h2>EDIT ORDER</h2>
                    <div className="inputs-editables">
                        <label >
                            ORDER ID:
                        <input className="input-actualizar" name="order_id"  type="text" value={registro.order_id} onChange={(e)=>actualizarValores(e)}/>
                        </label>
                        <label>
                            COUNTRY:
                        <input className="input-actualizar" name="country"  type="text" value={registro.country} onChange={(e)=>actualizarValores(e)}/>
                        </label>
                        <label>
                            SHIP DATE:
                        <input className="input-actualizar" name="ship_date"  type="text" value={registro.ship_date} onChange={(e)=>actualizarValores(e)}/>
                        </label>
                        <label>
                            COMPANY NAME:
                        <input className="input-actualizar" name="company_name"  type="text" value={registro.company_name} onChange={(e)=>actualizarValores(e)}/>
                        </label>
                        <label>
                            STATUS:
                        <input className="input-actualizar" name="status"  type="text" value={registro.status} onChange={(e)=>actualizarValores(e)}/>
                        </label>
                        <label>
                            TYPE:
                        <input className="input-actualizar" name="type"  type="text" value={registro.type} onChange={(e)=>actualizarValores(e)}/>
                        </label>
                    </div>
                    <div className="botones-actualizar">
                        <div className="boton" onClick={()=>actualizarRegistro()}>SAVE CHANGES</div>
                        <div className="boton" onClick={()=>cerrarActualizacionRegistro()}>CLOSE</div>
                    </div>
                </div>
            </div>
            :
            null
            }
            {creando
            ?
            <div className="actualizacion-order-fondo">
                <div className="actualizacion-order">
                    <h2>NEW ORDER</h2>
                    <div className="inputs-editables">
                        <label >
                            ORDER ID:
                        <input className="input-actualizar" name="order_id"  type="text" value={registroNuevo.order_id} onChange={(e)=>actualizarValoresNuevo(e)}/>
                        </label>
                        <label>
                            COUNTRY:
                        <input className="input-actualizar" name="country"  type="text" value={registroNuevo.country} onChange={(e)=>actualizarValoresNuevo(e)}/>
                        </label>
                        <label>
                            SHIP DATE:
                        <input className="input-actualizar" name="ship_date"  type="text" value={registroNuevo.ship_date} onChange={(e)=>actualizarValoresNuevo(e)}/>
                        </label>
                        <label>
                            COMPANY NAME:
                        <input className="input-actualizar" name="company_name"  type="text" value={registroNuevo.company_name} onChange={(e)=>actualizarValoresNuevo(e)}/>
                        </label>
                        <label>
                            STATUS:
                        <input className="input-actualizar" name="status"  type="text" value={registroNuevo.status} onChange={(e)=>actualizarValoresNuevo(e)}/>
                        </label>
                        <label>
                            TYPE:
                        <input className="input-actualizar" name="type"  type="text" value={registroNuevo.type} onChange={(e)=>actualizarValoresNuevo(e)}/>
                        </label>
                    </div>
                    <div className="botones-actualizar">
                        <div className="boton" onClick={()=>crearRegistro()}>SAVE NEW ORDER</div>
                        <div className="boton" onClick={()=>cerrarCreacionOrder()}>CLOSE</div>
                    </div>
                </div>
            </div>
            :
            null
            }
            {/* NOMBRES DE LOS CAMPOSº */}
            <header>
                <div>
                    <h2>Local Datasource</h2>
                    <span>Javascript array as data source</span>
                </div>
                <div className="boton" onClick={()=>abrirCreacionOrder()}>
                    New record
                </div>
            </header>
            <div className="contenedor-busquedas">
                <input id="input-busqueda" type="text" placeholder="Search..."/>
                <select id="opciones-status">
                    <option value="All">All</option>
                    <option value="Danger">Danger</option>
                    <option value="Pending">Pending</option>
                    <option value="Info">Info</option>
                    <option value="Canceled">Canceled</option>
                </select>
                <select id="opciones-type">
                    <option value="All">All</option>
                    <option value="Retail">Retail</option>
                    <option value="Online">Online</option>
                    <option value="Direct">Direct</option>
                </select>
                <div className="boton-busqueda" onClick={()=>buscarOrders()}>SEARCH</div>
                {busqueda
                ?
                <div className="boton-busqueda" onClick={()=>cerrarBusqueda()}>CLOSE SEARCH</div>
                :
                null
                }
            </div>
            <div className="nombres-campos">
                <ul>
                    <li>ORDER ID</li>
                    <li>COUNTRY</li>
                    <li>SHIP DATE</li>
                    <li>COMPANY NAME</li>
                    <li>STATUS</li>
                    <li>TYPE</li>
                    <li>ACTIONS</li>
                </ul>
            </div>
            {/* LISTADO DE ORDERS PARA MOSTRAR */}
            <div className="listado-completo">
            {pagina.map((order)=>{
                return(
                    <div key={order.id} className="listado-orders">
                        <input name="order_id"  type="text" readOnly value={order.order_id}/>
                        <input name="country"  type="text" readOnly value={order.country}/>
                        <input name="ship_date"  type="text" readOnly value={order.ship_date}/>
                        <input name="company_name"  type="text" readOnly value={order.company_name}/>
                        <div className="campo-order"><span className={darEstiloStatus(order.status)}>{order.status}</span></div>
                        <div className="campo-order"><li className={darEstiloType(order.type)}>{order.type}</li></div>
                        <div className="acciones">
                            <img onClick={()=>abrirActualizacionRegistro(order)} src={actualizar} alt="Lapiz Actualizar" />
                            <img onClick={()=>borrarRegistro(order.id)} src={borrar} alt="Papelera Borrar" />
                        </div>
                    </div>
                )
            })}
            </div>
            <footer>
                <div className="botones-paginacion">
                    <div className={numeroPagina === 1 ? "deshabilitado":null} onClick={()=>{paginarOrders(0);paginaActual(1)}}>{"<<"}</div>
                    <div className={numeroPagina === 1 ? "deshabilitado":null} onClick={()=>{paginarOrders(posicion-10);paginaActual(numeroPagina-1)}}>{"<"}</div>
                    {crearNumeroPaginas()}
                    <div className={numeroPagina === Math.ceil(orders.length/10) ? "deshabilitado":null} onClick={()=>{paginarOrders(posicion+10);paginaActual(numeroPagina+1)}}>{">"}</div>
                    <div className={numeroPagina === Math.ceil(orders.length/10) ? "deshabilitado":null} onClick={()=>{paginarOrders((Math.ceil(orders.length/10)-1)*10);paginaActual(Math.ceil(orders.length/10))}}>{">>"}</div>
                </div>
                <div className="informacion-paginacion">
                    Showing {posicion+1} - {numeroPagina===Math.ceil(orders.length/10)?orders.length:posicion+10} of {orders.length}
                </div>
            </footer>
        </div>
    )
}

export default Orders;