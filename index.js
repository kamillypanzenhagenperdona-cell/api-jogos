const express = require('express');
const rotasJogos = require('./routes/jogos');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/jogos', rotasJogos);

app.get('/', (req, res) => {
    res.json({ mensagem: 'API de Jogos funcionando!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
