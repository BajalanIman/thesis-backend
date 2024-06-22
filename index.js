import express from "express";
import mysql from "mysql";
import cors from "cors";
import compression from "compression"; //for opt

const app = express();
const PORT = 8900;
app.use(cors());
// Serve static files from the 'public' directory, including the 'images' directory
app.use(compression()); //for opt
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));

// Create a connection to the "iman" database
//-------------------------------------------------------------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "master",
});

//  City ---------------------------------------------------------------------------
app.get("/city", (req, res) => {
  const q = "SELECT * FROM city";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
// Station -------------------------------------------------------------------------
app.get("/station", (req, res) => {
  const q = "SELECT * FROM station";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

//-------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.json("Hello Iman, this is the backend1!");
});

// Get all information of the table "student" from "iman" database
//-------------------------------------------------------------------------
app.get("/forstbotanischer", (req, res) => {
  /* const q = "SELECT * FROM student where name = 'Iman'  "; */
  const q = "SELECT * FROM forstbotanischer";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
//-------------------------------------------------------------------------
/***********************student**************************** */
// Create an API endpoint to insert a new record:
app.post("/forstbotanischer", (req, res) => {
  const { name, lastname, Picture } = req.body;

  const insertQuery =
    "INSERT INTO forstbotanischer (name, lastname, Picture) VALUES (?, ?, ?)";

  db.query(insertQuery, [name, lastname, Picture], (err, result) => {
    if (err) {
      console.error("Error inserting record:", err);
      return res.status(500).json({ error: "Error inserting record" });
    }
    return res.status(201).json({ message: "Record inserted successfully" });
  });
});

//Create an API endpoint to update a record:
app.put("/forstbotanischer/:id", (req, res) => {
  const { name, lastname, Picture } = req.body;
  const { id } = req.params;

  const updateQuery =
    "UPDATE forstbotanischer SET name=?, lastname=?, Picture=? WHERE forstbotanischer_id=?";

  db.query(updateQuery, [name, lastname, Picture, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error updating record" });
    }
    return res.status(200).json({ message: "Record updated successfully" });
  });
});

//Create an API endpoint to delete a record:
app.delete("/forstbotanischer/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery =
    "DELETE FROM forstbotanischer WHERE forstbotanischer_id=?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting record" });
    }
    return res.status(200).json({ message: "Record deleted successfully" });
  });
});

//************************************************************* */

// Get all information of the table "student" from "iman" database
//-------------------------------------------------------------------------
app.get("/airpolution", (req, res) => {
  /* const q = "SELECT * FROM student where name = 'Iman'  "; */
  const q = "SELECT * FROM airpolution";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
//-------------------------------------------------------------------------
/***********************student**************************** */
// Create an API endpoint to insert a new record:
app.post("/airpolution", (req, res) => {
  const {
    co,
    nh3,
    no,
    no2,
    O3,
    pm10,
    pm25,
    so2,
    date,
    station_id,
    lon,
    lat,
    stName,
  } = req.body;

  const insertQuery =
    "INSERT INTO airpolution (co,  nh3, no, no2, O3, pm10, pm25, so2,date, station_id, lon, lat, stName ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    insertQuery,
    [co, nh3, no, no2, O3, pm10, pm25, so2, date, station_id, lon, lat, stName],
    (err) => {
      if (err) {
        console.error("Error inserting record:", err);
        return res.status(500).json({ error: "Error inserting record" });
      }
      return res.status(201).json({ message: "Record inserted successfully" });
    }
  );
});

//Create an API endpoint to update a record:
app.put("/airpolution/:id", (req, res) => {
  const { name, lastname, Picture } = req.body;
  const { id } = req.params;

  const updateQuery =
    "UPDATE airpolution SET name=?, lastname=?, Picture=? WHERE airpolution_id=?";

  db.query(updateQuery, [name, lastname, Picture, id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error updating record" });
    }
    return res.status(200).json({ message: "Record updated successfully" });
  });
});

//Create an API endpoint to delete a record:
app.delete("/airpolution/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM airpolution WHERE airpolution_id=?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting record" });
    }
    return res.status(200).json({ message: "Record deleted successfully" });
  });
});

//************************************************************* */
// users table

// Get all information of the table "users" from "test" database
//-------------------------------------------------------------------------
app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
//-------------------------------------------------------------------------
/***********************student**************************** */
// Create an API endpoint to insert a new record:
app.post("/users", (req, res) => {
  const { password, first_name, last_name, phone_number, email, role } =
    req.body;

  const insertQuery =
    "INSERT INTO users (password, first_name, last_name, phone_number, email,role ) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    insertQuery,
    [password, first_name, last_name, phone_number, email, role],
    (err) => {
      if (err) {
        console.error("Error inserting record:", err);
        return res.status(500).json({ error: "Error inserting record" });
      }
      return res.status(201).json({ message: "Record inserted successfully" });
    }
  );
});

// soil measurements ------------------------------------------------------------------
app.get("/soil_measurements", (req, res) => {
  const q = "SELECT * FROM soil_measurements";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// climate_measurements -----------------------------------------------------------

app.get("/climate_measurements", (req, res) => {
  const q = "SELECT * FROM climate_measurements";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// photos ------------------------------------------------------------------

app.get("/photos", (req, res) => {
  const q = "SELECT * FROM photos";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Send data soil_measurements  .......................................................

// 4 -----------------------------------------------------------------------------------

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Endpoint to insert bulk soil data
app.post("/bulk_soil_measurements", (req, res) => {
  const records = req.body.map((record) => [
    record.station_id,
    record.soil_attribute_id,
    record.date_time,
    record.value,
  ]);

  const query = `
    INSERT INTO soil_measurements (station_id, soil_attribute_id, date_time, value)
    VALUES ?
    ON DUPLICATE KEY UPDATE value = VALUES(value)
  `;

  db.query(query, [records], (err, results) => {
    if (err) {
      console.error("Error inserting soil data:", err);
      res.status(500).send("Server error");
    } else {
      res.send("Soil data inserted/updated successfully");
    }
  });
});

// Endpoint to insert bulk climate data
app.post("/bulk_climate_measurements", (req, res) => {
  const records = req.body.map((record) => [
    record.station_id,
    record.climate_attribute_id,
    record.date_time,
    record.value,
  ]);

  const query = `
    INSERT INTO climate_measurements (station_id, climate_attribute_id, date_time, value)
    VALUES ?
    ON DUPLICATE KEY UPDATE value = VALUES(value)
  `;

  db.query(query, [records], (err, results) => {
    if (err) {
      console.error("Error inserting climate data:", err);
      res.status(500).send("Server error");
    } else {
      res.send("Climate data inserted/updated successfully");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Login ---------------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const selectQuery = "SELECT * FROM users WHERE email = ?";

  db.query(selectQuery, [email], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Error querying database" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", user });
  });
});

//Create an API endpoint to update a record:
app.put("/users/:id", (req, res) => {
  const { password, first_name, last_name, phone_number, email, role } =
    req.body;
  const { id } = req.params;

  const updateQuery =
    "UPDATE airpolution SET name=?, lastname=?, Picture=? WHERE airpolution_id=?";

  db.query(
    updateQuery,
    [password, first_name, last_name, phone_number, email, role, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error updating record" });
      }
      return res.status(200).json({ message: "Record updated successfully" });
    }
  );
});

//Create an API endpoint to delete a record:
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM airpolution WHERE airpolution_id=?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting record" });
    }
    return res.status(200).json({ message: "Record deleted successfully" });
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
