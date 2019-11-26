# curl -d '{"customerId":"hello", "siteId":"site_1", "taskId": "task1"}' -H "Content-Type: application/json" -X POST http://localhost:3000/task/task_create
curl -d '{"name":"siiva", "password":"7a05d1a0a575f7df313f4597e4d608f1"}' -H "Content-Type: application/json" -X POST http://localhost:3000/account/login
curl -d '{"name":"siiva1", "password":"7a05d1a0a575f7df313f4597e4d608f1"}' -H "Content-Type: application/json" -X POST http://localhost:3000/account/login
