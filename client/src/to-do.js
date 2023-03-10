
import React, { Fragment, useState, useEffect, useRef } from "react";
import "./to_do.css"

function ToDoApp() {

  const [todoName, setTodoName] = useState("");
  const [toDoList, setTodoList] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  //To show date and time on todo App.
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
  }, []);

  //To handle the POST Request to the server when form are submitted.
  const handleSubmit = (event) => {
    /*this app fetch data directly from (Server)database that's why the `event.preventDefault` is commented*/

    //event.preventDefault();
    try {
      fetch('http://localhost:3200/db', {
        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ todo_name: todoName })

      }).then((response) => response.json())
    } catch (err) {
      console.error(err.message);
    }

  }

  // Make a GET request to the server to retrieve the data
  useEffect(() => {
    fetch('http://localhost:3200/db/get')
      .then((response) => response.json())
      .then(data => setTodoList(data.data));
  }, []);


  //Making Delete Request to Server to delete the specific task.
  const handleDelete = (id) => {
    try {

      fetch(`http://localhost:3200/db/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => response.json())

      // update the to-do list state by removing the deleted item
      setTodoList(toDoList.filter(data => data.data !== id))
      window.location.reload();

    } catch (error) {
      console.log(error);
    };

  }

  //To Make focus continue on inputbox after every reload.
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Fragment>
      <div className="body">
        <h1 className="heading">TO-DO List App</h1>
        <h1 className="heading-2"> {currentTime}</h1>
      </div>

      {/* Input Area Code */}
      <div className="todo-body">
        <form onSubmit={handleSubmit}>
          <span className="span-box">Enter The Task</span>
          <input className="input-style" type="text" ref={inputRef} value={todoName}
            onChange={(e) => setTodoName(e.target.value)} required />
          <input className="btn-1" type="submit" value="Add" />
        </form>
      </div>

      {/* Output Area Code */}
      <div>
        <ul className="todoNames">
          {toDoList.map((to_do_list) => {
            return (
              <li className="singleName" key={to_do_list.todo_id}>
                <span style={{ flex: "1" }}>{to_do_list.todo_name}</span>
                <div onClick={() => handleDelete(to_do_list.todo_id)}><i class="fa-regular fa-trash-can"></i></div>
              </li>
            )
          })}
        </ul>
      </div>

    </Fragment>
  )
}
export default ToDoApp;