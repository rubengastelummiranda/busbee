import {Link} from 'mouter-router'
export default function Form(){
    return (
        <section>
            <Link to="/trola">Por que no te vas a la trola</Link>
        <label>
        Usuario
        <input type="text" placeholder='PablitoElGrande'/>
        
        </label> 
        <label>
        Ingresa tu Contraseña
        <input type="password" placeholder='Prinplup347'/>
        
        </label>
      <button>Aceptar</button>
        </section>
    )
}