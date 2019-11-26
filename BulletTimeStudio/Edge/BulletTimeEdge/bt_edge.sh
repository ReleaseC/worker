pm2 start BulletTimeStudio/Edge/BulletTimeEdge/YIAgentServer/index.js --name YIAgent_Server
pm2 start BulletTimeStudio/Edge/BulletTimeEdge/YIAgent/index.js --name YIAgent
pm2 start BulletTimeStudio/Edge/BulletTimeEdge/EdgedoTasks/index.js --name EdgeDoTask
cd BulletTimeStudio/Edge/BulletTimeEdge/UserGuide && npm start
