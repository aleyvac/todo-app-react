import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Form(props) {
    const title = props.title;
    const [listTodo, setListTodo] = useState([]);
    const [newElement, setnewElement] = useState({ description: '', active: 1 });


    const storeElement = () => {
        axios.post('http://127.0.0.1:3000/api/v1/todo/', { todo: newElement })
            .then((result) => {         
                setListTodo([...listTodo, result.data.data[0]]);
                setnewElement({ description: '', active: 1 });
            }).catch((err) => {
                if (err.response.status === 402) {
                    alert(err.response.data.msg);
                }else{
                    console.log(err);
                }
            });
    };

    const deletElement = async (id) => {
        await axios.delete(`http://127.0.0.1:3000/api/v1/todo/${id}`)
            .then((result) => {
                console.log();
                if (result.status === 200) {
                    const newList = listTodo.filter( (item) => {
                        return item.id !== id
                    })
                    setListTodo(newList);
                }              
            }).catch((err) => {
                if (err.response.status === 404) {
                    alert(err.response.data.msg);
                }else{
                    console.log(err);
                }
            });
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:3000/api/v1/todo/')
            .then(response => {
                setListTodo(response.data.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);


    return (
        <div className="container">
            <h1 className='text-center mb-4'>{title}</h1>
            <div className="mb-3 row ">
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="inputPassword" placeholder='Escriba el to do list' value={newElement.description}
                        onChange={e => setnewElement({ ...newElement, description: e.target.value })} />
                </div>
                <div className="col-sm-2 d-grid gap-2" role="group" aria-label="Basic mixed styles example">
                    <button type="button" className="btn btn-success float-end" onClick={storeElement} >Guardar</button>
                </div>
            </div>

            {/* <div className="filters my-2">
                <div className="btn-group-sm" role="group" aria-label="Basic outlined example">
                    <button type="button" className="btn btn-success active ">Todos</button>
                    <button type="button" className="btn btn-success btn-sm">Activos</button>
                    <button type="button" className="btn btn-success">Completados</button>
                </div>
            </div> */}
            <ul className="list-group list-group-flush rounded">
                {listTodo.map((item, index) => (
                    <li className="list-group-item" key={index}>
                        <div className='d-flex justify-content-between'>
                            <div className="m-2">
                                <input className="form-check-input m-2" type="checkbox" value="" aria-label="..." />
                                <label className="form-check-label" htmlFor="firstCheckbox"> {item.description}
                                    {/* {item.active ? <span className="badge bg-secondary mx-2">Activo</span> : <span className="badge bg-secondary m-2">Desactivado</span>} */}
                                    {item.completed ? <span className="badge bg-primary mx-2">Completado </span> : <span className="badge bg-warning m-2 text-black">Incompleto</span>}
                                </label>
                            </div>
                            <div className="justify-content-end">
                                <button className="btn btn-primary btn-sm m-2" type="button">Editar</button>
                                <button className="btn btn-danger btn-sm  m-2" onClick={() => deletElement(item.id)} type="button">Eliminar</button>
                            </div>
                        </div>
                    </li>
                ))}

            </ul>

        </div>
    );
}

export default Form;