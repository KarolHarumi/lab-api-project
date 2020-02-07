const express = require("express"); 

const server = express();

server.use(express.json());

const projects = [
    { id: "1", title: ' Project XPTO', tasks: [] }, 
    { id: "2", title: ' Project X', tasks: [] }, 
    { id: "3", title: ' Project 987', tasks: [] }
];

/**
 * Global Middleware to count requisition
 */
server.use((req, res, next) => {
    console.count('Requests by now');
    return next();
});

/**
 * Local middleware to check if the project ID exist
 */
function checkID(req, res, next) {
    const {id} = req.params;

    if(!projects[id]) {
        return res.status(400).json({ error: 'Project ID does not exist'});
    }

    return next();
}

/**
 * Request body: id, title, task
 * Add a new project
 */
server.post('/projects', (req, res) => {
    const {id, title, tasks} = req.body;

    projects.push({
        id: id, 
        title:  title,
        tasks: [tasks]

    });

    return res.json(projects);
})

/**
 * Get all registered projects
 */
server.get('/projects', (req, res) => {
    return res.json(projects);
})

/**
 * Request body: title
 * Update a projects title
 */
server.put('/projects/:id', checkID, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects[id].title = title;

    return res.json(projects);
})

/**
 * Delete a project
 */
server.delete('/projects/:id', checkID, (req, res) => {
    const { id } = req.params;

    projects.splice(id, 1);

    return res.json(projects);
})

/**
 * Request body: tasks
 * Add a new task
 */
server.post('/projects/:id/tasks', checkID, (req, res) => {
    const {id} = req.params;
    const {tasks} = req.body;

    projects[id].tasks = tasks;
    
    return res.json(projects);
})

server.listen(3000);