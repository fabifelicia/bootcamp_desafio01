const express = require("express");

const server = express();

server.use(express.json());

let qtd_requisicoes = 0;

const projects = [];

//Middleware que checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

//Middleware que mostra a qtd de requisições
function logRequests(req, res, next) {
  qtd_requisicoes++;

  console.log(`Número de requisições: ${qtd_requisicoes}`);

  return next();
}

server.use(logRequests);

//Rota para criação de um projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Rota para listagem de projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Rota para alterar o nome do projeto
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Rota para deletar um projeto
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Rota para adicionar uma tarefa ao projeto
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
