//Criando o objeto Despesa através de uma class
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo 
        this.descricao = descricao
        this.valor = valor
    }

    //Método para ver se todos os campos foram preenchidos pelo usuário
    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

//Objeto criado através de uma class, para controle das despesas no banco de dados
class Bd {
    constructor() {
        //Variável criada para trabalhar como uma propriedade privada do objeto, esta lógica será responsavel por atribuir o primeiro Id (de valor 0) ao banco de dados de dados. 
        let id = localStorage.getItem('id')
        
        if (id == null) {
            localStorage.setItem('id', 0)
        }
    }

    //Método que retorna o proximo id.
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    //Método que grava a despesa no banco de dados junto com seu respectivo id. Recebendo como parâmetro a despesa a qual deseja gravar.
    gravar(d) {
        //id recuperado através do método getProximoId deste mesmo objeto.
        let id = this.getProximoId()

        //Setando a despesa no banco de dados com seus id passado como Key, e como valor a despesa sendo passada para notação JSON.
        localStorage.setItem(id, JSON.stringify(d))

        //Atualização do valor do id.
        localStorage.setItem('id', id)
    }

    //Método que recuperá todos os registros passados de JSON para objeto em uma array.
    recuperarTodosRegistros() {
        let id = localStorage.getItem('id')
        let despesas = []

        //Estrutura de repetição para percorrer despesa por despesa e atribui-las a array 'despesas'.
        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            //Estrutura condicional para correção do banco de dados, caso alguma das despesas tenha sido apagada manualmente no localStorage.
            if(despesa == null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    //Método pesquisar, para filtrar as despesas que recebe como parâmetro 'p' e retornar uma array com todas as despesas filtradas através dos método .filter() que recebe uma outra função como parâmetro (callback).
    pesquisar(p) {
        let despesas = this.recuperarTodosRegistros()

        //Estrutura condicional para a filtragem de despesas, retornando apenas aquela a qual foi passada por parâmetro. Funcionando de maneira com que pegue sempre as despesas filtradas da estrutura condicional a cima e filtrando novamente.
        if (p.ano != '') {
            despesas = despesas.filter(f => f.ano == p.ano)
        }

        if (p.mes != '') {
            despesas = despesas.filter(f => f.mes == p.mes)
        }

        if (p.dia != '') {
            despesas = despesas.filter(f => f.dia == p.dia)
        }

        if (p.tipo != '') {
            despesas = despesas.filter(f => f.tipo == p.tipo)
        }

        if (p.descricao != '') {
            despesas = despesas.filter(f => f.descricao == p.descricao)
        }

        if (p.valor != '') {
            despesas = despesas.filter(f => f.valor == p.valor)
        }

        //Retorno da Array com somente as despesas filtradas.
        return despesas
    }

    //Método para remover a despesa do banco de dados, selecionando-a através do seu id passado por parâmetro.
    remover(id) {
        localStorage.removeItem(id)
    }
}

//Criando a instância do objeto Bd.
let bd = new Bd()

//Função utilizada para cadastrar uma nova despesa no banco de dados, ela é chamada no onclick do botão que adiciona novas despesas.
function cadastrarDespesa() {

    //Recuperando os elementos de input a qual passaremos o valor através do parâmetro para a criação da instância do objeto Despesa.
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //Criando a instância do objeto Despesa passando como parâmetro os valores dos inputs.
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    
    //Chamando o método validarDados() do objeto Despesa, para a verificar se todos os campos de input foram preenchidos.
    if(despesa.validarDados()) {

        //Gravação da despesa no banco de dados.
        bd.gravar(despesa)

        //Alterando o modal para a exibição do mesmo com uma mensagem de sucesso.
        document.getElementById('exampleModalLabel').innerText = 'Registro inserido com sucesso'
        document.getElementById('body-content').innerText = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('button').innerText = 'Voltar'
        document.getElementById('exampleModalLabel').className = 'modal-title text-success'
        document.getElementById('button').className = 'btn btn-success'
        
        //Comando em JQuery para a exibição do modal.
        $('#modalRegistraDespesa').modal('show')

        //Formatando os valores dos campos de input, deixando-os vazios novamente.
        ano.value = ''
        mes.value = '' 
        dia.value = '' 
        tipo.value = '' 
        descricao.value = '' 
        valor.value = ''

    } else {
        //Alterando o modal para a exibição do mesmo com uma mensagem de erro.
        document.getElementById('exampleModalLabel').innerText = 'Erro na inclusão de registro'
        document.getElementById('body-content').innerText = 'Existem campos obrigatórios que não foram preenchidos.'
        document.getElementById('button').innerText = 'Voltar e corrigir'
        document.getElementById('exampleModalLabel').className = 'modal-title text-danger'
        document.getElementById('button').className = 'btn btn-danger'

        $('#modalRegistraDespesa').modal('show')
    }
}

//Função que carrega do banco de dados as despesas e a exibe no html, esta está sendo chamada no onload() da página.
function carregaListaDespesas() {
    let despesas = bd.recuperarTodosRegistros()

    //Chamada da função responsavel por atribuir as despesas ao html.
    atribuirDespesas(despesas)
}

//Função que criará uma despesa a qual pesquisaremos pela mais semelhante atráves do método 'pesquisar', definido no objeto 'Bd'.
function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesasFiltradas = bd.pesquisar(despesa)

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    atribuirDespesas(despesasFiltradas)
}

//Função responsável por atribuir as despesas passadas por parâmetro ao html.
function atribuirDespesas(despesas) {
    let listaDespesas = document.getElementById('listaDespesas')

    despesas.forEach(function(d) {
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //Conversão do valor 'tipo' a uma string.
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML =`R$${d.valor}`

        //Criação do botão de exclusão de despesa.
        let botao = document.createElement('button')
        botao.type = 'button'
        botao.className = 'btn btn-danger'
        botao.innerHTML = '<i class="fas fa-times"></i>'
        botao.id = `id_despesa_${d.id}`
        botao.onclick = function() {
            document.getElementById('exampleModalLabel').innerText = 'Exclusão de registro'
            document.getElementById('body-content').innerText = 'Tem certeza que deseja excluir está despesa?'
            document.getElementById('buttonTrue').innerText = 'Excluir Despesa'
            document.getElementById('buttonFalse').innerText = 'Voltar'
            document.getElementById('exampleModalLabel').className = 'modal-title text-danger'
            document.getElementById('buttonTrue').className = 'btn btn-danger'
            document.getElementById('buttonFalse').className = 'btn btn-Secondary'
            document.getElementById('buttonTrue').onclick = () => {
                let id = botao.id.replace('id_despesa_', '')
                bd.remover(id)
                window.location.reload()
            }

            $('#modalRegistraDespesa').modal('show')
        }

        linha.insertCell(4).appendChild(botao)
    })
}