const express = require('express');
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
  return new Promise(resolve => setTimeout(() => {
    console.log(`Processo ${process} saiu da seção crítica`);
    resolve();
  }, 1000));
}

app.get('/process/:id', async (req, res) => {
  const process = parseInt(req.params.id);

  if (![0, 1].includes(process)) {
    return res.status(400).send('Processo inválido. Use 0 ou 1.');
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