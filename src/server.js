const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const uri = process.env.MONGO_URI || "mongodb://admin:senha123@localhost:27017/meu-app?authSource=admin";

mongoose.connect(uri)
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch(err => console.error("Erro de Conexão:", err));

const livro = mongoose.model('livro', { nome: String, ano: Number });

//ROTAS DO CRUD

app.post('/livros', async (req, res) => {
    try {
        const novolivro = new livro(req.body);
        await novolivro.save();
        res.status(201).send(novolivro);
    } catch (e) { res.status(500).send(e) }
});

app.get('/livros', async (req, res) => {
    const livros = await livro.find();
    res.send(livros);
});

app.put('/livros/:id', async (req, res) => {
    try {
        const livro = await livro.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(livro);
    } catch (e) { res.status(500).send(e) }
});

app.delete('/livros/:id', async (req, res) => {
    try {
        await livro.findByIdAndDelete(req.params.id);
        res.send({ message: "removido" });
    } catch (e) { res.status(500).send(e) }
});

app.listen(3000, () => console.log(" Servidor rodando em: http://localhost:3000"));