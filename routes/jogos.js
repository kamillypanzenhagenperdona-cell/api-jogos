const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, '..', 'data', 'jogos.json');

function lerJogos() {
    return JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
}

function salvarJogos(jogos) {
    fs.writeFileSync(ARQUIVO, JSON.stringify(jogos, null, 2), 'utf-8');
}

function gerarId(jogos) {
    if (jogos.length === 0) return 1;
    return Math.max(...jogos.map(j => j.id)) + 1;
}

// GET /jogos - com filtros opcionais via Query Parameters (incluindo o desafio nota_min)
router.get('/', (req, res) => {
    let jogos = lerJogos();
    const { nome, categoria, plataforma, nota_min } = req.query;

    if (nome) {
        jogos = jogos.filter(j => j.nome.toLowerCase().includes(nome.toLowerCase()));
    }
    if (categoria) {
        jogos = jogos.filter(j => j.categoria.toLowerCase() === categoria.toLowerCase());
    }
    if (plataforma) {
        jogos = jogos.filter(j => j.plataforma.toLowerCase() === plataforma.toLowerCase());
    }
    if (nota_min) {
        jogos = jogos.filter(j => j.nota >= Number(nota_min));
    }

    res.json(jogos);
});

// GET /jogos/:id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const jogo = lerJogos().find(j => j.id === id);

    if (!jogo) {
        return res.status(404).json({ erro: 'Jogo nao encontrado!' });
    }

    res.json(jogo);
});

// POST /jogos
router.post('/', (req, res) => {
    const jogos = lerJogos();
    const { nome, categoria, plataforma, nota } = req.body;

    if (!nome || !categoria || !plataforma) {
        return res.status(400).json({ erro: 'Campos obrigatorios: nome, categoria, plataforma' });
    }

    const novoJogo = {
        id: gerarId(jogos),
        nome,
        categoria,
        plataforma,
        nota: nota ? Number(nota) : 0
    };

    jogos.push(novoJogo);
    salvarJogos(jogos);
    
    res.status(201).json(novoJogo);
});

// PUT /jogos/:id
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const jogos = lerJogos();
    const index = jogos.findIndex(j => j.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Jogo nao encontrado!' });
    }

    jogos[index] = { ...jogos[index], ...req.body, id };
    salvarJogos(jogos);

    res.json(jogos[index]);
});

// DELETE /jogos/:id
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const jogos = lerJogos();
    const index = jogos.findIndex(j => j.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Jogo nao encontrado!' });
    }

    const removido = jogos[index];
    jogos.splice(index, 1);
    salvarJogos(jogos);

    res.json({ mensagem: `${removido.nome} removido com sucesso!` });
});

module.exports = router;
