const express = require('express');
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded





app.listen(3000, () => {
	console.log(`Server listening on port 3000...`);
});