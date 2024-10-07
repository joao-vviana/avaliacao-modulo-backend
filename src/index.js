import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem vindo à aplicação'
    })
})

const users = [{
    id: 1,
    name: "",
    email: "",
    password: ""
}]

// ETAPA DE CRIAÇÃO DE CONTA

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Preencha todos os dados.'
        })
    }

    if (name.length < 3) {
        return res.status(400).json({
            message: 'O nome deve ter pelo menos 3 caracteres.'
        });
    }

    const existingEmail = users.find(user => user.email === email);
    if (existingEmail) {
        return res.status(409).json({
            message: 'E-mail já está em uso.'
        })
    }

    const newUser = {
        id: users.length + 1, 
        name,
        email,
        password
    }

    users.push(newUser)

    return res.status(201).json({
        message: `Seja bem vindo ${newUser.name} ! Pessoa usuária registrada com sucesso!`
    })
})

// ETAPA DE LOGIN

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Insira um e-mail válido.'
        });
    }

    if (!password) {
        return res.status(400).json({
            message: 'Insira uma senha válida.'
        });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(404).json({
            message: 'Email não encontrado no sistema, verifique ou crie uma conta.'
        });
    }

    return res.status(200).json({
        message: `Seja bem vindo ${user.name}! Pessoa usuária logada com sucesso!`
    });
});

// ETAPA DE CRIAÇÃO DE MENSAGENS

const messages = [{
    id: 1,
    title: "",
    description: "",
}]

app.post('/message', (req, res) => {
    const { email, title, description } = req.body;

    if (!email || !title || !description) {
        return res.status(400).json({
            message: 'Preencha todos os campos: e-mail, título e descrição.'
        });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({
            message: 'E-mail não encontrado, verifique ou crie uma conta.'
        });
    }

    const newMessage = {
        id: messages.length + 1,
        title,
        description
    };

    messages.push(newMessage);

    return res.status(201).json({
        message: `Mensagem criada com sucesso: ${newMessage.title}`,
        messages: newMessage
    });
});

// ETAPA DE LER MENSAGENS

app.get('/messages/:email', (req, res) => {
    const { email } = req.params;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({
            message: 'E-mail não encontrado, verifique ou crie uma conta.'
        });
    }

    // Filtrar as mensagens associadas a esse usuário
    const userMessages = messages.filter(m => m.userId === user.id);

    return res.status(200).json({
        message: `Seja bem-vinde!`,
        messages: userMessages
    });
});

// ETAPA PARA ATUALIZAR A MENSAGEM

app.put('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const messageToUpdate = messages.find(m => m.id === parseInt(id));

    if (!messageToUpdate) {
        return res.status(400).json({
            message: 'Por favor, informe um ID válido da mensagem.'
        });
    }

    messageToUpdate.title = title;
    messageToUpdate.description = description;

    return res.status(200).json({
        message: `Mensagem atualizada com sucesso: ${messageToUpdate.title}`,
    });
});

// ETAPA PARA DELETAR MENSAGEM

app.delete('/messages/:id', (req, res) => {
    const { id } = req.params;

    const messageToDelete = messages.find(m => m.id === parseInt(id));

    if (!messageToDelete) {
        return res.status(404).json({
            message: 'Mensagem não encontrada, verifique o identificador em nosso banco.'
        });
    }

    // Remover a mensagem do array
    messages.splice(messages.indexOf(messageToDelete), 1);

    return res.status(200).json({
        message: 'Mensagem apagada com sucesso'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



