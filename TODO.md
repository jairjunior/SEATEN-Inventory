# TODO LIST

## Tip-off

This TODO List is written in Brazilian Portuguese to facilitate my work during the development of this very application.
If you are interested in understand what I have wrote down, the notes are written in a very proper fashion, with accurate grammar, which enables you to translate the text using an online service, such as Google Translate, and get a reliable English translation.

## Refatoração

- Realizar teste na aplicação para verificar a permanência de dados no Local Storage do navegador quando a sessão (aba) é encerrada. Provavelmente, será necessário corrigir o código e alterar todas as ações do Local Storage para o Session Storage, de forma que a aplicação não deixe resquícios no navegador dos dados que manipulou durante uma sessão do usuário.
- Durante a refatoração do código, tentar inserir data-attributes nas tags HTML de forma que eles sejam utilizados para manipulação do código JavaScript.
- Separar o código em módulos com objetivos bem específicos, sejam eles visuais ou comportamentais. Deve-se separar os módulos em arquivos distintos e utilizar as diretivas de import/export do ES6.
- Modificar todas requisições HTTP utilizando a API fetch ou a biblioteca Axios, pois os métodos XMLHttpRequest estão depreciados, gerando mensagens de alerta no console do navegador.
- Concentrar todas as funções que realizam uma requisição HTTP para o servidor num único módulo e exportar estas funções como objeto para serem utilizadas nos demais módulos.

## Bugfix



## Novas Funcionalidades

