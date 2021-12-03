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

    useEffect(()=>{
        traerOrders();
    },[])
    
    useEffect(()=>{
        if (orders[0]?.id) {
            paginarOrders(posicion);            
        }
    },[orders])

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
            arrayPagina.push(orders[i]);            
        }

        setPagina(arrayPagina);
        setPosicion(posicion);
    }

    //ACTUALIZAR REGISTRO
    const actualizarRegistro = async(order) =>{
        inputNoEditable();
        try {
            //TODOS LOS INPUTS DEL REGISTRO QUE QUEREMOS ACTUALIZAR SE VUELVEN EDITABLES
            let inputs = document.getElementsByName(order.order_id);

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = false;
            }

        } catch (error) {
            console.log(error);
        }
    }

    //HACEMOS QUE NINGÚN INPUT QUE MUESTRA INFORMACIÓN DE LOS REGISTROS SEA EDITABLE
    const inputNoEditable = () =>{
        let div = document.getElementsByClassName("listado-orders");
        for (let i = 0; i < div.length; i++) {
            console.log(div[i]);            
        }
    }

    //BORRAR REGISTRO
    const borrarRegistro = async(id) =>{

        try {
            
            await axios.delete(`http://localhost:4000/orders/eliminiarRegistro/${id}`);
            traerOrders();

        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="contenedor-orders">
            {/* NOMBRES DE LOS CAMPOSº */}
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
            {pagina.map((order)=>{
                return(
                    <div key={order.id} className="listado-orders">
                        <input name={order.order_id} type="text" readOnly value={order.order_id}/>
                        <input name={order.order_id} type="text" readOnly value={order.country}/>
                        <input name={order.order_id} type="text" readOnly value={order.ship_date}/>
                        <input name={order.order_id} type="text" readOnly value={order.company_name}/>
                        <input name={order.order_id} type="text" readOnly value={order.status}/>
                        <input name={order.order_id} type="text" readOnly value={order.type}/>
                        <div className="acciones">
                            <img onClick={()=>actualizarRegistro(order)} src={actualizar} alt="Lapiz Actualizar" />
                            <img onClick={()=>borrarRegistro(order.id)} src={borrar} alt="Papelera Borrar" />
                        </div>
                    </div>
                )
            })}
            <div className="botones-paginacion">
                <div onClick={()=>paginarOrders(0)}>{"<<"}</div>
                <div onClick={()=>paginarOrders(posicion-10)}>{"<"}</div>
                <div onClick={()=>paginarOrders(posicion+10)}>{">"}</div>
                <div onClick={()=>paginarOrders(orders.length - 10)}>{">>"}</div>
            </div>
        </div>
    )
}

export default Orders;