const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

// READ operation - retrieve all hospitals
app.get('/hospitals', (req, res) => {
  const hospitals = JSON.parse(fs.readFileSync('hospitals.json'));
  res.send(hospitals);
});

// CREATE operation - add a new hospital
app.post('/hospitals', (req, res) => {
  try {
    const hospitals = JSON.parse(fs.readFileSync('hospitals.json'));
    const newHospital = {
      name: req.body.name,
      patientCount: req.body.patientCount,
      location: req.body.location
      
    };
    hospitals.hospitals.push(newHospital);
    fs.writeFileSync('hospitals.json', JSON.stringify(hospitals));
    res.send(newHospital);
  } catch (error) {
    res.status(500).send('Error adding hospital');
  }
});

// UPDATE operation - update an existing hospital and this need id and it is not possible in json file with postman
app.put('/hospitals/:id', (req, res) => {
  try {
    const hospitals = JSON.parse(fs.readFileSync('hospitals.json'));
    const hospitalToUpdate = hospitals.hospitals.find(h => h.name === req.params.id);
    if (hospitalToUpdate) {
      hospitalToUpdate.patientCount = req.body.patientCount;
      hospitalToUpdate.location = req.body.location;
      fs.writeFileSync('hospitals.json', JSON.stringify(hospitals));
      res.send(hospitalToUpdate);
    } else {
      res.status(404).send('Hospital not found');
    }
  } catch (error) {
    res.status(500).send('Error updating hospital');
  }
});

// DELETE operation - delete an existing hospital, since we cant provide id in json file using postman, this code is not useful
app.delete('/hospitals/:id', (req, res) => {
  try {
    const hospitals = JSON.parse(fs.readFileSync('hospitals.json'));
    const hospitalIndex = hospitals.hospitals.findIndex(h => h.name === req.params.id);
    if (hospitalIndex !== -1) {
      hospitals.hospitals.splice(hospitalIndex, 1);
      fs.writeFileSync('hospitals.json', JSON.stringify(hospitals));
      res.send('Hospital deleted');
    } else {
      res.status(404).send('Hospital not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting hospital');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
