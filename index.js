require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/pets?properties=name,type,breed';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const pets = response.data.results;
    res.render('homepage', { title: 'Pet List | Practicum', pets });
  } catch (error) {
    console.error('Error fetching pets:', error.response?.data || error.message);
    res.status(500).send('Failed to load pets.');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
  const { name, type, breed } = req.body;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
  const url = 'https://api.hubapi.com/crm/v3/objects/pets';

  try {
    await axios.post(url, { properties: { name, type, breed } }, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating pet:', error.response?.data || error.message);
    res.status(500).send('Failed to create pet.');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
