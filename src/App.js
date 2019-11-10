  
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import loadingGif from './loading.gif'
import ListItem from './Listitem';
import Axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    };

    this.apiUrl = 'https://5dc85908672b6e001426b548.mockapi.io'
    this.addTodo = this.addTodo.bind(this);
    this.alert = this.alert.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
  }

 async addTodo() {

  const response = await Axios.post(`${this.apiUrl}/todos`, {
    name: this.state.newTodo
  })

  console.log(response);
  

  const todos = this.state.todos;
  todos.push(response.data);

  this.setState({ todos : todos, newTodo: ''})

    if(response.status === 201)
    this.alert('To-Do Added Successfully');
  }

  editTodo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  }

 async updateTodo() {

    const todo = this.state.todos[this.state.editingIndex];

    const response = await Axios.put(`${this.apiUrl}/todos/${todo.id}`,{

      name: this.state.newTodo
    })

    todo.name = this.state.newTodo;

    const todos = this.state.todos;
    todos[this.state.editingIndex] = todo;
    this.setState({todos, editing: false, editingIndex: null})
    
    if(response.status === 200)
    this.alert('To-Do Updated Successfully');

  }

 async deleteTodo(index) {

  

    const todos = this.state.todos;
    const todo = todos[index]
    delete todos[index];

    this.setState({ todos });

    const response = await Axios.delete(`${this.apiUrl}/todos/${todo.id}`);

    console.log(response);
    

    if(response.status === 200)
    this.alert('To-Do Deleted Successfully');
  }

  alert(notification) {

    this.setState({ notification: notification })

    setTimeout(() => {
      this.setState({ notification: null})
    }, 2000);
  }


 async componentDidMount() {
   
  const  response = await Axios.get(`${this.apiUrl}/todos`);

  setTimeout(() => {
    this.setState({todos: response.data, loading: false});
  }, 1000);

  
  
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CRUD React</h1>
        </header>
        <div className="container">
          {
            this.state.notification && 

          <div className="alert mt-3 alert-success">

            <p className="text-center">{this.state.notification}</p>
          </div>
        }
          <input
            type="text"
            name="todo"
            className="my-4 form-control"
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newTodo}
          />
          <button
            onClick={this.state.editing ? this.updateTodo : this.addTodo}
            className="btn-success mb-3 form-control" disabled= {this.state.newTodo.length < 5}>
            {this.state.editing ? 'Update todo' : 'Add todo'}
            
          </button>
          {
            this.state.loading &&
            <img src={loadingGif} ></img>
          }
          {
            (!this.state.editing || this.state.loading) &&
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return <ListItem 
                
                item = {item}
                editTodo = {()=> {this.editTodo(index)}}
                deleteTodo = {()=> {this.deleteTodo(index)}}
                />
              })}
            </ul>
          }
        </div>
      </div>
    );
  }
}

export default App;

