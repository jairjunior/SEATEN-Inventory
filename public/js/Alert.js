"use strict";

const template = document.createElement('template');
template.innerHTML = `
     <link rel="stylesheet" href="../css/bootstrap.min.css">
     <div class="alert alert-dismissible fade show mt-5" role="alert">
          <p class="m-0"><slot name="alertText" /></p>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
               <span aria-hidden="true">&times;</span>
          </button>
     </div>
`;

export default class Alert extends HTMLElement {
     constructor(){
          super();

          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild( template.content.cloneNode(true) );

          this.type = this.getAttribute('type');
          this.shadowRoot.querySelector('div.alert').classList.add('alert-' + this.type);
     }
}

window.customElements.define('alert-info', Alert);