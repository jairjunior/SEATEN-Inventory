"use strict";

const template = document.createElement('template');
template.innerHTML = `
     <style>
          .fade-out {
               animation: fadeOut 1s ease-out forwards, shrink 1.5s ease-in forwards;
          }
          @keyframes fadeOut {
               from { opacity: 1; }
               to { opacity: 0; }
          }
          @keyframes shrink {
               100% { height: 0px; }
          }
     </style>
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

     connectedCallback(){
          this.shadowRoot.querySelector('button.close').addEventListener('click', () => {
               this.shadowRoot.querySelector('div.alert').classList.add('fade-out');
               setTimeout( () => this.remove(), 1500);
          });
     }

     disconnectedCallback(){
          this.shadowRoot.querySelector('button.close').removeEventListener();
     }

}

window.customElements.define('alert-info', Alert);