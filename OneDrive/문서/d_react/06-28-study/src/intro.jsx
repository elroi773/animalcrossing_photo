import React,{useEffect,useState} from "react";

function Intro(){
    const [todos, setTodos] =useState([]);
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/todos?_limit=10") //할 일 중에서 10개를 가지고 오셈
        .then((res) => res.json()) //우리가 쓸 수 있는 이름으로 바꿔주는 과정 
        .then((data) => {
            setTodos(data);
        })
        .catch((error)=>{
            console.error("Error fetching todos:",error);
        });
    },[]) //의존성 배열 빈 배열을 넣게 되면 컴포넌트가 나타날때 한번만 실행 될 수 있게 해주는 애 
    return (
        <ul>
             {todos.map((todo)=>(
                <li key = {todo.id}>
                    {todo.title}-{todo.completed ? "v" : "x"}
                </li>
            ))}
        </ul>
    )
}

export default Intro;