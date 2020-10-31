const app = require('express')();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send("API RUNNING"))

app.listen(PORT, () => console.info(`Server running on port ${PORT}`))