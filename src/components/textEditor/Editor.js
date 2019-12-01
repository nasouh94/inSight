
import React, { useState } from 'react';
import { EDITOR_JS_TOOLS } from './editor-tools.js';
import React, {useState} from 'react';
import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './editor-tools.js'
import Nav from '../nav/nav';
import "./newText.scss"
import Dante from 'Dante2';
import './newText.scss';

  
const  [ text, setText ] = useState(" ")

  props.setNavButton('back to notes')
  console.log(props)

  return(
    <main>
    <Nav
    note={props.note}
    user={props.user}
    navButton={props.navButton}
    />
    <form className="text-editor" onSubmit={(event) => event.preventDefault() }>
    
    <Dante content={null}  />;
     
      <button className="text-editor-button" onClick={() => console.log("save")}> Save </button>
      <button className="text-editor-button-delete btn-danger" onClick={() => console.log("delete")} >Delete</button>
    </form>
    </main>
  )
}

