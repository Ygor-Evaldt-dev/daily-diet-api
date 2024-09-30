# Regras da aplicação

## Requisítos funcionais
- [x] Deve ser possível criar um usuário com as seguintes informações:
    - [x] E-mail
    - [x] Senha
- [x] Deve ser possível obter os dados do usuário
- [x] Deve ser possível atualizar os dados do usuário
- [] Deve ser possível identificar o usuário entre as requisições (sessionId)
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    - [x] Nome;
    - [x] Descrição;
    - [x] Data e Hora;
    - [x] Está dentro ou não da dieta;
- [] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [] Deve ser possível recuperar as métricas de um usuário
    - [x] Quantidade total de refeições registradas
    - [x] Quantidade total de refeições dentro da dieta
    - [x] Quantidade total de refeições fora da dieta
    - [x] Melhor sequência de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou


## Requisítos não funcionais
[x] - Senha da criação do usuário deve ser salva criptografada no banco de dados.