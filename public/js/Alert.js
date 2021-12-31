"use strict";

const template = document.createElement('template');
template.innerHTML = `
     <style>
          .alert {
               margin-top: 3rem;
               padding: 0.75rem 1.25rem;
               border: 1px solid transparent;
               border-radius: 0.25rem;
          }
          .alert-success {
               color: #155724;
               background-color: #d4edda;
               border-color: #c3e6cb;
          }
          .alert-danger {
               color: #721c24;
               background-color: #f8d7da;
               border-color: #f5c6cb;
          }
          .flex {
               display: flex;
               flex-wrap: nowrap;
               justify-content: space-between;
               align-items: center;
          }
          p {
               display: inline-block;
               margin: 0;
          }
          .close {
               border: 0;
               padding: 0;
               font-size: 1.5rem;
               font-weight: 700;
               color: #000;
               text-shadow: 0 1px 0 #fff;
               opacity: 0.5;
               line-height: 1;
               cursor: pointer;
               background-color: transparent;
               font-family: inherit;
          }
          .fade-out {
               animation: fadeOut 0.5s ease-out forwards;
          }
          @keyframes fadeOut {
               from { opacity: 1; }
               to { opacity: 0; }
          }
          @media screen and (max-width: 991px){
               .close {
                    padding-left: 1rem;
               }
          }
     </style>
     <div class="alert flex" role="alert">
          <p>
               <slot name="alertSymbol"></slot>
               <slot name="alertText"></slot>
          </p>
          <button type="button" class="close" aria-label="Close">
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
               setTimeout( () => this.remove(), 500);
          });
     }

     disconnectedCallback(){
          this.shadowRoot.querySelector('button.close').removeEventListener();
     }

}

window.customElements.define('alert-info', Alert);