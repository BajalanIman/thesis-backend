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

//--------------------------------------------------------------------------

app.get("/combinedData", (req, res) => {
  const q = `
    SELECT *
    FROM city 
    LEFT JOIN station ON city.city_id = station.city_id
    LEFT JOIN information ON station.station_id = information.station_id
    LEFT JOIN equipments ON information.station_id = equipments.station_id
    LEFT JOIN photos ON station.station_id = photos.station_id
    LEFT JOIN openweather ON station.station_id = openweather.station_id
    LEFT JOIN pollutants ON openweather.weather_id = pollutants.weather_id
    LEFT JOIN currentweather ON openweather.weather_id = currentweather.weather_id
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    // Organize the data into a nested structure
    const organizedData = {};

    data.forEach((row) => {
      const {
        city_id,
        city_name,
        // ...other columns from city table

        station_id,
        station_name,
        longitude,
        latitude,
        panorama,
        photo,
        info_one_en,
        info_one_de,
        info_one_fr,
        info_two_en,
        info_two_de,
        info_two_fr,
        equipments_id,
        equipments_en,
        equipments_de,
        equipments_fr,
        ow_station_name,
        ow_longitude,
        ow_latitude,
        weather_id,
        pollutants,
        nh3,
        no,
        no2,
        o3,
        so2,
        pm2,
        pm10,
        plu_date_timme,
        day_temp,
        night_temp,
        eve_temp,
        morn_temp,
        min_temp,
        max_temp,
        pressure,
        humidity,
        dew_point,
        wind_speed,
        wind_deg,
        wind_gust,
        clouds,
        pop,
        rain,
        uvi,
        co,
        cu_date_time,

        // ...other columns from station table

        // Add more variables as needed from other joined tables
      } = row;

      if (!organizedData[city_id]) {
        organizedData[city_id] = {
          cityInfo: {
            city_name,
            // ...assign city-related data here
          },
          stations: {},
        };
      }

      if (!organizedData[city_id].stations[station_id]) {
        organizedData[city_id].stations[station_id] = {
          station_name,
          longitude,
          latitude,
          // ...assign station-related data here

          // Add more nested structures for other tables related to station
          panorama,
          photos: [],
          equipments: [],
        };
      }
      //photos------------------------------------------------------------------------

      const photoKey = `${photo}`;

      if (
        !organizedData[city_id].stations[station_id].photos.includes(photoKey)
      ) {
        organizedData[city_id].stations[station_id].photos.push(photoKey);
      }

      organizedData[city_id].stations[station_id].information = {
        info_one_en,
        info_one_de,
        info_one_fr,
        info_two_en,
        info_two_de,
        info_two_fr,
      };
      // organizedData[city_id].stations[station_id].equipments = {
      //   equipments_en,
      //   equipments_de,
      //   equipments_fr,
      // };

      // equipments ----------------------------------------------------
      const equipmentsArray = [
        `${equipments_en}`,
        `${equipments_de}`,
        `${equipments_fr}`,
      ];

      equipmentsArray.forEach((e) => {
        if (
          !organizedData[city_id].stations[station_id].equipments.includes(e)
        ) {
          organizedData[city_id].stations[station_id].equipments.push(
            equipments_en,
            equipments_de,
            equipments_fr
          );
        }
      });

      //openweather ----------------------------------------------------------
      organizedData[city_id].stations[station_id].openweather = {
        ow_station_name,
        ow_longitude,
        ow_latitude,
      };
      // pollutants ----------------------------------------------------------
      if (!organizedData[city_id].stations[station_id].pollutants) {
        organizedData[city_id].stations[station_id].pollutants = [];
      }

      // Check if the timestamp already exists in pollutants array
      const timestampExists = organizedData[city_id].stations[
        station_id
      ].pollutants.some(
        (pollutant) =>
          new Date(pollutant.plu_date_timme).getTime() ===
          new Date(plu_date_timme).getTime()
      );

      if (!timestampExists) {
        // Push the pollutants data as a new object into the pollutants array
        organizedData[city_id].stations[station_id].pollutants.push({
          nh3,
          no,
          no2,
          o3,
          so2,
          pm2,
          pm10,
          co,
          plu_date_timme,
        });
      }

      // currentweather ------------------------------------------------------------
      if (!organizedData[city_id].stations[station_id].currentweather) {
        organizedData[city_id].stations[station_id].currentweather = [];
      }

      // Check if the timestamp already exists in pollutants array
      const timestampExistss = organizedData[city_id].stations[
        station_id
      ].currentweather.some(
        (currentweather) =>
          new Date(currentweather.cu_date_time).getTime() ===
          new Date(cu_date_time).getTime()
      );

      if (!timestampExistss) {
        // Push the pollutants data as a new object into the pollutants array
        organizedData[city_id].stations[station_id].currentweather.push({
          day_temp,
          night_temp,
          eve_temp,
          morn_temp,
          min_temp,
          max_temp,
          pressure,
          humidity,
          dew_point,
          wind_speed,
          wind_deg,
          wind_gust,
          clouds,
          pop,
          rain,
          uvi,
          cu_date_time,
        });
      }
      // ------------------------------

      // organizedData[city_id].stations[station_id].currentweather = {
      //   day_temp,
      //   night_temp,
      //   eve_temp,
      //   morn_temp,
      //   min_temp,
      //   max_temp,
      //   pressure,
      //   humidity,
      //   dew_point,
      //   wind_speed,
      //   wind_deg,
      //   wind_gust,
      //   clouds,
      //   pop,
      //   rain,
      //   uvi,
      //   co,
      //   cu_date_time,
      // };

      // Add more nested structures for other tables related to station

      // Assign data to other nested structures as needed

      // organizedData[city_id].stations[station_id].openweather = { ... };
      // organizedData[city_id].stations[station_id].pollutants = { ... };
      // organizedData[city_id].stations[station_id].currentweather = { ... };
    });

    return res.json(organizedData);
  });
});

//---------------------------------------------------------------------------

//app.get("/combinedData", (req, res) => {
//  const q = `
//    SELECT *
//    FROM city
//    LEFT JOIN station ON city.city_id = station.city_id
//    LEFT JOIN information ON station.station_id = information.station_id
//    LEFT JOIN equipments ON information.station_id = equipments.station_id
//    LEFT JOIN photos ON station.station_id = photos.station_id
//    LEFT JOIN openweather ON station.station_id = openweather.station_id
//    LEFT JOIN pollutants ON openweather.weather_id = pollutants.weather_id
//    LEFT JOIN currentweather ON openweather.weather_id = currentweather.weather_id
//  `;
//
//  db.query(q, (err, data) => {
//    if (err) {
//      console.log(err);
//      return res.json(err);
//    }
//    return res.json(data);
//  });
//});

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
// 3 -----------------------------------------------------------------------------------
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     throw err;
//   }
//   console.log("Connected to MySQL database");
// });

// const checkRecords = (table, attributeIdField, req, res) => {
//   const records = req.body;

//   if (!Array.isArray(records) || records.length === 0) {
//     return res
//       .status(400)
//       .json({ error: "Invalid data format or empty array" });
//   }

//   const uniqueKeys = records.map(
//     (record) => `${record[attributeIdField]}_${record.date_time}`
//   );
//   const placeholders = records.map(() => "(?, ?, ?)").join(", ");
//   const values = records.flatMap((record) => [
//     record.station_id,
//     record[attributeIdField],
//     record.date_time,
//   ]);

//   const query = `SELECT ${attributeIdField}, date_time FROM ${table} WHERE (station_id, ${attributeIdField}, date_time) IN (${placeholders})`;

//   db.query(query, values, (err, results) => {
//     if (err) {
//       console.error(`Error checking existing records in ${table}:`, err);
//       return res.status(500).json({ error: "Error checking existing records" });
//     }
//     const existingRecords = results.map(
//       (result) => `${result[attributeIdField]}_${result.date_time}`
//     );
//     res.json({ existingRecords });
//   });
// };

// app.post("/check_soil_records", (req, res) => {
//   checkRecords("soil_measurements", "soil_attribute_id", req, res);
// });

// app.post("/check_climate_records", (req, res) => {
//   checkRecords("climate_measurements", "climate_attribute_id", req, res);
// });

// app.post("/bulk_soil_measurements", (req, res) => {
//   console.log("Received soil measurements data");
//   const measurements = req.body;
//   console.log(`Number of soil measurements: ${measurements.length}`);

//   if (!Array.isArray(measurements) || measurements.length === 0) {
//     console.error("Invalid data format or empty array for soil measurements");
//     return res
//       .status(400)
//       .json({ error: "Invalid data format or empty array" });
//   }

//   const insertQuery = `
//     INSERT INTO soil_measurements (station_id, soil_attribute_id, date_time, value)
//     VALUES ?`;

//   const values = measurements.map(
//     ({ station_id, soil_attribute_id, date_time, value }) => [
//       station_id,
//       soil_attribute_id,
//       date_time,
//       value,
//     ]
//   );

//   db.query(insertQuery, [values], (err) => {
//     if (err) {
//       console.error("Error inserting soil measurements records:", err);
//       return res.status(500).json({ error: "Error inserting records" });
//     }
//     console.log("Records inserted successfully into soil_measurements");
//     return res.status(201).json({ message: "Records inserted successfully" });
//   });
// });

// app.post("/bulk_climate_measurements", (req, res) => {
//   console.log("Received climate measurements data");
//   const measurements = req.body;
//   console.log(`Number of climate measurements: ${measurements.length}`);

//   if (!Array.isArray(measurements) || measurements.length === 0) {
//     console.error(
//       "Invalid data format or empty array for climate measurements"
//     );
//     return res
//       .status(400)
//       .json({ error: "Invalid data format or empty array" });
//   }

//   const insertQuery = `
//     INSERT INTO climate_measurements (station_id, climate_attribute_id, date_time, value)
//     VALUES ?`;

//   const values = measurements.map(
//     ({ station_id, climate_attribute_id, date_time, value }) => [
//       station_id,
//       climate_attribute_id,
//       date_time,
//       value,
//     ]
//   );

//   db.query(insertQuery, [values], (err) => {
//     if (err) {
//       console.error("Error inserting climate measurements records:", err);
//       return res.status(500).json({ error: "Error inserting records" });
//     }
//     console.log("Records inserted successfully into climate_measurements");
//     return res.status(201).json({ message: "Records inserted successfully" });
//   });
// });

// const PORT = 8900;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
//  2 -----------------------------------------------------------------------------------
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     throw err;
//   }
//   console.log("Connected to MySQL database");
// });

// app.post("/bulk_soil_measurements", (req, res) => {
//   console.log("Received soil measurements data");
//   const measurements = req.body;
//   console.log(`Number of soil measurements: ${measurements.length}`);

//   if (!Array.isArray(measurements) || measurements.length === 0) {
//     console.error("Invalid data format or empty array for soil measurements");
//     return res
//       .status(400)
//       .json({ error: "Invalid data format or empty array" });
//   }

//   const insertQuery = `
//     INSERT INTO soil_measurements (station_id, soil_attribute_id, date_time, value)
//     VALUES ?`;

//   const values = measurements.map(
//     ({ station_id, soil_attribute_id, date_time, value }) => [
//       station_id,
//       soil_attribute_id,
//       date_time,
//       value,
//     ]
//   );

//   db.query(insertQuery, [values], (err) => {
//     if (err) {
//       console.error("Error inserting soil measurements records:", err);
//       return res.status(500).json({ error: "Error inserting records" });
//     }
//     console.log("Records inserted successfully into soil_measurements");
//     return res.status(201).json({ message: "Records inserted successfully" });
//   });
// });

// app.post("/bulk_climate_measurements", (req, res) => {
//   console.log("Received climate measurements data");
//   const measurements = req.body;
//   console.log(`Number of climate measurements: ${measurements.length}`);

//   if (!Array.isArray(measurements) || measurements.length === 0) {
//     console.error(
//       "Invalid data format or empty array for climate measurements"
//     );
//     return res
//       .status(400)
//       .json({ error: "Invalid data format or empty array" });
//   }

//   const insertQuery = `
//     INSERT INTO climate_measurements (station_id, climate_attribute_id, date_time, value)
//     VALUES ?`;

//   const values = measurements.map(
//     ({ station_id, climate_attribute_id, date_time, value }) => [
//       station_id,
//       climate_attribute_id,
//       date_time,
//       value,
//     ]
//   );

//   db.query(insertQuery, [values], (err) => {
//     if (err) {
//       console.error("Error inserting climate measurements records:", err);
//       return res.status(500).json({ error: "Error inserting records" });
//     }
//     console.log("Records inserted successfully into climate_measurements");
//     return res.status(201).json({ message: "Records inserted successfully" });
//   });
// });

// const PORT = 8900;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// 1 -------------------------------------------------------
//  app.post("/soil_measurements", (req, res) => {
//   const { station_id, soil_attribute_id, date_time, value } = req.body;
//   console.log("Received data:", req.body);

//   const checkDuplicateQuery = `
//     SELECT * FROM soil_measurements
//     WHERE date_time = ? AND soil_attribute_id = ? LIMIT 1`;

//   db.query(
//     checkDuplicateQuery,
//     [date_time, soil_attribute_id],
//     (err, results) => {
//       if (err) {
//         console.error("Error checking duplicate record:", err);
//         return res
//           .status(500)
//           .json({ error: "Error checking duplicate record" });
//       }

//       if (results.length > 0) {
//         console.log("Duplicate record found, skipping insertion");
//         return res
//           .status(200)
//           .json({ message: "Record already exists, skipping insertion" });
//       } else {
//         const insertQuery = `
//         INSERT INTO soil_measurements (station_id, soil_attribute_id, date_time, value)
//         VALUES (?, ?, ?, ?)`;

//         db.query(
//           insertQuery,
//           [station_id, soil_attribute_id, date_time, value],
//           (err) => {
//             if (err) {
//               console.error("Error inserting record:", err);
//               return res.status(500).json({ error: "Error inserting record" });
//             }
//             console.log("Record inserted successfully");
//             return res
//               .status(201)
//               .json({ message: "Record inserted successfully" });
//           }
//         );
//       }
//     }
//   );
// });

// // Send data climate_measurements  .......................................................
// app.post("/climate_measurements", (req, res) => {
//   const { station_id, climate_attribute_id, date_time, value } = req.body;
//   console.log("Received data for climate_measurements:", req.body);

//   // Ensure all required fields are present
//   if (
//     !station_id ||
//     !climate_attribute_id ||
//     !date_time ||
//     value === undefined
//   ) {
//     console.error("Missing required field in the request body");
//     return res.status(400).json({ error: "Missing required field" });
//   }

//   const checkDuplicateQuery = `
//     SELECT * FROM climate_measurements
//     WHERE date_time = ? AND climate_attribute_id = ? LIMIT 1`;

//   db.query(
//     checkDuplicateQuery,
//     [date_time, climate_attribute_id],
//     (err, results) => {
//       if (err) {
//         console.error(
//           "Error checking duplicate record in climate_measurements:",
//           err
//         );
//         return res
//           .status(500)
//           .json({ error: "Error checking duplicate record" });
//       }

//       if (results.length > 0) {
//         console.log(
//           "Duplicate record found in climate_measurements, skipping insertion"
//         );
//         return res
//           .status(200)
//           .json({ message: "Record already exists, skipping insertion" });
//       } else {
//         const insertQuery = `
//         INSERT INTO climate_measurements (station_id, climate_attribute_id, date_time, value)
//         VALUES (?, ?, ?, ?)`;

//         db.query(
//           insertQuery,
//           [station_id, climate_attribute_id, date_time, value],
//           (err) => {
//             if (err) {
//               console.error(
//                 "Error inserting record into climate_measurements:",
//                 err
//               );
//               return res.status(500).json({ error: "Error inserting record" });
//             }
//             console.log(
//               "Record inserted successfully into climate_measurements"
//             );
//             return res
//               .status(201)
//               .json({ message: "Record inserted successfully" });
//           }
//         );
//       }
//     }
//   );
// });

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
