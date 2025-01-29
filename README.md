# Relatório: Implementação do Algoritmo de Peterson em Node.js

## Introdução

O Algoritmo de Peterson é um método clássico para garantir exclusão mútua em sistemas concorrentes. Ele é utilizado para evitar que dois processos acessem simultaneamente uma região crítica, prevenindo condições de corrida.

Este relatório documenta a implementação de uma aplicação em **Node.js** que utiliza o algoritmo de Peterson para proteger um recurso compartilhado dentro de um servidor **Express**.

## Objetivo

O objetivo da aplicação é simular dois "processos" que tentam acessar um recurso compartilhado, garantindo que apenas um processo por vez possa executá-lo. A proteção é feita pelo algoritmo de Peterson.

## Implementação

### Estrutura da Aplicação

A aplicação possui um servidor **Express** que expõe um endpoint HTTP para simular dois processos concorrentes acessando um recurso compartilhado.

- **Algoritmo de Peterson:** Controla o acesso à seção crítica.
- **Recurso Compartilhado:** Um contador que é incrementado cada vez que um processo entra na seção crítica.
- **Endpoint `/process/:id`**: Simula um processo tentando acessar a seção crítica.

### Código-Fonte

Abaixo está a implementação do servidor em **Node.js**:

```javascript
const express = require("express");
const app = express();
const port = 3000;

// Implementação do Algoritmo de Peterson
class PetersonLock {
  constructor() {
    this.flag = [false, false];
    this.turn = 0;
  }

  lock(process) {
    const other = 1 - process;
    this.flag[process] = true;
    this.turn = other;

    while (this.flag[other] && this.turn === other) {}
  }

  unlock(process) {
    this.flag[process] = false;
  }
}

const petersonLock = new PetersonLock();
let sharedResource = 0;

async function criticalSection(process) {
  console.log(`Processo ${process} entrou na seção crítica`);
  sharedResource++;
  console.log(`Recurso compartilhado: ${sharedResource}`);
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log(`Processo ${process} saiu da seção crítica`);
      resolve();
    }, 1000)
  );
}

app.get("/process/:id", async (req, res) => {
  const process = parseInt(req.params.id);

  if (![0, 1].includes(process)) {
    return res.status(400).send("Processo inválido. Use 0 ou 1.");
  }

  petersonLock.lock(process);

  try {
    await criticalSection(process);
    res.send(`Processo ${process} acessou a seção crítica com sucesso!`);
  } finally {
    petersonLock.unlock(process);
  }
});

app.listen(port, () => {
  console.log(`Aplicacao rodando em http://localhost:${port}`);
});
```

## Execução e Testes

1. **Baixar pacotes necessarios:**

    ```bash
    npm install express
    ```

2. **Iniciar a aplicação:**

   ```bash
   node app.js
   ```

3. **Fazer requisições simultâneas:**

   ```bash
   curl http://localhost:3000/process/0
   curl http://localhost:3000/process/1
   ```

4. **Saída esperada no terminal:**
   ```plaintext
   Processo 0 entrou na seção crítica
   Recurso compartilhado: 1
   Processo 0 saiu da seção crítica
   Processo 1 entrou na seção crítica
   Recurso compartilhado: 2
   Processo 1 saiu da seção crítica
   ```

Isso confirma que os processos acessam a seção crítica um de cada vez, conforme esperado.

## Conclusão

A implementação do Algoritmo de Peterson em Node.js garante que dois processos não acessem simultaneamente um recurso compartilhado. Embora o Node.js seja baseado em um modelo de thread única, a aplicação pode simular exclusão mútua de forma eficiente. Este tipo de controle é especialmente útil para proteger recursos em sistemas distribuídos e concorrentes.


## ✍️ Equipe de um Aluno

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/154340363?v=4" width=115><br><sub>Jose Danilo Santos do Nascimento</sub>](https://github.com/JoseDaniloS) |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
