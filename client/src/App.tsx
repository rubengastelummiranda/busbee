
import './App.css'
import Form from './form'
import {Router, Route} from 'mouter-router'
import Message from './message'
export default function  App() {

  return (
    <>
      <h1>cOMO HAY PUTAS TODAS ALA VERGA</h1>
     <Router> 
      
      <Route path="/login" component={Form}/>
      <Route path="/trola" component={Message}/>
     
     
      </Router>

    </>
  )
}

